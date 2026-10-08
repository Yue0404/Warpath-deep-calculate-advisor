import { availableDeltas, deriveResult, parseQuality } from './input.js';
import { languages, detectLanguage, translate } from './i18n.js';
import { loadModel } from './model-loader.js';
import { renderRecommendation } from './viewer.js';

const $ = (id) => document.getElementById(id);
const storage = {
  get(key) { try { return localStorage.getItem(key); } catch { return null; } },
  set(key, value) { try { localStorage.setItem(key, value); } catch { /* 禁用存储时仍可使用计算器。 */ } },
};
let locale = storage.get('warpath-language');
if (!languages.some(({ code }) => code === locale)) locale = detectLanguage(navigator.languages);
let region = storage.get('warpath-server');
if (!['cn', 'international'].includes(region)) region = 'international';
let calculator = null;
let modelState = null;
let appliedRegion = null;
let appliedGroup = null;
let loadSequence = 0;
let loadingRegion = null;
let stageTimer = null;
const maximumTimerDelay = 2147483647;
let decision = null;
let current = [0, 0, 0];
let deltas = ['', '', ''];
let mode = '';
let pendingMode = '';
let closingDialog = false;
const t = (key, values) => translate(locale, key, values);
const lockedIndex = () => mode === '' ? null : Number(mode);
const resultAt = (index, rawCurrent = current[index], rawDelta = deltas[index]) => deriveResult(
  rawCurrent, rawDelta, calculator.cap, lockedIndex() === index,
);

function showFormError(key, values) {
  $('form-error').textContent = t(key, values);
  $('form-error').hidden = false;
}

function renderLanguage() {
  document.documentElement.lang = locale;
  document.documentElement.dir = languages.find(({ code }) => code === locale).dir;
  document.title = `Warpath · ${t('title')}`;
  document.querySelectorAll('[data-i18n]').forEach((element) => { element.textContent = t(element.dataset.i18n); });
  $('workspace').setAttribute('aria-label', t('title'));
  $('language').setAttribute('aria-label', t('language'));
  $('language').value = locale;
  $('server').replaceChildren(
    new Option(t('serverCn'), 'cn'),
    new Option(t('serverInternational'), 'international'),
  );
  $('server').value = region;
  const flag = languages.find(({ code }) => code === locale)?.flag;
  if (flag && $('language-flag')) $('language-flag').src = new URL(`../flags/${flag.toLowerCase()}.svg`, import.meta.url).href;
  if (calculator) renderInputs();
  if (!$('load-status').hidden) $('load-status').textContent = t($('retry').hidden ? 'loading' : 'loadError');
  $('form-error').hidden = true;
  renderStageStatus();
  updateRecommendation();
}

function makeCurrentInput(index) {
  const input = document.createElement('input');
  input.id = `current-${index}`;
  input.type = 'text';
  input.inputMode = 'numeric';
  input.autocomplete = 'off';
  input.setAttribute('aria-label', t('qualityLabel', { section: t('current'), n: index + 1 }));
  input.title = t('qualityRange', { cap: calculator.cap });
  input.value = current[index] ?? '';
  const parsed = parseQuality(input.value, calculator.cap);
  input.setAttribute('aria-invalid', String(!parsed.valid));
  return input;
}

function makeDeltaSelect(index) {
  const select = document.createElement('select');
  select.id = `delta-${index}`;
  select.setAttribute('aria-label', t('deltaLabel', { n: index + 1 }));
  const locked = lockedIndex() === index;
  const quality = parseQuality(current[index], calculator.cap);
  if (!locked) select.add(new Option('—', ''));
  for (const delta of quality.valid && !quality.empty ? availableDeltas(quality.value, calculator.cap, locked) : []) {
    const label = delta === 0 ? t('unchanged') : `${delta > 0 ? '+' : ''}${delta}`;
    select.add(new Option(label, String(delta)));
  }
  select.value = locked ? '0' : deltas[index];
  select.disabled = locked || !quality.valid || quality.empty;
  return select;
}

function makeResult(index) {
  const output = document.createElement('output');
  output.id = `next-${index}`;
  output.className = 'result-value';
  output.setAttribute('aria-label', t('qualityLabel', { section: t('result'), n: index + 1 }));
  const result = resultAt(index);
  output.textContent = result.valid ? String(result.value) : '—';
  return output;
}

