import { createCalculator } from './calculator.js';
import { languages, detectLanguage, translate } from './i18n.js';

const $ = (id) => document.getElementById(id);
const storage = {
  get(key) { try { return localStorage.getItem(key); } catch { return null; } },
  set(key, value) { try { localStorage.setItem(key, value); } catch { /* 禁用存储时仍可使用计算器。 */ } },
};
let locale = storage.get('warpath-language');
if (!languages.some(({ code }) => code === locale)) locale = detectLanguage(navigator.languages);
let calculator;
let decision = null;
let edited = false;
let current = [0, 0, 0];
let next = ['', '', ''];
let mode = '';
const t = (key, values) => translate(locale, key, values);
const format = (value) => new Intl.NumberFormat(locale, { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(value);
const lockedIndex = () => mode === '' ? null : Number(mode);

function renderLanguage() {
  document.documentElement.lang = locale;
  document.documentElement.dir = languages.find(({ code }) => code === locale).dir;
  document.title = `Warpath · ${t('title')}`;
  document.querySelectorAll('[data-i18n]').forEach((element) => { element.textContent = t(element.dataset.i18n); });
  $('workspace').setAttribute('aria-label', t('title'));
  $('language').setAttribute('aria-label', t('language'));
  $('language').value = locale;
  $('goal').textContent = t('goal', { cap: calculator?.cap ?? 11 });
  $('version').textContent = calculator ? t('version', { game: calculator.model.source_version.game_version, runtime: calculator.model.source_version.runtime_update_version }) : '';
  $('chip-note').textContent = calculator ? t('chipNote', { ordinary: calculator.ordinaryCost, locked: calculator.lockedCost }) : '';
  if (calculator) renderInputs();
  if (!$('load-status').hidden) $('load-status').textContent = t($('retry').hidden ? 'loading' : 'loadError');
  $('form-error').hidden = true;
  renderDecision();
}

function makeQualitySelect(section, index, value) {
  const select = document.createElement('select');
  select.id = `${section}-${index}`;
  select.setAttribute('aria-label', t('qualityLabel', { section: t(section === 'current' ? 'current' : 'result'), n: index + 1 }));
  if (section === 'next') select.add(new Option('—', ''));
  for (let quality = 0; quality <= calculator.cap; quality++) select.add(new Option(String(quality), String(quality)));
  select.value = String(value);
  select.disabled = section === 'next' && lockedIndex() === index;
  return select;
}

function renderInputs() {
  $('quality-rows').replaceChildren();
  for (let index = 0; index < 3; index++) {
    const row = document.createElement('div');
    row.className = 'quality-row';
    const name = document.createElement('span');
    name.className = 'attribute-name';
    name.textContent = t('attribute', { n: index + 1 });
    row.append(name);
    for (const section of ['current', 'next']) {
      const field = document.createElement('div');
      field.className = 'quality-field';
      const unit = document.createElement('span');
      unit.textContent = t('quality');
      field.append(makeQualitySelect(section, index, section === 'current' ? current[index] : next[index]), unit);
      row.append(field);
    }
    $('quality-rows').append(row);
  }
  $('mode').replaceChildren(new Option(t('all', { cost: calculator.ordinaryCost }), ''));
  for (let index = 0; index < 3; index++) $('mode').add(new Option(t('lock', { n: index + 1, cost: calculator.lockedCost }), String(index)));
  $('mode').value = mode;
}

function renderDecision() {
  const complete = calculator && current.every((value) => value === calculator.cap);
  let title = complete ? 'complete' : decision?.choice ?? 'awaitResult';
  let description = complete ? 'completeText' : decision ? `${decision.choice}Text` : edited ? 'edited' : 'pending';
  $('decision-title').textContent = t(title);
  $('decision-text').textContent = t(description);
  $('current-value').textContent = decision ? format(decision.currentValue) : complete ? format(0) : '—';
  $('next-value').textContent = decision ? format(decision.nextValue) : '—';
  document.querySelectorAll('.metric-unit').forEach((unit) => { unit.hidden = !decision; unit.textContent = t('unit'); });
  $('difference').hidden = !decision || decision.choice === 'indifferent';
  if (decision) $('difference').textContent = t(decision.savings >= 0 ? 'savings' : 'loss', { value: format(Math.abs(decision.savings)) });
  $('unsupported').hidden = !decision || decision.supported;
  $('locked-note').hidden = lockedIndex() === null;
  $('apply').hidden = !decision || complete;
  $('next-roll').hidden = !decision || complete;
}

function invalidate() {
  decision = null;
  edited = true;
  $('form-error').hidden = true;
  renderDecision();
}

function clearResults() {
  next = ['', '', ''];
  if (lockedIndex() !== null) next[lockedIndex()] = current[lockedIndex()];
  invalidate();
  renderInputs();
}

async function loadData() {
  $('inputs').disabled = true;
  $('load-status').hidden = false;
  $('load-status').textContent = t('loading');
  $('retry').hidden = true;
  try {
    const names = ['model', 'probabilities', 'decision_reference'];
    const data = await Promise.all(names.map(async (name) => {
      const response = await fetch(new URL(`../data/${name}.json`, import.meta.url), { cache: 'no-cache', signal: AbortSignal.timeout(15000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    }));
    calculator = createCalculator({ model: data[0], probabilities: data[1], reference: data[2] });
    $('inputs').disabled = false;
    $('load-status').hidden = true;
    renderLanguage();
  } catch (error) {
    console.error('模型加载失败', error);
    $('load-status').textContent = t('loadError');
    $('retry').hidden = false;
  }
}

$('language').replaceChildren(...languages.map(({ code, name }) => new Option(name, code)));
$('language').addEventListener('change', (event) => {
  locale = event.target.value;
  storage.set('warpath-language', locale);
  renderLanguage();
});
$('quality-rows').addEventListener('change', (event) => {
  const [section, rawIndex] = event.target.id.split('-');
  const index = Number(rawIndex);
  if (!['current', 'next'].includes(section) || !Number.isInteger(index) || index < 0 || index > 2) return;
  const value = event.target.value === '' ? '' : Number(event.target.value);
  if (section === 'current') {
    current[index] = value;
    // 当前状态改变后，旧洗练结果失去比较依据，需重新录入。
    clearResults();
  } else { next[index] = value; invalidate(); }
});
$('mode').addEventListener('change', (event) => { mode = event.target.value; clearResults(); });
$('calculator-form').addEventListener('submit', (event) => {
  event.preventDefault();
  if (!calculator) return;
  if (current.every((value) => value === calculator.cap)) { renderDecision(); return; }
  if (next.some((value) => value === '')) {
    $('form-error').textContent = t('pending');
    $('form-error').hidden = false;
    Array.from($('quality-rows').querySelectorAll('select[id^="next-"]')).find((select) => !select.disabled && select.value === '')?.focus();
    return;
  }
  try {
    decision = calculator.evaluate(current, next, lockedIndex());
    $('form-error').hidden = true;
    renderDecision();
  } catch (error) {
    $('form-error').textContent = t(lockedIndex() !== null && current[lockedIndex()] !== next[lockedIndex()] ? 'lockedError' : 'invalid', { cap: calculator.cap });
    $('form-error').hidden = false;
  }
});
$('reset').addEventListener('click', () => { current = [0, 0, 0]; mode = ''; clearResults(); edited = false; renderDecision(); });
$('apply').addEventListener('click', () => { if (decision) { current = [...next]; clearResults(); } });
$('next-roll').addEventListener('click', clearResults);
$('retry').addEventListener('click', loadData);
renderLanguage();
loadData();
