import { createProbabilityViewer } from './probability-chart.js';

/** 将洗练决策映射为建议区的文字、显隐与重点动作。 */
export function renderRecommendation({ panel, title, unsupported, apply, nextRoll, decision, complete, translate }) {
  panel.hidden = !decision && !complete;
  panel.dataset.choice = complete ? 'complete' : decision?.choice ?? '';
  panel.dataset.priority = decision?.choice === 'accept' || decision?.choice === 'discard' ? decision.choice : 'none';
  title.textContent = complete ? translate('complete') : decision ? translate(decision.choice) : '';
  unsupported.hidden = !decision || decision.supported;
  apply.hidden = !decision || complete;
  nextRoll.hidden = !decision || complete;
}

/** 根据语言列表与首次浏览器语言决定当前语言要展示的旗帜。 */
export function resolveLanguageFlagCode(locale, languages, browserPreference) {
  if (locale === 'zh-Hant' && browserPreference === 'zh-Hans') return 'cn';
  return languages.find(({ code }) => code === locale)?.flag ?? 'un';
}

/** 页面视图：负责页面 DOM 的创建、更新、显隐、焦点和弹窗动画。 */
export function createViewer({ translate, languages, browserPreference, showServerControl }) {
  const $ = (id) => document.getElementById(id);
  const { autoUpdate, arrow, computePosition, flip, offset, shift, size } = window.FloatingUIDOM;
  const probabilityViewer = createProbabilityViewer({ translate });
  let closingLockDialog = false;
  let returnFocusAfterLanguageClose = false;
  let languagePositionCleanup;
  const qualityErrorPositionCleanups = new Map();

  function startFloatingPosition(reference, floating, { placement, arrowElement, isOpen, fitHeight = false }) {
    let active = true;
    let requestId = 0;
    const middleware = [offset(8), flip({ padding: 12 })];
    if (fitHeight) {
      middleware.push(size({
        padding: 12,
        apply({ availableHeight, elements }) {
          if (!active || !isOpen() || !elements.floating.isConnected) return;
          elements.floating.style.maxHeight = `min(${Math.max(0, availableHeight)}px, var(--language-options-max-height))`;
        },
      }));
    }
    middleware.push(shift({ padding: 12 }));
    if (arrowElement) middleware.push(arrow({ element: arrowElement, padding: 10 }));
    floating.style.visibility = 'hidden';

    const update = () => {
      const currentRequest = ++requestId;
      computePosition(reference, floating, { placement, strategy: 'fixed', middleware }).then((result) => {
        if (!active || currentRequest !== requestId || !isOpen()
            || !reference.isConnected || !floating.isConnected) return;
        Object.assign(floating.style, { left: `${result.x}px`, top: `${result.y}px`, visibility: 'visible' });
        floating.dataset.placement = result.placement;
        if (arrowElement && result.middlewareData.arrow) {
          const { x, y } = result.middlewareData.arrow;
          Object.assign(arrowElement.style, {
            left: x != null ? `${x}px` : '',
            top: y != null ? `${y}px` : '',
          });
        }
      });
    };
    const stopAutoUpdate = autoUpdate(reference, floating, update);

    return () => {
      if (!active) return;
      active = false;
      requestId += 1;
      stopAutoUpdate();
      floating.style.removeProperty('visibility');
      if (fitHeight) floating.style.removeProperty('max-height');
      delete floating.dataset.placement;
      if (arrowElement) {
        arrowElement.style.removeProperty('left');
        arrowElement.style.removeProperty('top');
      }
    };
  }

  function stopQualityErrorPosition(error) {
    const cleanup = qualityErrorPositionCleanups.get(error);
    if (!cleanup) return;
    qualityErrorPositionCleanups.delete(error);
    cleanup();
  }

  function stopAllQualityErrorPositions() {
    for (const error of qualityErrorPositionCleanups.keys()) stopQualityErrorPosition(error);
  }

  function renderRecommendationView({ decision, complete }) {
    renderRecommendation({ panel: $('recommendation'), title: $('decision-title'), unsupported: $('unsupported'),
      apply: $('apply'), nextRoll: $('next-roll'), decision, complete, translate });
  }

  function renderLanguageOptions(locale) {
    const options = $('language-options');
    options.replaceChildren(...languages.map(({ code, name }) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'language-option';
      button.dataset.language = code;
      button.setAttribute('aria-pressed', String(code === locale));
      const flagCode = resolveLanguageFlagCode(code, languages, browserPreference);
      const flag = document.createElement('img');
      flag.src = new URL(`../flags/${flagCode.toLowerCase()}.svg`, import.meta.url).href;
      flag.alt = '';
      flag.setAttribute('aria-hidden', 'true');
      const label = document.createElement('span');
      label.textContent = name;
      button.append(flag, label);
      return button;
    }));
  }

  function toggleLanguageOptions() {
    const options = $('language-options');
    if (options.matches(':popover-open')) {
      options.hidePopover();
      return;
    }
    options.style.visibility = 'hidden';
    options.showPopover();
  }

  function closeLanguagePopover() {
    returnFocusAfterLanguageClose = true;
    $('language-options').hidePopover();
  }

  function renderLanguage({ locale, region, timeStatus, decision, complete }) {
    document.documentElement.lang = locale;
    document.documentElement.dir = languages.find(({ code }) => code === locale).dir;
    document.title = `Warpath · ${translate('title')}`;
    // 图表弹窗由 probabilityViewer 独占维护，避免全局翻译覆盖其动态视图。
    document.querySelectorAll('[data-i18n]:not(#view-probabilities):not(#retry):not(#probability-dialog [data-i18n])').forEach((element) => {
      element.textContent = translate(element.dataset.i18n);
    });
    $('workspace').setAttribute('aria-label', translate('title'));
    $('language').setAttribute('aria-label', translate('language'));
    $('language-options').setAttribute('aria-label', translate('language'));
    $('language-name').textContent = languages.find(({ code }) => code === locale).name;
    $('server').replaceChildren(new Option(translate('serverCn'), 'cn'), new Option(translate('serverInternational'), 'international'));
    $('server').value = region;
    const flagCode = resolveLanguageFlagCode(locale, languages, browserPreference);
    if (flagCode && $('language-flag')) $('language-flag').src = new URL(`../flags/${flagCode.toLowerCase()}.svg`, import.meta.url).href;
    renderLanguageOptions(locale);
    $('server-control').hidden = !showServerControl;
    if (timeStatus) renderTimeStatus(timeStatus);
    probabilityViewer.renderLanguage();
    $('form-error').hidden = true;
    renderRecommendationView({ decision, complete });
  }

  function renderTimeStatus(status) {
    const element = $('time-status');
    if (!element) return;
    if (!status.ready && status.lastError) {
      element.textContent = translate('timeError');
      element.hidden = false;
    } else if (status.lastError) {
      element.textContent = translate('timeSync');
      element.hidden = false;
    } else {
      element.textContent = '';
      element.hidden = true;
    }
  }

  function showFormError(key, values) {
    $('form-error').textContent = translate(key, values);
    $('form-error').hidden = false;
  }

  function makeQualityError(kind, index) {
    const error = document.createElement('span');
    error.id = `${kind}-error-${index}`;
    error.className = 'quality-error';
    error.setAttribute('role', 'alert');
    error.hidden = true;
    const message = document.createElement('span');
    message.className = 'quality-error-message';
    const arrowElement = document.createElement('span');
    arrowElement.className = 'quality-error-arrow';
    arrowElement.setAttribute('aria-hidden', 'true');
    error.append(message, arrowElement);
    return error;
  }

  function updateQualityError(kind, index, issue) {
    const input = $(`${kind}-${index}`);
    const error = $(`${kind}-error-${index}`);
    if (!input || !error) return;
    stopQualityErrorPosition(error);
    input.setAttribute('aria-invalid', String(Boolean(issue)));
    input.closest('.quality-field')?.classList.toggle('has-error', Boolean(issue));
    error.querySelector('.quality-error-message').textContent = issue ? translate(issue.key, issue.values) : '';
    error.hidden = !issue || issue.show === false;
    if (!error.hidden) {
      const arrowElement = error.querySelector('.quality-error-arrow');
      qualityErrorPositionCleanups.set(error, startFloatingPosition(input, error, {
        placement: 'top',
        arrowElement,
        isOpen: () => !error.hidden && error.isConnected && input.isConnected && $(input.id) === input,
      }));
    }
  }

  function renderInputs(rows) {
    const host = $('quality-rows');
    stopAllQualityErrorPositions();
    host.replaceChildren();
    rows.map(presentRow).forEach((item) => {
      const row = document.createElement('div');
      row.className = 'quality-row';
      const name = document.createElement('span');
      name.className = 'attribute-name';
      const label = document.createElement('span');
      label.className = 'attribute-label';
      const match = ['zh-Hans', 'zh-Hant'].includes(item.locale) ? /^(.*)(加深\/抵抗)$/.exec(item.name) : null;
      if (match) label.append(document.createTextNode(match[1]), document.createElement('br'), document.createTextNode(match[2]));
      else label.textContent = item.name;
      name.append(label);
      if (item.showLock) {
        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'lock-toggle';
        toggle.dataset.lockIndex = String(item.index);
        toggle.setAttribute('aria-label', translate(item.locked ? 'unlockAttribute' : 'lockAttribute', { n: item.index + 1 }));
        toggle.setAttribute('aria-pressed', String(item.locked));
        toggle.innerHTML = item.locked
          ? '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>'
          : '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 7-2.6M12 14v3"/></svg>';
        name.append(toggle);
      }
      const currentField = document.createElement('div');
      currentField.className = 'quality-field';
      currentField.dataset.label = item.currentLabel;
      const input = makeCurrentInput(item);
      const unit = document.createElement('span');
      unit.textContent = item.qualityLabel;
      currentField.append(input, unit, makeQualityError('current', item.index));
      const deltaField = document.createElement('div');
      deltaField.className = 'quality-field delta-field';
      deltaField.dataset.label = item.deltaLabel;
      deltaField.append(makeDeltaSelect(item), makeQualityError('delta', item.index));
      const resultField = document.createElement('div');
      resultField.className = 'quality-field result-field';
      resultField.dataset.label = item.resultLabel;
      resultField.append(makeResult(item));
      row.append(name, currentField, deltaField, resultField);
      host.append(row);
      updateQualityError('current', item.index, item.currentError);
      updateQualityError('delta', item.index, item.deltaError);
    });
  }

  function presentRow(row) {
    const index = row.index;
    const attributeKeys = ['skillAttribute', 'globalAttribute', 'normalAttribute'];
    const options = row.locked ? [{ label: translate('unchanged'), value: '0' }]
      : [{ label: '—', value: '' }, ...row.deltaValues.map((delta) => ({
        label: delta === 0 ? translate('unchanged') : `${delta > 0 ? '+' : ''}${delta}`,
        value: String(delta),
      }))];
    return {
      ...row,
      name: translate(attributeKeys[index]),
      currentLabel: translate('current'),
      currentAria: translate('qualityLabel', { section: translate('current'), n: index + 1 }),
      rangeTitle: translate('qualityRange', { cap: row.cap }),
      placeholder: translate('enterQuality'),
      qualityLabel: translate('quality'),
      deltaLabel: translate('delta'),
      deltaAria: translate('deltaLabel', { n: index + 1 }),
      options,
      resultLabel: translate('result'),
      resultAria: translate('qualityLabel', { section: translate('result'), n: index + 1 }),
    };
  }

  function makeCurrentInput(item) {
    const input = document.createElement('input');
    input.id = `current-${item.index}`;
    input.type = 'text';
    input.inputMode = 'numeric';
    input.autocomplete = 'off';
    input.setAttribute('aria-label', item.currentAria);
    input.title = item.rangeTitle;
    input.placeholder = item.placeholder;
    input.value = item.currentRaw;
    input.setAttribute('aria-describedby', `current-error-${item.index}`);
    input.setAttribute('aria-invalid', String(Boolean(item.currentError)));
    return input;
  }

  function makeDeltaSelect(item) {
    const select = document.createElement('select');
    select.id = `delta-${item.index}`;
    select.setAttribute('aria-label', item.deltaAria);
    select.setAttribute('aria-describedby', `delta-error-${item.index}`);
    select.setAttribute('aria-invalid', String(Boolean(item.deltaError)));
    item.options.forEach(({ label, value }) => select.add(new Option(label, value)));
    select.value = item.deltaValue;
    select.disabled = item.deltaDisabled;
    return select;
  }

  function makeResult(item) {
    const output = document.createElement('output');
    output.id = `next-${item.index}`;
    output.className = 'result-value';
    output.setAttribute('aria-label', item.resultAria);
    output.textContent = item.resultValid ? String(item.resultValue) : '—';
    return output;
  }

  function updateDerivedRow(item) {
    item = presentRow(item);
    const row = $(`current-${item.index}`)?.closest('.quality-row');
    if (!row) return;
    const deltaField = row.querySelector('.delta-field');
    const error = deltaField.querySelector('.quality-error');
    const select = makeDeltaSelect(item);
    deltaField.replaceChildren(select, ...(error ? [error] : []));
    updateQualityError('delta', item.index, item.deltaError);
    row.querySelector('.result-field').replaceChildren(makeResult(item));
  }

  function renderChipCost({ visible, cost }) {
    const host = $('chip-cost');
    if (!host) return;
    host.hidden = !visible;
    $('chip-cost-text').textContent = visible ? translate('chipCost', { cost }) : '';
  }

  function clearFormError() { $('form-error').hidden = true; }
  function clearRows() {
    stopAllQualityErrorPositions();
    $('quality-rows').replaceChildren();
  }
  function setInputsDisabled(disabled) { $('inputs').disabled = disabled; }
  function renderLoadStatus({ visible, text, retryVisible, retryText }) {
    const status = $('load-status');
    status.hidden = !visible;
    status.textContent = text;
    const retry = $('retry');
    retry.hidden = !retryVisible;
    retry.textContent = retryText;
  }

  function parseCssTime(value) {
    const amount = Number.parseFloat(value);
    return Number.isFinite(amount) ? amount * (value.trim().endsWith('ms') ? 1 : 1000) : 0;
  }

  function closeLockDialog(applyPending, onApply) {
    const dialog = $('lock-dialog');
    if (!dialog?.open || closingLockDialog) return;
    closingLockDialog = true;
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
      closingLockDialog = false;
      if (applyPending) onApply?.();
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
    const transitionMs = opacityIndex < 0 ? 0 : Math.max(0, durations[opacityIndex % durations.length] + delays[opacityIndex % delays.length]);
    if (!wasVisible || matchMedia('(prefers-reduced-motion: reduce)').matches || transitionMs <= 0) finish();
    else fallbackTimer = setTimeout(finish, Math.min(500, transitionMs + 50));
  }

  function openLockConfirmation() {
    const dialog = $('lock-dialog');
    if (!dialog || closingLockDialog) return false;
    $('lock-warning').textContent = translate('lockWarning');
    if (!dialog.open) dialog.showModal();
    requestAnimationFrame(() => {
      if (dialog.open && !closingLockDialog) dialog.classList.add('is-visible');
    });
    $('lock-continue').focus();
    return true;
  }

  function showServerWelcome() { $('server-welcome-dialog').showModal(); }

  function bindLanguagePopover({ onLocaleSelect }) {
    $('language').addEventListener('click', toggleLanguageOptions);
    $('language-options').addEventListener('click', (event) => {
      const option = event.target.closest('[data-language]');
      if (option) onLocaleSelect(option.dataset.language);
    });
    $('language-options').addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      returnFocusAfterLanguageClose = true;
      $('language-options').hidePopover();
    });
    $('language-options').addEventListener('toggle', (event) => {
      const open = event.newState === 'open';
      $('language').setAttribute('aria-expanded', String(open));
      languagePositionCleanup?.();
      languagePositionCleanup = undefined;
      if (open) {
        const trigger = $('language');
        const options = $('language-options');
        languagePositionCleanup = startFloatingPosition(trigger, options, {
          placement: 'bottom-start',
          fitHeight: true,
          isOpen: () => options.matches(':popover-open'),
        });
      }
      if (!open && returnFocusAfterLanguageClose) {
        returnFocusAfterLanguageClose = false;
        $('language').focus();
      }
    });
    document.addEventListener('focusin', (event) => {
      const options = $('language-options');
      if (options.matches(':popover-open') && event.target !== $('language') && !options.contains(event.target)) options.hidePopover();
    });
  }

  function lockDialogOpen() { return $('lock-dialog').open; }
  function focusLockToggle(index) { $('quality-rows').querySelector(`button.lock-toggle[data-lock-index="${index}"]`)?.focus(); }
  function focusQuality(kind, index) { $(`${kind}-${index}`)?.focus(); }
  function setProbabilityModel(model) { probabilityViewer.setModel(model); }
  function welcomeDialogClose() { $('server-welcome-dialog').close(); }
  function bindWelcomeDismissed(onDismiss) { $('server-welcome-dialog').addEventListener('close', onDismiss); }

  return {
    renderLanguage, renderTimeStatus, renderRecommendation: renderRecommendationView, renderInputs, updateDerivedRow,
    renderChipCost, renderLoadStatus, showFormError, clearFormError, clearRows, setInputsDisabled,
    updateQualityError, openLockConfirmation, closeLockDialog, lockDialogOpen,
    focusLockToggle, focusQuality, setProbabilityModel,
    showServerWelcome, welcomeDialogClose, bindWelcomeDismissed, bindLanguagePopover, closeLanguagePopover,
  };
}