function updateDerivedRow(index) {
  const row = $('quality-rows').querySelector(`#current-${index}`)?.closest('.quality-row');
  if (!row) return;
  const deltaField = row.querySelector('.delta-field');
  deltaField.replaceChildren(makeDeltaSelect(index));
  row.querySelector('.result-field').replaceChildren(makeResult(index));
}

function renderInputs() {
  $('quality-rows').replaceChildren();
  const names = ['skillAttribute', 'globalAttribute', 'normalAttribute'];
  for (let index = 0; index < 3; index++) {
    const row = document.createElement('div');
    row.className = 'quality-row';
    const name = document.createElement('span');
    name.className = 'attribute-name';
    name.textContent = t(names[index]);

    const currentField = document.createElement('div');
    currentField.className = 'quality-field';
    currentField.dataset.label = t('current');
    const currentInput = makeCurrentInput(index);
    const currentUnit = document.createElement('span');
    currentUnit.textContent = t('quality');
    currentField.append(currentInput, currentUnit);

    const deltaField = document.createElement('div');
    deltaField.className = 'quality-field delta-field';
    deltaField.dataset.label = t('delta');
    deltaField.append(makeDeltaSelect(index));

    const resultField = document.createElement('div');
    resultField.className = 'quality-field result-field';
    resultField.dataset.label = t('result');
    resultField.append(makeResult(index));
    row.append(name, currentField, deltaField, resultField);
    $('quality-rows').append(row);
  }
  $('mode').replaceChildren(new Option(t('all', { cost: calculator.ordinaryCost }), ''));
  for (let index = 0; index < 3; index++) $('mode').add(new Option(t('lock', { n: index + 1, cost: calculator.lockedCost }), String(index)));
  $('mode').value = mode;
}

function completeState() {
  return Boolean(calculator && current.every((value) => Number.isInteger(value) && value === calculator.cap));
}

function renderStageStatus() {
  const element = $('stage-status');
  if (!modelState?.stage) {
    element.hidden = true;
    element.textContent = '';
    return;
  }
  const { status, stage } = modelState;
  const statusText = status === 'ready'
    ? t('stageStatus', { group: stage.group, cap: stage.cap })
    : status === 'not_open'
      ? t('stageNotOpen')
      : t('stageUnsupported', { group: stage.group });
  element.textContent = `${statusText} · ${t('clockEstimate')}`;
  element.hidden = false;
}

function updateRecommendation() {
  renderRecommendation({
    panel: $('recommendation'),
    title: $('decision-title'),
    unsupported: $('unsupported'),
    apply: $('apply'),
    nextRoll: $('next-roll'),
    decision,
    complete: completeState(),
    translate: t,
  });
}

function resetQualityState() {
  if ($('lock-dialog')?.open) closeLockDialog(false);
  current = [0, 0, 0];
  deltas = ['', '', ''];
  mode = '';
  decision = null;
  $('form-error').hidden = true;
  $('quality-rows').replaceChildren();
  updateRecommendation();
}

function invalidate() {
  decision = null;
  $('form-error').hidden = true;
  updateRecommendation();
}

function clearResults() {
  deltas = ['', '', ''];
  const index = lockedIndex();
  if (index !== null) deltas[index] = '0';
  invalidate();
  if (calculator) renderInputs();
}

function scheduleStageCheck(nextChangeAt) {
  if (stageTimer !== null) clearTimeout(stageTimer);
  stageTimer = null;
  if (!Number.isFinite(nextChangeAt)) return;
  const delay = Math.max(0, nextChangeAt - Date.now());
  stageTimer = setTimeout(() => {
    stageTimer = null;
    if (Date.now() >= nextChangeAt) loadCurrentModel();
    else scheduleStageCheck(nextChangeAt);
  }, Math.min(delay, maximumTimerDelay));
}

function checkStageBoundary() {
  const nextChangeAt = modelState?.stage?.nextChangeAt;
  if (!Number.isFinite(nextChangeAt)) return;
  if (Date.now() >= nextChangeAt) loadCurrentModel();
  else scheduleStageCheck(nextChangeAt);
}

