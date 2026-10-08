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
let current = ['', '', ''];
let currentRaw = ['', '', ''];
let deltas = ['', '', ''];
const fieldErrors = { current: [null, null, null], delta: [null, null, null] };
let selectedLockedIndex = null;
let pendingLockedIndex = null;
let closingDialog = false;
let returnFocusAfterLanguageClose = false;
const t = (key, values) => translate(locale, key, values);
const probabilityViewer = createProbabilityViewer({ translate: t });
const lockedIndex = () => selectedLockedIndex;
const deltaWeightsFor = (rawCurrent) => {
  const quality = parseQuality(rawCurrent, calculator.cap);
  if (!quality.valid || quality.empty) return {};
  return calculator.probabilities.rows[quality.value]?.delta_weights ?? {};
};
const resultAt = (index, rawCurrent = current[index], rawDelta = deltas[index]) => deriveResult(
  rawCurrent, rawDelta, calculator.cap, lockedIndex() === index, deltaWeightsFor(rawCurrent),
);

function showFormError(key, values) {
  $('form-error').textContent = t(key, values);
  $('form-error').hidden = false;
}

function positionQualityError(error) {
  if (!error || error.hidden) return;
  const input = $(error.dataset.inputId);
  if (!input) return;
  const inputRect = input.getBoundingClientRect();
  const errorRect = error.getBoundingClientRect();
  const margin = 12;
  const left = Math.max(margin, Math.min(
    inputRect.left + inputRect.width / 2 - errorRect.width / 2,
    window.innerWidth - errorRect.width - margin,
  ));
  const above = inputRect.top - errorRect.height - 8;
  const pointsDown = above >= 8;
  const top = pointsDown ? above : inputRect.bottom + 8;
  const arrowX = Math.max(10, Math.min(inputRect.left + inputRect.width / 2 - left, errorRect.width - 10));
  error.style.left = `${left}px`;
  error.style.top = `${top}px`;
  error.style.setProperty('--arrow-x', `${arrowX}px`);
  error.classList.toggle('quality-error-above', pointsDown);
}

function repositionQualityErrors() {
  document.querySelectorAll('.quality-error:not([hidden])').forEach(positionQualityError);
}

function updateQualityError(kind, index) {
  const issue = fieldErrors[kind][index];
  const input = $(`${kind}-${index}`);
  const error = $(`${kind}-error-${index}`);
  if (!input || !error) return;
  input.setAttribute('aria-invalid', String(Boolean(issue)));
  input.closest('.quality-field')?.classList.toggle('has-error', Boolean(issue));
  error.textContent = issue ? t(issue.key, issue.values) : '';
  error.hidden = !issue || issue.show === false;
  if (!error.hidden) requestAnimationFrame(() => positionQualityError(error));
}

function setQualityError(kind, index, issue) {
  fieldErrors[kind][index] = issue;
  updateQualityError(kind, index);
}

function showOnlyQualityError(kind = null, index = null) {
  for (const field of ['current', 'delta']) {
    for (let fieldIndex = 0; fieldIndex < 3; fieldIndex += 1) {
      const issue = fieldErrors[field][fieldIndex];
      if (!issue) continue;
      const show = field === kind && fieldIndex === index;
      if ((issue.show !== false) === show) continue;
      issue.show = show;
      updateQualityError(field, fieldIndex);
    }
  }
}

function clearQualityErrors(kind = null) {
  for (const field of kind ? [kind] : ['current', 'delta']) {
    for (let index = 0; index < 3; index += 1) setQualityError(field, index, null);
  }
}

function makeQualityError(kind, index) {
  const error = document.createElement('span');
  error.id = `${kind}-error-${index}`;
  error.className = 'quality-error';
  error.dataset.inputId = `${kind}-${index}`;
  error.setAttribute('role', 'alert');
  error.hidden = true;
  return error;
}

function renderAttributeLabel(label, text) {
  if (!['zh-CN', 'zh-TW'].includes(locale)) {
    label.textContent = text;
    return;
  }
  const match = /^(.*)(加深\/抵抗)$/.exec(text);
  if (!match) {
    label.textContent = text;
    return;
  }
  label.append(document.createTextNode(match[1]), document.createElement('br'), document.createTextNode(match[2]));
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
  input.placeholder = t('enterQuality');
  input.value = currentRaw[index] ?? current[index] ?? '';
  input.setAttribute('aria-describedby', `current-error-${index}`);
  input.setAttribute('aria-invalid', String(Boolean(fieldErrors.current[index])));
  return input;
}

