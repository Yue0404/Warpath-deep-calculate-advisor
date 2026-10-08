import { normalizeProbabilityData } from './probability-data.js';

const SERIES = [
  { key: 'probabilityDecreaseTwo', color: '#cc1937' },
  { key: 'probabilityDecreaseOne', color: '#f47d28' },
  { key: 'probabilityUnchanged', color: '#f2bd00' },
  { key: 'probabilityIncreaseOne', color: '#73bc3f' },
  { key: 'probabilityIncreaseTwo', color: '#558d2d' },
];

let chartLibraryPromise = null;

function loadChartLibrary() {
  if (globalThis.Chart) return Promise.resolve(globalThis.Chart);
  if (chartLibraryPromise) return chartLibraryPromise;

  chartLibraryPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = new URL('../vendor/chart.umd.js', import.meta.url).href;
    script.async = true;
    script.dataset.probabilityChart = 'true';
    script.onload = () => globalThis.Chart
      ? resolve(globalThis.Chart)
      : reject(new Error('Chart.js 未能初始化'));
    script.onerror = () => reject(new Error('Chart.js 加载失败'));
    document.head.append(script);
  }).catch((error) => {
    document.querySelector('script[data-probability-chart="true"]')?.remove();
    chartLibraryPromise = null;
    throw error;
  });
  return chartLibraryPromise;
}

