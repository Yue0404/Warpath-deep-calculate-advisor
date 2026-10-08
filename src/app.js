import { availableDeltas, deriveResult, parseQuality } from './input.js';
import { languages, detectLanguage, normalizeLocale, translate } from './i18n.js';
import { loadModel } from './model-loader.js';
import { createNetworkClock } from './network-time.js';
import { resolveBrowserPreference, resolveInitialServer, shouldShowServerWelcome } from './preferences.js';
import { createViewer } from './viewer.js';

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
let locale = normalizeLocale(storage.get('warpath-language'));
if (!supportedLocales.includes(locale)) locale = browserPreference;
else storage.set('warpath-language', locale);
const savedServer = storage.get('warpath-server');
let region = resolveInitialServer({ browserPreference, savedServer });
const showServerWelcome = shouldShowServerWelcome({ browserPreference, storage });
const showServerControl = browserPreference === 'zh-Hans';
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
let loadNotice = { key: 'loading' };
let retryNotice = 'retry';
let retryVisible = false;
const t = (key, values) => translate(locale, key, values);
const viewer = createViewer({ translate: t, languages, browserPreference, showServerControl });
const deltaWeightsFor = (rawCurrent) => {
  const quality = parseQuality(rawCurrent, calculator.cap);
  if (!quality.valid || quality.empty) return {};
  return calculator.probabilities.rows[quality.value]?.delta_weights ?? {};
};
const resultAt = (index, rawCurrent = current[index], rawDelta = deltas[index]) => deriveResult(
  rawCurrent, rawDelta, calculator.cap, selectedLockedIndex === index, deltaWeightsFor(rawCurrent),
);

function setQualityError(kind, index, issue) {
  fieldErrors[kind][index] = issue;
  viewer.updateQualityError(kind, index, issue);
}

function showOnlyQualityError(kind = null, index = null) {
  for (const field of ['current', 'delta']) {
    for (let fieldIndex = 0; fieldIndex < 3; fieldIndex += 1) {
      const issue = fieldErrors[field][fieldIndex];
      if (!issue) continue;
      const show = field === kind && fieldIndex === index;
      if ((issue.show !== false) === show) continue;
      issue.show = show;
      viewer.updateQualityError(field, fieldIndex, issue);
    }
  }
}

function clearQualityErrors(kind = null) {
  for (const field of kind ? [kind] : ['current', 'delta']) {
    for (let index = 0; index < 3; index += 1) setQualityError(field, index, null);
  }
}

function renderLanguage() {
  viewer.renderLanguage({
    locale, region, timeStatus: networkClock.status(),
    decision, complete: completeState(),
  });
  renderLoadState();
  if (calculator) renderInputs();
}

function setLocale(nextLocale) {
  if (!supportedLocales.includes(nextLocale)) return;
  if (nextLocale !== locale) {
    locale = nextLocale;
    storage.set('warpath-language', locale);
    renderLanguage();
  }
  viewer.closeLanguagePopover();
}

function inputRow(index) {
  const quality = parseQuality(current[index], calculator.cap);
  const locked = selectedLockedIndex === index;
  const result = resultAt(index);
  const deltaValues = quality.valid && !quality.empty
    ? availableDeltas(quality.value, calculator.cap, locked, deltaWeightsFor(quality.value)) : [];
  return {
    index, locale, cap: calculator.cap, currentRaw: currentRaw[index] ?? current[index] ?? '',
    currentError: fieldErrors.current[index], deltaError: fieldErrors.delta[index],
    showLock: selectedLockedIndex === null || locked, locked, deltaValues,
    deltaValue: locked ? '0' : deltas[index], deltaDisabled: locked || !quality.valid || quality.empty,
    resultValid: result.valid, resultValue: result.value,
  };
}

function renderInputs() {
  if (!calculator) { viewer.clearRows(); return; }
  viewer.renderInputs([0, 1, 2].map(inputRow));
  renderChipCost();
}

function updateDerivedRow(index) {
  if (calculator) viewer.updateDerivedRow(inputRow(index));
}

function renderChipCost() {
  viewer.renderChipCost({
    visible: Boolean(calculator),
    cost: calculator ? (selectedLockedIndex === null ? calculator.ordinaryCost : calculator.lockedCost) : null,
  });
}