async function loadCurrentModel() {
  const requestedRegion = region;
  if (loadingRegion === requestedRegion) return;
  const sequence = ++loadSequence;
  loadingRegion = requestedRegion;
  if ($('lock-dialog')?.open) closeLockDialog(false);
  if (stageTimer !== null) clearTimeout(stageTimer);
  stageTimer = null;
  $('inputs').disabled = true;
  $('load-status').hidden = false;
  $('load-status').textContent = t('loading');
  $('retry').hidden = true;
  $('form-error').hidden = true;
  calculator = null;
  modelState = null;
  decision = null;
  $('quality-rows').replaceChildren();
  $('mode').replaceChildren();
  $('stage-status').hidden = true;
  updateRecommendation();
  let boundaryMissed = false;
  try {
    const loaded = await loadModel(requestedRegion, Date.now());
    if (sequence !== loadSequence || requestedRegion !== region) return;
    if (Number.isFinite(loaded.stage?.nextChangeAt) && Date.now() >= loaded.stage.nextChangeAt) {
      boundaryMissed = true;
      return;
    }
    const group = loaded.stage?.group ?? null;
    if (appliedRegion !== null && (appliedRegion !== requestedRegion || appliedGroup !== group)) resetQualityState();
    appliedRegion = requestedRegion;
    appliedGroup = group;
    modelState = loaded;
    calculator = loaded.status === 'ready' ? loaded.calculator : null;
    $('load-status').hidden = true;
    if (calculator) {
      $('inputs').disabled = false;
      renderInputs();
    } else {
      $('inputs').disabled = true;
      $('quality-rows').replaceChildren();
      $('mode').replaceChildren();
      decision = null;
    }
    renderStageStatus();
    updateRecommendation();
    scheduleStageCheck(loaded.stage?.nextChangeAt);
  } catch (error) {
    if (sequence !== loadSequence || requestedRegion !== region) return;
    console.error('模型加载失败', error);
    calculator = null;
    modelState = null;
    decision = null;
    $('inputs').disabled = true;
    $('quality-rows').replaceChildren();
    $('mode').replaceChildren();
    $('stage-status').hidden = true;
    $('load-status').textContent = t('loadError');
    $('retry').hidden = false;
    updateRecommendation();
  } finally {
    if (sequence === loadSequence) {
      loadingRegion = null;
      if (boundaryMissed) loadCurrentModel();
    }
  }
}

function selectRegion() {
  const selected = $('server').value;
  if (!['cn', 'international'].includes(selected) || selected === region) return;
  region = selected;
  storage.set('warpath-server', region);
  resetQualityState();
  calculator = null;
  modelState = null;
  $('inputs').disabled = true;
  $('stage-status').hidden = true;
  loadCurrentModel();
}

function parseCssTime(value) {
  const amount = Number.parseFloat(value);
  return Number.isFinite(amount) ? amount * (value.trim().endsWith('ms') ? 1 : 1000) : 0;
}

function closeLockDialog(applyPending) {
  const dialog = $('lock-dialog');
  if (!dialog?.open || closingDialog) return;
  closingDialog = true;
  if (applyPending) mode = pendingMode;
  const wasVisible = dialog.classList.contains('is-visible');
  dialog.classList.remove('is-visible');
  let fallbackTimer;
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    dialog.removeEventListener('transitionend', onTransitionEnd);
    if (fallbackTimer !== undefined) clearTimeout(fallbackTimer);
    if (dialog.open) dialog.close();
    closingDialog = false;
    if (applyPending) clearResults();
    $('mode').focus();
  };
  const onTransitionEnd = (event) => {
    if (event.target === dialog && event.propertyName === 'opacity') finish();
  };
  dialog.addEventListener('transitionend', onTransitionEnd);
  const style = getComputedStyle(dialog);
  const properties = style.transitionProperty.split(',').map((value) => value.trim());
  const durations = style.transitionDuration.split(',').map(parseCssTime);
  const delays = style.transitionDelay.split(',').map(parseCssTime);
  const opacityIndex = properties.findIndex((property) => property === 'opacity' || property === 'all');
  const transitionMs = opacityIndex < 0 ? 0
    : Math.max(0, durations[opacityIndex % durations.length] + delays[opacityIndex % delays.length]);
  if (!wasVisible || matchMedia('(prefers-reduced-motion: reduce)').matches || transitionMs <= 0) finish();
  else fallbackTimer = setTimeout(finish, Math.min(500, transitionMs + 50));
}

function requestLock(nextMode) {
  const dialog = $('lock-dialog');
  if (!dialog || closingDialog) return;
  pendingMode = nextMode;
  $('lock-warning').textContent = t('lockWarning');
  if (!dialog.open) dialog.showModal();
  requestAnimationFrame(() => {
    if (dialog.open && !closingDialog) dialog.classList.add('is-visible');
  });
  $('lock-continue').focus();
}