export function createProbabilityViewer({ translate, chartLibraryLoader = loadChartLibrary }) {
  const button = document.getElementById('view-probabilities');
  const dialog = document.getElementById('probability-dialog');
  const title = document.getElementById('probability-title');
  const canvas = document.getElementById('probability-canvas');
  const details = document.getElementById('probability-data');
  const tableHost = document.getElementById('probability-table');
  const closeButton = document.getElementById('probability-close');
  const chartFrame = canvas?.closest('.probability-chart-frame');
  if (![button, dialog, title, canvas, details, tableHost, closeButton, chartFrame].every(Boolean)) {
    throw new TypeError('概率图表界面缺少必要的 HTML 元素');
  }

  const legend = document.createElement('ul');
  legend.className = 'probability-legend';
  legend.setAttribute('aria-label', translate('probabilityTitle'));
  const legendItems = SERIES.map(({ key, color }) => {
    const item = document.createElement('li');
    const swatch = document.createElement('span');
    swatch.className = 'probability-legend-swatch';
    swatch.style.backgroundColor = color;
    swatch.setAttribute('aria-hidden', 'true');
    const label = document.createElement('span');
    item.append(swatch, label);
    legend.append(item);
    return { key, label };
  });
  chartFrame.before(legend);

  const plot = document.createElement('div');
  plot.className = 'probability-chart-plot';
  canvas.replaceWith(plot);
  plot.append(canvas);
  canvas.setAttribute('role', 'img');

  const status = document.createElement('p');
  status.className = 'probability-chart-status';
  status.setAttribute('role', 'status');
  status.hidden = true;
  const retryButton = document.createElement('button');
  retryButton.type = 'button';
  retryButton.hidden = true;
  chartFrame.after(status, retryButton);

  let model = null;
  let chart = null;
  let chartPhase = 'idle';
  let chartRequest = 0;

  function destroyChart() {
    chart?.destroy();
    chart = null;
  }

  function translatedSeries() {
    return SERIES.map(({ key, color }, index) => ({
      label: translate(key),
      backgroundColor: color,
      borderColor: color,
      data: model.rows.map((row) => row.percentages[index]),
      stack: 'probability',
      categoryPercentage: 0.7,
      barPercentage: 0.65,
      maxBarThickness: 24,
      borderWidth: 0,
    }));
  }

  function probabilityAxisLabel() {
    return `${translate('probabilityAxis')} (${translate('quality')})`;
  }

  function formatPercent(value) {
    return `${new Intl.NumberFormat(document.documentElement.lang || undefined, {
      maximumFractionDigits: 2,
    }).format(value)}%`;
  }

  function renderTable() {
    const table = document.createElement('table');
    table.className = 'probability-values';
    const head = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const qualityHeader = document.createElement('th');
    qualityHeader.scope = 'col';
    qualityHeader.textContent = translate('probabilityAxis');
    headerRow.append(qualityHeader);
    SERIES.forEach(({ key }) => {
      const cell = document.createElement('th');
      cell.scope = 'col';
      cell.textContent = translate(key);
      headerRow.append(cell);
    });
    head.append(headerRow);

    const body = document.createElement('tbody');
    model.rows.forEach((row) => {
      const tr = document.createElement('tr');
      const quality = document.createElement('th');
      quality.scope = 'row';
      quality.textContent = String(row.quality);
      tr.append(quality);
      row.percentages.forEach((value) => {
        const cell = document.createElement('td');
        cell.textContent = formatPercent(value);
        tr.append(cell);
      });
      body.append(tr);
    });
    table.append(head, body);
    tableHost.replaceChildren(table);
  }

  function renderLegendLabels() {
    legend.setAttribute('aria-label', translate('probabilityTitle'));
    legendItems.forEach(({ key, label }) => { label.textContent = translate(key); });
  }

  function renderChartPhase() {
    const loading = chartPhase === 'loading';
    const failed = chartPhase === 'error';
    const ready = chartPhase === 'ready';

    chartFrame.hidden = loading || failed;
    legend.hidden = !ready;
    status.hidden = !loading && !failed;
    status.textContent = loading
      ? translate('loading')
      : failed ? translate('probabilityChartLoadError') : '';
    retryButton.hidden = !failed;
    retryButton.textContent = translate('probabilityChartRetry');
  }

  function updateLabels() {
    title.textContent = translate('probabilityTitle');
    details.querySelector('summary').textContent = translate('probabilityTable');
    closeButton.textContent = translate('close');
    renderLegendLabels();
    if (model) {
      const captionDescription = `${translate('probabilityCaption')} ${translate('probabilityConfig', { group: model.group, cap: model.cap })}`;
      canvas.setAttribute('aria-label', `${translate('probabilityTitle')}. ${captionDescription}`);
      renderTable();
    } else {
      canvas.setAttribute('aria-label', translate('probabilityTitle'));
    }
    renderChartPhase();
    if (chart) {
      chart.data.datasets = translatedSeries();
      chart.options.scales.x.title.text = probabilityAxisLabel();
      chart.options.scales.y.title.text = translate('probabilityPercent');
      chart.update();
    }
  }

  function createChart(Chart) {
    const labels = model.rows.map(({ quality }) => String(quality));
    chartFrame.style.setProperty('--probability-chart-min-width', `${labels.length * 22}px`);
    chartPhase = 'ready';
    renderChartPhase();
    chart = new Chart(canvas, {
      type: 'bar',
      data: { labels, datasets: translatedSeries() },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label(context) {
                return `${context.dataset.label}: ${formatPercent(context.parsed.y)}`;
              },
            },
          },
        },
        scales: {
          x: {
            stacked: true,
            title: { display: true, text: probabilityAxisLabel(), color: '#c5e3f5' },
          ticks: { color: '#c5e3f5', autoSkip: false, minRotation: 0, maxRotation: 0, font: { size: 10 } },
            grid: { color: 'rgba(197, 227, 245, 0.12)' },
          },
          y: {
            stacked: true,
            min: 0,
            max: 100,
            ticks: {
              stepSize: 20,
              color: '#c5e3f5',
              callback: (value) => `${value}%`,
            },
            title: { display: true, text: translate('probabilityPercent'), color: '#c5e3f5' },
            grid: { color: 'rgba(197, 227, 245, 0.18)' },
          },
        },
      },
    });
  }

  async function showChart() {
    if (!model || !dialog.open) return;
    const request = ++chartRequest;
    destroyChart();
    chartPhase = 'loading';
    renderChartPhase();
    try {
      const Chart = await chartLibraryLoader();
      if (request !== chartRequest || !model || !dialog.open) return;
      createChart(Chart);
    } catch {
      if (request !== chartRequest || !dialog.open || !model) return;
      chartPhase = 'error';
      renderChartPhase();
      details.open = true;
    }
  }

  button.addEventListener('click', () => {
    if (!model) return;
    if (!dialog.open) dialog.showModal();
    showChart();
  });
  closeButton.addEventListener('click', () => dialog.close());
  retryButton.addEventListener('click', showChart);
  dialog.addEventListener('close', () => {
    if (dialog.open) return;
    chartRequest += 1;
    destroyChart();
    chartPhase = 'idle';
    renderChartPhase();
  });

  function setModel(probabilities) {
    destroyChart();
    if (probabilities === null) {
      chartRequest += 1;
      model = null;
      button.disabled = true;
      if (dialog.open) dialog.close();
      tableHost.replaceChildren();
      chartPhase = 'idle';
      renderChartPhase();
      renderLanguage();
      return;
    }
    model = normalizeProbabilityData(probabilities);
    button.disabled = false;
    renderLanguage();
    if (dialog.open) showChart();
  }

  function renderLanguage() {
    button.textContent = translate('viewProbabilities');
    updateLabels();
  }

  return { setModel, renderLanguage };
}