function completeState() {
  return Boolean(calculator && current.every((value) => Number.isInteger(value) && value === calculator.cap));
}

function setLoadStatus(key, canRetry = false, retryKey = 'retry', values = undefined) {
  loadNotice = key ? { key, values } : null;
  retryVisible = canRetry;
  retryNotice = retryKey;
  renderLoadState();
}

function renderLoadState() {
  viewer.renderLoadStatus({
    visible: Boolean(loadNotice),
    text: loadNotice ? t(loadNotice.key, loadNotice.values) : '',
    retryVisible,
    retryText: t(retryNotice),
  });
}

function renderStageStatus() {
  if (!modelState?.stage || modelState.status === 'ready') { setLoadStatus(null); return; }
  const key = modelState.status === 'not_open' ? 'stageNotOpen' : 'stageUnsupported';
  setLoadStatus(key, false, 'retry', key === 'stageUnsupported' ? { group: modelState.stage.group } : undefined);
}

function renderTimeStatus() {
  const status = networkClock.status();
  viewer.renderTimeStatus(status);
  if (status.lastError) { retryVisible = true; retryNotice = 'timeRetry'; }
  else if (loadNotice?.key === 'loadError') { retryVisible = true; retryNotice = 'retry'; }
  else { retryVisible = false; retryNotice = 'retry'; }
  renderLoadState();
}

function updateRecommendation() { viewer.renderRecommendation({ decision, complete: completeState() }); }

function resetQualityState({ render = false } = {}) {
  if (viewer.lockDialogOpen()) viewer.closeLockDialog(false);
  current = ['', '', ''];
  currentRaw = ['', '', ''];
  deltas = ['', '', ''];
  clearQualityErrors();
  selectedLockedIndex = null;
  pendingLockedIndex = null;
  decision = null;
  resultQualities = null;
  viewer.clearFormError();
  if (render && calculator) renderInputs();
  else {
    renderChipCost();
    viewer.clearRows();
  }
  updateRecommendation();
}

function invalidate() {
  decision = null;
  resultQualities = null;
  viewer.clearFormError();
  updateRecommendation();
}

