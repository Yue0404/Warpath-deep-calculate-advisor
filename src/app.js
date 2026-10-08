import { availableDeltas, deriveResult, parseQuality } from './input.js';
import { languages, detectLanguage, translate } from './i18n.js';
import { loadModel } from './model-loader.js';
import { createNetworkClock } from './network-time.js';
import { resolveBrowserPreference, resolveInitialServer, shouldShowServerWelcome } from './preferences.js';
import { createProbabilityViewer } from './probability-chart.js';
import { renderRecommendation } from './viewer.js';

const $ = (id) => document.getElementById(id);
const storage = {
  get(key) { try { return localStorage.getItem(key); } catch { return null; } },
  set(key, value) { try { localStorage.setItem(key, value); } catch { /* 禁用存储时仍可使用计算器。 */ } },
};
const supportedLocales = languages.map(({ code }) => code);
const browserPreference = resolveBrowserPreference({
  browserLanguages: navigator.languages,
  supportedLocales,
  detectLanguage,
  storage,
});
let locale = storage.get('warpath-language');
if (!supportedLocales.includes(locale)) locale = browserPreference;
const savedServer = storage.get('warpath-server');
let region = resolveInitialServer({ browserPreference, savedServer });
const showServerWelcome = shouldShowServerWelcome({ browserPreference, storage });
const showServerControl = browserPreference === 'zh-CN';
const networkClock = createNetworkClock();
let calculator = null;
let modelState = null;
let appliedRegion = null;
let appliedGroup = null;
let loadSequence = 0;
let loadingRegion = null;
let stageTimer = null;
const maximumTimerDelay = 2147483647;
let decision = null;
let resultQualities = null;
let current = [0, 0, 0];
let deltas = ['', '', ''];
let mode = '';
let selectedLockedIndex = null;
let pendingMode = '';
let closingDialog = false;
let returnFocusAfterLanguageClose = false;
const t = (key, values) => translate(locale, key, values);
const probabilityViewer = createProbabilityViewer({ translate: t });
const lockedIndex = () => mode === 'two' ? selectedLockedIndex : null;
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
  $('language-options').setAttribute('aria-label', t('language'));
  $('language-name').textContent = languages.find(({ code }) => code === locale).name;
  $('server').replaceChildren(
    new Option(t('serverCn'), 'cn'),
    new Option(t('serverInternational'), 'international'),
  );
  $('server').value = region;
  const flag = locale === 'zh-TW' && browserPreference === 'zh-CN'
    ? 'cn' : languages.find(({ code }) => code === locale)?.flag;
  if (flag && $('language-flag')) $('language-flag').src = new URL(`../flags/${flag.toLowerCase()}.svg`, import.meta.url).href;
  renderLanguageOptions();
  probabilityViewer.renderLanguage();
  $('server-control').hidden = !showServerControl;
  if ($('time-status')) renderTimeStatus();
  if (calculator) renderInputs();
  if (!$('load-status').hidden) $('load-status').textContent = t($('retry').hidden ? 'loading' : 'loadError');
  $('form-error').hidden = true;
  renderStageStatus();
  updateRecommendation();
}

function languageFlag(code) {
  if (code === 'zh-TW' && browserPreference === 'zh-CN') return 'cn';
  return languages.find(({ code: candidate }) => candidate === code)?.flag ?? 'un';
}

function renderLanguageOptions() {
  const options = $('language-options');
  options.replaceChildren(...languages.map(({ code, name }) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'language-option';
    button.dataset.language = code;
    button.setAttribute('aria-pressed', String(code === locale));
    const flag = document.createElement('img');
    flag.src = new URL(`../flags/${languageFlag(code).toLowerCase()}.svg`, import.meta.url).href;
    flag.alt = '';
    flag.setAttribute('aria-hidden', 'true');
    const label = document.createElement('span');
    label.textContent = name;
    button.append(flag, label);
    return button;
  }));
}

function setLocale(nextLocale) {
  if (!supportedLocales.includes(nextLocale)) return;
  if (nextLocale !== locale) {
    locale = nextLocale;
    storage.set('warpath-language', locale);
    renderLanguage();
  }
  returnFocusAfterLanguageClose = true;
  $('language-options').hidePopover();
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
    const label = document.createElement('span');
    label.className = 'attribute-label';
    label.textContent = t(names[index]);
    name.append(label);
    if (mode === 'two' && (selectedLockedIndex === null || selectedLockedIndex === index)) {
      const toggle = document.createElement('button');
      const isLocked = selectedLockedIndex === index;
      toggle.type = 'button';
      toggle.className = 'lock-toggle';
      toggle.dataset.lockIndex = String(index);
      toggle.setAttribute('aria-label', t(isLocked ? 'unlockAttribute' : 'lockAttribute', { n: index + 1 }));
      toggle.setAttribute('aria-pressed', String(isLocked));
      toggle.innerHTML = isLocked
        ? '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>'
        : '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 7-2.6M12 14v3"/></svg>';
      name.append(toggle);
    }

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
  $('mode').replaceChildren(
    new Option(t('all', { cost: calculator.ordinaryCost }), ''),
    new Option(t('two', { cost: calculator.lockedCost }), 'two'),
  );
  $('mode').value = mode;
  const lockHint = $('lock-selection-hint');
  if (lockHint) lockHint.hidden = mode !== 'two' || selectedLockedIndex !== null;
}

