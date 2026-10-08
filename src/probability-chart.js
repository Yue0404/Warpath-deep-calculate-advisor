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

/** 建立按需加载的概率查看器；图表依赖仅在用户打开窗口时请求。 */
export function createProbabilityViewer({ translate }) {
  const button = document.getElementById('view-probabilities');
  const dialog = document.getElementById('probability-dialog');
  const title = document.getElementById('probability-title');
  const canvas = document.getElementById('probability-canvas');
  const caption = document.getElementById('probability-caption');
  const details = document.getElementById('probability-data');
  const tableHost = document.getElementById('probability-table');
  const closeButton = document.getElementById('probability-close');
  const chartFrame = canvas?.closest('.probability-chart-frame');
  if (![button, dialog, title, canvas, caption, details, tableHost, closeButton, chartFrame].every(Boolean)) {
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
    return { key, item, label };
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
      borderWidth: 0,
    }));
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

  function updateLabels() {
    title.textContent = translate('probabilityTitle');
    caption.textContent = `${translate('probabilityCaption')} ${translate('probabilityConfig', { group: model.group, cap: model.cap })}`;
    details.querySelector('summary').textContent = translate('probabilityTable');
    closeButton.textContent = translate('close');
    retryButton.textContent = translate('probabilityChartRetry');
    legend.setAttribute('aria-label', translate('probabilityTitle'));
    legendItems.forEach(({ key, label }) => { label.textContent = translate(key); });
    canvas.setAttribute('aria-label', `${translate('probabilityTitle')}. ${caption.textContent}`);
    if (status.hidden) status.textContent = '';
    else status.textContent = translate('probabilityChartLoadError');
    renderTable();
    if (chart) {
      chart.data.datasets = translatedSeries();
      chart.options.scales.x.title.text = translate('probabilityAxis');
      chart.options.scales.y.title.text = translate('probabilityPercent');
      chart.update();
    }
  }

  function createChart(Chart) {
    destroyChart();
    const labels = model.rows.map(({ quality }) => String(quality));
    chartFrame.style.setProperty('--probability-chart-min-width', `${labels.length * 22}px`);
    chartFrame.hidden = false;
    legend.hidden = false;
    status.hidden = true;
    retryButton.hidden = true;
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
              footer(items) {
                const sum = items.reduce((total, item) => total + item.parsed.y, 0);
                return `${translate('probabilityPercent')}: ${formatPercent(sum)}`;
              },
            },
          },
        },
        scales: {
          x: {
            stacked: true,
            title: { display: true, text: translate('probabilityAxis'), color: '#c5e3f5' },
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
        elements: { bar: { categoryPercentage: 1, barPercentage: 0.96 } },
      },
    });
  }

  async function showChart() {
    chartFrame.hidden = true;
    legend.hidden = true;
    status.textContent = translate('loading');
    status.hidden = false;
    retryButton.hidden = true;
    try {
      const Chart = await loadChartLibrary();
      if (!model || !dialog.open) return;
      createChart(Chart);
    } catch {
      if (!dialog.open || !model) return;
      status.textContent = translate('probabilityChartLoadError');
      status.hidden = false;
      chartFrame.hidden = true;
      legend.hidden = true;
      details.open = true;
      retryButton.textContent = translate('probabilityChartRetry');
      retryButton.hidden = false;
    }
  }

  button.addEventListener('click', () => {
    if (!model) return;
    dialog.showModal();
    updateLabels();
    showChart();
  });
  closeButton.addEventListener('click', () => dialog.close());
  retryButton.addEventListener('click', showChart);
  dialog.addEventListener('close', destroyChart);

  function setModel(probabilities) {
    destroyChart();
    if (probabilities === null) {
      model = null;
      button.disabled = true;
      if (dialog.open) dialog.close();
      tableHost.replaceChildren();
      caption.textContent = '';
      chartFrame.hidden = false;
      legend.hidden = true;
      status.hidden = true;
      retryButton.hidden = true;
      return;
    }
    model = normalizeProbabilityData(probabilities);
    button.disabled = false;
    updateLabels();
    if (dialog.open) showChart();
  }

  function renderLanguage() {
    if (model) updateLabels();
    else {
      title.textContent = translate('probabilityTitle');
      closeButton.textContent = translate('close');
      retryButton.textContent = translate('probabilityChartRetry');
      legend.setAttribute('aria-label', translate('probabilityTitle'));
      legendItems.forEach(({ key, label }) => { label.textContent = translate(key); });
    }
  }

  return { setModel, renderLanguage };
}