function clearResults({ render = true } = {}) {
  deltas = ['', '', ''];
  clearQualityErrors('delta');
  const index = selectedLockedIndex;
  if (index !== null) deltas[index] = '0';
  invalidate();
  if (render && calculator) renderInputs();
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
    viewer.setProbabilityModel(null);
    modelState = null;
    decision = null;
    resultQualities = null;
    viewer.setInputsDisabled(true);
    viewer.clearRows();
    renderChipCost();
    setLoadStatus('timeError', true, 'timeRetry');
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
  if (viewer.lockDialogOpen()) viewer.closeLockDialog(false);
  if (stageTimer !== null) clearTimeout(stageTimer);
  stageTimer = null;
  viewer.setInputsDisabled(true);
  setLoadStatus('loading');
  renderChipCost();
  viewer.clearFormError();
  if (!calculator) {
    modelState = null;
    viewer.setProbabilityModel(null);
    decision = null;
    resultQualities = null;
    viewer.clearRows();
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
    viewer.setProbabilityModel(calculator?.probabilities ?? null);
    setLoadStatus(null);
    if (calculator) {
      viewer.setInputsDisabled(false);
      renderInputs();
    } else {
      calculator = null;
      decision = null;
      resultQualities = null;
      viewer.setInputsDisabled(true);
      viewer.clearRows();
      renderChipCost();
    }
    renderStageStatus();
    updateRecommendation();
    scheduleStageCheck(loaded.stage?.nextChangeAt);
  } catch (error) {
    if (sequence !== loadSequence || requestedRegion !== region) return;
    if (networkClock.isReady()) console.error('模型加载失败', error);
    calculator = null;
    viewer.setProbabilityModel(null);
    modelState = null;
    decision = null;
    resultQualities = null;
    viewer.setInputsDisabled(true);
    viewer.clearRows();
    renderChipCost();
    setLoadStatus(networkClock.isReady() ? 'loadError' : 'timeError', true, networkClock.isReady() ? 'retry' : 'timeRetry');
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
  viewer.setProbabilityModel(null);
  modelState = null;
  viewer.setInputsDisabled(true);
  loadCurrentModel();
}

function acceptWashResult() {
  if (!decision || !resultQualities) return;
  current = [...resultQualities];
  currentRaw = current.map(String);
  clearQualityErrors('current');
  clearResults();
}

function applyPendingLock() {
  selectedLockedIndex = pendingLockedIndex;
  pendingLockedIndex = null;
  clearResults();
  if (selectedLockedIndex !== null) viewer.focusLockToggle(selectedLockedIndex);
}

function discardWashResult() {
  if (!decision) return;
  clearResults();
}


viewer.bindLanguagePopover({ onLocaleSelect: setLocale });
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
  clearResults({ render: false });
  setQualityError('current', index, !parsed.valid
    ? { key: 'qualityRange', values: { cap: calculator.cap } } : null);
  for (let rowIndex = 0; rowIndex < 3; rowIndex++) updateDerivedRow(rowIndex);
});
$('quality-rows').addEventListener('change', (event) => {
  const select = event.target.closest('select[id^="delta-"]');
  if (!select || !calculator) return;
  const index = Number(select.id.slice('delta-'.length));
  if (!Number.isInteger(index) || index < 0 || index > 2) return;
  showOnlyQualityError('delta', index);
  const derived = deriveResult(current[index], select.value, calculator.cap, selectedLockedIndex === index,
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
    viewer.focusLockToggle(index);
    return;
  }
  if (selectedLockedIndex !== null) return;
  pendingLockedIndex = index;
  viewer.openLockConfirmation();
});
$('lock-continue').addEventListener('click', () => viewer.closeLockDialog(true, applyPendingLock));
$('lock-dialog').addEventListener('cancel', (event) => {
  // 按 ESC 时继续确认流程，确保选中的锁定词条得到应用。
  event.preventDefault();
  viewer.closeLockDialog(true, applyPendingLock);
});
$('server-welcome-close').addEventListener('click', () => viewer.welcomeDialogClose());
viewer.bindWelcomeDismissed(() => storage.set('warpath-server-welcome-dismissed', 'true'));
$('calculator-form').addEventListener('submit', (event) => {
  event.preventDefault();
  if (!calculator || loadingRegion !== null) return;
  viewer.clearFormError();
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
    viewer.focusQuality('current', invalidIndex);
    return;
  }
  current = parsed.map(({ value }) => value);
  if (completeState()) { decision = null; resultQualities = null; updateRecommendation(); return; }
  const rawDeltas = [0, 1, 2].map((index) => selectedLockedIndex === index ? '0' : $(`delta-${index}`)?.value ?? '');
  const results = rawDeltas.map((delta, index) => deriveResult(current[index], delta, calculator.cap,
    selectedLockedIndex === index, deltaWeightsFor(current[index])));
  const invalidDeltaIndex = results.findIndex((result) => !result.valid);
  if (invalidDeltaIndex !== -1) {
    results.forEach((result, index) => {
      if (!result.valid) setQualityError('delta', index, { key: 'invalidChange', show: index === invalidDeltaIndex });
    });
    viewer.focusQuality('delta', invalidDeltaIndex);
    return;
  }
  deltas = rawDeltas;
  const next = results.map(({ value }) => value);
  try {
    decision = calculator.evaluate(current, next, selectedLockedIndex);
    resultQualities = next;
    viewer.clearFormError();
    updateRecommendation();
  } catch (error) {
    viewer.showFormError(selectedLockedIndex !== null && current[selectedLockedIndex] !== next[selectedLockedIndex] ? 'lockedError' : 'invalid', { cap: calculator.cap });
  }
});
$('reset').addEventListener('click', () => resetQualityState({ render: true }));
$('apply').addEventListener('click', acceptWashResult);
$('next-roll').addEventListener('click', discardWashResult);
$('retry').addEventListener('click', loadCurrentModel);
window.addEventListener('focus', checkStageBoundary);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') checkStageBoundary();
});
renderLanguage();
if (showServerWelcome) viewer.showServerWelcome();
loadCurrentModel();