function makeDeltaSelect(index) {
  const select = document.createElement('select');
  select.id = `delta-${index}`;
  select.setAttribute('aria-label', t('deltaLabel', { n: index + 1 }));
  select.setAttribute('aria-describedby', `delta-error-${index}`);
  select.setAttribute('aria-invalid', String(Boolean(fieldErrors.delta[index])));
  const locked = lockedIndex() === index;
  const quality = parseQuality(current[index], calculator.cap);
  if (!locked) select.add(new Option('—', ''));
  for (const delta of quality.valid && !quality.empty
    ? availableDeltas(quality.value, calculator.cap, locked, deltaWeightsFor(quality.value)) : []) {
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
  const error = deltaField.querySelector('.quality-error');
  deltaField.replaceChildren(makeDeltaSelect(index), ...(error ? [error] : []));
  updateQualityError('delta', index);
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
    renderAttributeLabel(label, t(names[index]));
    name.append(label);
    if (selectedLockedIndex === null || selectedLockedIndex === index) {
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
    currentField.append(currentInput, currentUnit, makeQualityError('current', index));

    const deltaField = document.createElement('div');
    deltaField.className = 'quality-field delta-field';
    deltaField.dataset.label = t('delta');
    deltaField.append(makeDeltaSelect(index), makeQualityError('delta', index));

    const resultField = document.createElement('div');
    resultField.className = 'quality-field result-field';
    resultField.dataset.label = t('result');
    resultField.append(makeResult(index));
    row.append(name, currentField, deltaField, resultField);
    $('quality-rows').append(row);
    updateQualityError('current', index);
    updateQualityError('delta', index);
  }
  renderChipCost();
}

function renderChipCost() {
  const host = $('chip-cost');
  const text = $('chip-cost-text');
  if (!host || !text) return;
  host.hidden = !calculator;
  text.textContent = calculator
    ? t('chipCost', { cost: lockedIndex() === null ? calculator.ordinaryCost : calculator.lockedCost })
    : '';
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
  current = ['', '', ''];
  currentRaw = ['', '', ''];
  deltas = ['', '', ''];
  clearQualityErrors();
  selectedLockedIndex = null;
  pendingLockedIndex = null;
  renderChipCost();
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
  clearQualityErrors('delta');
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
    renderChipCost();
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
  renderChipCost();
  $('form-error').hidden = true;
  if (!calculator) {
    modelState = null;
    probabilityViewer.setModel(null);
    decision = null;
    resultQualities = null;
    $('quality-rows').replaceChildren();
    renderChipCost();
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
      renderChipCost();
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
    renderChipCost();
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
  renderChipCost();
  probabilityViewer.setModel(null);
  modelState = null;
  $('inputs').disabled = true;
  loadCurrentModel();
}

function acceptWashResult() {
  if (!decision || !resultQualities) return;
  current = [...resultQualities];
  currentRaw = current.map(String);
  clearQualityErrors('current');
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
      selectedLockedIndex = pendingLockedIndex;
      pendingLockedIndex = null;
      clearResults();
      if (selectedLockedIndex !== null) {
        $('quality-rows').querySelector(`button.lock-toggle[data-lock-index="${selectedLockedIndex}"]`)?.focus();
      }
    }
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

function requestLock(index) {
  const dialog = $('lock-dialog');
  if (!dialog || closingDialog) return;
  pendingLockedIndex = index;
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
$('quality-rows').addEventListener('focusin', (event) => {
  const control = event.target.closest('input[id^="current-"], select[id^="delta-"]');
  if (!control) {
    showOnlyQualityError();
    return;
  }
  const kind = control.id.startsWith('current-') ? 'current' : 'delta';
  const index = Number(control.id.slice(kind.length + 1));
  showOnlyQualityError(kind, index);
});
$('quality-rows').addEventListener('input', (event) => {
  const input = event.target.closest('input[id^="current-"]');
  if (!input || !calculator) return;
  const index = Number(input.id.slice('current-'.length));
  if (!Number.isInteger(index) || index < 0 || index > 2) return;
  showOnlyQualityError('current', index);
  currentRaw[index] = input.value;
  const parsed = parseQuality(input.value, calculator.cap);
  current[index] = parsed.valid ? (parsed.empty ? '' : parsed.value) : input.value;
  deltas = ['', '', ''];
  clearQualityErrors('delta');
  const locked = lockedIndex();
  if (locked !== null) deltas[locked] = '0';
  setQualityError('current', index, !parsed.valid
    ? { key: 'qualityRange', values: { cap: calculator.cap } } : null);
  invalidate();
  for (let rowIndex = 0; rowIndex < 3; rowIndex++) updateDerivedRow(rowIndex);
});
$('quality-rows').addEventListener('change', (event) => {
  const select = event.target.closest('select[id^="delta-"]');
  if (!select || !calculator) return;
  const index = Number(select.id.slice('delta-'.length));
  if (!Number.isInteger(index) || index < 0 || index > 2) return;
  showOnlyQualityError('delta', index);
  const derived = deriveResult(current[index], select.value, calculator.cap, lockedIndex() === index,
    deltaWeightsFor(current[index]));
  if (!derived.valid) {
    deltas[index] = '';
    setQualityError('delta', index, { key: 'invalidChange' });
    updateDerivedRow(index);
    return;
  }
  deltas[index] = select.value;
  setQualityError('delta', index, null);
  invalidate();
  updateDerivedRow(index);
});
$('quality-rows').addEventListener('click', (event) => {
  const toggle = event.target.closest('button.lock-toggle');
  if (!toggle) return;
  const index = Number(toggle.dataset.lockIndex);
  if (!Number.isInteger(index) || index < 0 || index > 2) return;
  if (selectedLockedIndex === index) {
    selectedLockedIndex = null;
    clearResults();
    $('quality-rows').querySelector(`button.lock-toggle[data-lock-index="${index}"]`)?.focus();
    return;
  }
  if (selectedLockedIndex !== null) return;
  requestLock(index);
});
$('lock-continue').addEventListener('click', () => closeLockDialog(true));
$('lock-dialog').addEventListener('cancel', (event) => {
  // 按 ESC 时继续确认流程，确保选中的锁定词条得到应用。
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
  $('form-error').hidden = true;
  clearQualityErrors();
  const inputs = [0, 1, 2].map((index) => $(`current-${index}`));
  currentRaw = inputs.map((input) => input.value);
  const parsed = inputs.map((input) => parseQuality(input.value, calculator.cap));
  const invalidIndex = parsed.findIndex((entry) => !entry.valid || entry.empty);
  if (invalidIndex !== -1) {
    parsed.forEach((entry, index) => {
      if (!entry.valid || entry.empty) {
        setQualityError('current', index, {
          key: 'qualityRange', values: { cap: calculator.cap }, show: index === invalidIndex,
        });
      }
    });
    inputs[invalidIndex]?.focus();
    return;
  }
  current = parsed.map(({ value }) => value);
  currentRaw = inputs.map((input) => input.value);
  if (completeState()) { decision = null; resultQualities = null; updateRecommendation(); return; }
  const rawDeltas = [0, 1, 2].map((index) => lockedIndex() === index ? '0' : $(`delta-${index}`)?.value ?? '');
  const results = rawDeltas.map((delta, index) => deriveResult(current[index], delta, calculator.cap,
    lockedIndex() === index, deltaWeightsFor(current[index])));
  const invalidDeltaIndex = results.findIndex((result) => !result.valid);
  if (invalidDeltaIndex !== -1) {
    results.forEach((result, index) => {
      if (!result.valid) setQualityError('delta', index, { key: 'invalidChange', show: index === invalidDeltaIndex });
    });
    $(`delta-${invalidDeltaIndex}`)?.focus();
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
  current = ['', '', ''];
  currentRaw = ['', '', ''];
  selectedLockedIndex = null;
  pendingLockedIndex = null;
  clearQualityErrors();
  clearResults();
});
$('apply').addEventListener('click', acceptWashResult);
$('next-roll').addEventListener('click', discardWashResult);
$('retry').addEventListener('click', loadCurrentModel);
window.addEventListener('resize', repositionQualityErrors);
window.addEventListener('scroll', repositionQualityErrors, true);
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