$('language').replaceChildren(...languages.map(({ code, name }) => new Option(name, code)));
$('language').addEventListener('change', (event) => {
  locale = event.target.value;
  storage.set('warpath-language', locale);
  renderLanguage();
});
$('server').addEventListener('change', selectRegion);
$('quality-rows').addEventListener('input', (event) => {
  const input = event.target.closest('input[id^="current-"]');
  if (!input || !calculator) return;
  const index = Number(input.id.slice('current-'.length));
  if (!Number.isInteger(index) || index < 0 || index > 2) return;
  const parsed = parseQuality(input.value, calculator.cap);
  input.setAttribute('aria-invalid', String(!parsed.valid));
  current[index] = parsed.valid ? parsed.value : null;
  deltas = ['', '', ''];
  const locked = lockedIndex();
  if (locked !== null) deltas[locked] = '0';
  invalidate();
  for (let rowIndex = 0; rowIndex < 3; rowIndex++) updateDerivedRow(rowIndex);
  if (!parsed.valid) showFormError('qualityRange', { cap: calculator.cap });
});
$('quality-rows').addEventListener('change', (event) => {
  const select = event.target.closest('select[id^="delta-"]');
  if (!select || !calculator) return;
  const index = Number(select.id.slice('delta-'.length));
  if (!Number.isInteger(index) || index < 0 || index > 2) return;
  const derived = deriveResult(current[index], select.value, calculator.cap, lockedIndex() === index);
  if (!derived.valid) {
    deltas[index] = '';
    updateDerivedRow(index);
    showFormError('invalidChange');
    return;
  }
  deltas[index] = select.value;
  invalidate();
  updateDerivedRow(index);
});
$('mode').addEventListener('change', (event) => {
  const nextMode = event.target.value;
  if (nextMode !== '' && !['0', '1', '2'].includes(nextMode)) {
    event.target.value = mode;
    showFormError('invalidChange');
    return;
  }
  if (nextMode !== '' && nextMode !== mode) requestLock(nextMode);
  else { mode = nextMode; clearResults(); }
});
$('lock-continue').addEventListener('click', () => closeLockDialog(true));
$('lock-dialog').addEventListener('cancel', (event) => {
  // ESC 按钮按“继续”处理，确保隐藏的对话框不会留下未确认的选择。
  event.preventDefault();
  closeLockDialog(true);
});
$('calculator-form').addEventListener('submit', (event) => {
  event.preventDefault();
  if (!calculator || $('inputs').disabled) return;
  const inputs = [0, 1, 2].map((index) => $(`current-${index}`));
  const parsed = inputs.map((input) => parseQuality(input.value, calculator.cap));
  if (parsed.some((entry) => !entry.valid)) {
    showFormError('qualityRange', { cap: calculator.cap });
    inputs[parsed.findIndex((entry) => !entry.valid)]?.focus();
    return;
  }
  if (parsed.some((entry) => entry.empty)) {
    showFormError('qualityRange', { cap: calculator.cap });
    inputs[parsed.findIndex((entry) => entry.empty)]?.focus();
    return;
  }
  current = parsed.map(({ value }) => value);
  if (completeState()) { decision = null; updateRecommendation(); return; }
  const rawDeltas = [0, 1, 2].map((index) => lockedIndex() === index ? '0' : $(`delta-${index}`)?.value ?? '');
  const results = rawDeltas.map((delta, index) => deriveResult(current[index], delta, calculator.cap, lockedIndex() === index));
  if (results.some((result) => !result.valid)) {
    showFormError('invalidChange');
    return;
  }
  deltas = rawDeltas;
  const next = results.map(({ value }) => value);
  try {
    decision = calculator.evaluate(current, next, lockedIndex());
    $('form-error').hidden = true;
    updateRecommendation();
  } catch (error) {
    showFormError(lockedIndex() !== null && current[lockedIndex()] !== next[lockedIndex()] ? 'lockedError' : 'invalid', { cap: calculator.cap });
  }
});
$('reset').addEventListener('click', () => {
  if ($('lock-dialog').open) closeLockDialog(false);
  current = [0, 0, 0];
  mode = '';
  clearResults();
});
$('apply').addEventListener('click', () => {
  if (!decision) return;
  current = [0, 1, 2].map((index) => resultAt(index).value);
  clearResults();
});
$('next-roll').addEventListener('click', clearResults);
$('retry').addEventListener('click', loadCurrentModel);
window.addEventListener('focus', checkStageBoundary);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') checkStageBoundary();
});
renderLanguage();
loadCurrentModel();