function completeState() {
  return Boolean(calculator && current.every((value) => Number.isInteger(value) && value === calculator.cap));
}

function renderStageStatus() {
  const element = $('load-status');
  if (!element || !modelState?.stage) {
    return;
  }
  const { status, stage } = modelState;
  if (status === 'ready') {
    element.textContent = '';
    element.hidden = true;
    return;
  }
  element.textContent = status === 'not_open' ? t('stageNotOpen') : t('stageUnsupported', { group: stage.group });
  element.hidden = false;
}

function renderTimeStatus() {
  const element = $('time-status');
  if (!element) return;
  const status = networkClock.status();
  if (!status.ready && status.lastError) {
    element.textContent = t('timeError');
    element.hidden = false;
  } else if (status.lastError) {
    element.textContent = t('timeSync');
    element.hidden = false;
  } else {
    element.textContent = '';
    element.hidden = true;
  }
  if (status.lastError) {
    $('retry').hidden = false;
    $('retry').textContent = t('timeRetry');
  } else if (status.ready) {
    $('retry').textContent = t('retry');
  } else {
    $('retry').textContent = t('timeRetry');
  }
}

function positionLanguageOptions() {
  const trigger = $('language').getBoundingClientRect();
  const options = $('language-options');
  const width = Math.min(options.offsetWidth || 260, window.innerWidth - 24);
  const height = options.offsetHeight || Math.min(window.innerHeight - 24, 360);
  const rightToLeft = document.documentElement.dir === 'rtl';
  const preferredLeft = rightToLeft ? trigger.right - width : trigger.left;
  const left = Math.max(12, Math.min(preferredLeft, window.innerWidth - width - 12));
  const below = trigger.bottom + 8;
  const top = below + height <= window.innerHeight - 12
    ? below : Math.max(12, trigger.top - height - 8);
  Object.assign(options.style, { position: 'fixed', left: `${left}px`, top: `${top}px`, right: 'auto', bottom: 'auto', margin: '0' });
}

function toggleLanguageOptions() {
  const options = $('language-options');
  if (options.matches(':popover-open')) {
    options.hidePopover();
    return;
  }
  options.showPopover();
  positionLanguageOptions();
  requestAnimationFrame(positionLanguageOptions);
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
  selectedLockedIndex = null;
  decision = null;
  resultQualities = null;
  $('form-error').hidden = true;
  $('quality-rows').replaceChildren();
  updateRecommendation();
}

function invalidate() {
  decision = null;
  resultQualities = null;
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
  const delay = networkClock.status().lastError
    ? 30_000 : Math.max(0, nextChangeAt - networkClock.now());
  stageTimer = setTimeout(() => {
    stageTimer = null;
    if (networkClock.status().lastError || networkClock.now() >= nextChangeAt) loadCurrentModel();
    else scheduleStageCheck(nextChangeAt);
  }, Math.min(delay, maximumTimerDelay));
}

async function checkStageBoundary() {
  const clockSync = await networkClock.sync();
  renderTimeStatus();
  if (!clockSync.ok && !networkClock.isReady()) {
    calculator = null;
    probabilityViewer.setModel(null);
    modelState = null;
    decision = null;
    resultQualities = null;
    $('inputs').disabled = true;
    $('quality-rows').replaceChildren();
    $('mode').replaceChildren();
    $('load-status').textContent = t('timeError');
    $('load-status').hidden = false;
    $('retry').hidden = false;
    updateRecommendation();
    return;
  }
  if (!modelState) {
    loadCurrentModel();
    return;
  }
  const nextChangeAt = modelState?.stage?.nextChangeAt;
  if (!Number.isFinite(nextChangeAt)) return;
  if (networkClock.now() >= nextChangeAt) loadCurrentModel();
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
  if (!calculator) {
    modelState = null;
    probabilityViewer.setModel(null);
    decision = null;
    resultQualities = null;
    $('quality-rows').replaceChildren();
    $('mode').replaceChildren();
    updateRecommendation();
  }
  let boundaryMissed = false;
  try {
    const clockSync = await networkClock.sync();
    renderTimeStatus();
    if (!clockSync.ok && !networkClock.isReady()) throw new Error('无法获取首次网络时间');
    const loaded = await loadModel(requestedRegion, networkClock.now());
    if (sequence !== loadSequence || requestedRegion !== region) return;
    if (Number.isFinite(loaded.stage?.nextChangeAt) && networkClock.now() >= loaded.stage.nextChangeAt) {
      boundaryMissed = true;
      return;
    }
    const group = loaded.stage?.group ?? null;
    if (appliedRegion !== null && (appliedRegion !== requestedRegion || appliedGroup !== group)) resetQualityState();
    appliedRegion = requestedRegion;
    appliedGroup = group;
    modelState = loaded;
    calculator = loaded.status === 'ready' ? loaded.calculator : null;
    probabilityViewer.setModel(calculator?.probabilities ?? null);
    $('load-status').hidden = true;
    if (calculator) {
      $('inputs').disabled = false;
      renderInputs();
    } else {
      calculator = null;
      decision = null;
      resultQualities = null;
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
    if (networkClock.isReady()) console.error('模型加载失败', error);
    calculator = null;
    probabilityViewer.setModel(null);
    modelState = null;
    decision = null;
    resultQualities = null;
    $('inputs').disabled = true;
    $('quality-rows').replaceChildren();
    $('mode').replaceChildren();
    $('load-status').textContent = networkClock.isReady() ? t('loadError') : t('timeError');
    $('retry').hidden = false;
    renderTimeStatus();
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
  probabilityViewer.setModel(null);
  modelState = null;
  $('inputs').disabled = true;
  loadCurrentModel();
}

function acceptWashResult() {
  if (!decision || !resultQualities) return;
  current = [...resultQualities];
  clearResults();
}

function discardWashResult() {
  if (!decision) return;
  clearResults();
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
    if (applyPending) {
      if (pendingMode === 'two') selectedLockedIndex = null;
      clearResults();
    }
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

$('language').addEventListener('click', toggleLanguageOptions);
$('language-options').addEventListener('click', (event) => {
  const option = event.target.closest('[data-language]');
  if (option) setLocale(option.dataset.language);
});
$('language-options').addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  event.preventDefault();
  returnFocusAfterLanguageClose = true;
  $('language-options').hidePopover();
});
$('language-options').addEventListener('toggle', (event) => {
  const isOpen = event.newState === 'open';
  $('language').setAttribute('aria-expanded', String(isOpen));
  if (!isOpen && returnFocusAfterLanguageClose) {
    returnFocusAfterLanguageClose = false;
    $('language').focus();
  }
});
document.addEventListener('focusin', (event) => {
  const options = $('language-options');
  if (options.matches(':popover-open') && event.target !== $('language') && !options.contains(event.target)) {
    options.hidePopover();
  }
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
  if (nextMode !== '' && nextMode !== 'two') {
    event.target.value = mode;
    showFormError('invalidChange');
    return;
  }
  if (nextMode === mode) return;
  if (nextMode === 'two') requestLock(nextMode);
  else {
    mode = '';
    selectedLockedIndex = null;
    clearResults();
  }
});
$('quality-rows').addEventListener('click', (event) => {
  const toggle = event.target.closest('button.lock-toggle');
  if (!toggle || mode !== 'two') return;
  const index = Number(toggle.dataset.lockIndex);
  if (!Number.isInteger(index) || index < 0 || index > 2) return;
  selectedLockedIndex = selectedLockedIndex === index ? null : index;
  clearResults();
  $('quality-rows').querySelector(`button.lock-toggle[data-lock-index="${index}"]`)?.focus();
});
$('lock-continue').addEventListener('click', () => closeLockDialog(true));
$('lock-dialog').addEventListener('cancel', (event) => {
  // 按 ESC 时继续确认流程，避免隐藏的对话框留下未确认的选择。
  event.preventDefault();
  closeLockDialog(true);
});
$('server-welcome-close').addEventListener('click', () => $('server-welcome-dialog').close());
$('server-welcome-dialog').addEventListener('close', () => {
  storage.set('warpath-server-welcome-dismissed', 'true');
});
$('calculator-form').addEventListener('submit', (event) => {
  event.preventDefault();
  if (!calculator || $('inputs').disabled) return;
  if (mode === 'two' && selectedLockedIndex === null) {
    const lockHint = $('lock-selection-hint');
    if (lockHint) lockHint.hidden = false;
    $('quality-rows').querySelector('button.lock-toggle')?.focus();
    return;
  }
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
  if (completeState()) { decision = null; resultQualities = null; updateRecommendation(); return; }
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
    resultQualities = next;
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
  selectedLockedIndex = null;
  clearResults();
});
$('apply').addEventListener('click', acceptWashResult);
$('next-roll').addEventListener('click', discardWashResult);
$('retry').addEventListener('click', loadCurrentModel);
window.addEventListener('focus', checkStageBoundary);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') checkStageBoundary();
});
renderLanguage();
window.addEventListener('resize', () => {
  if ($('language-options').matches(':popover-open')) positionLanguageOptions();
});
if (showServerWelcome) $('server-welcome-dialog').showModal();
loadCurrentModel();
