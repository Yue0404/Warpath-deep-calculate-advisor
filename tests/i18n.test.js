import test from 'node:test';
import assert from 'node:assert/strict';
import { detectLanguage, languages, messages, translate } from '../src/i18n.js';

const productionKeys = [
  'title', 'language', 'current', 'result', 'quality', 'reset', 'compare', 'retry', 'loading', 'loadError',
  'equalNote', 'unsupported', 'accept', 'discard', 'indifferent', 'complete', 'invalid', 'lockedError',
  'author', 'bilibili', 'footer', 'qualityLabel', 'enterQuality', 'chipCost', 'skillAttribute', 'globalAttribute',
  'normalAttribute', 'delta', 'deltaLabel', 'unchanged', 'lockWarning', 'qualityRange', 'invalidChange',
  'server', 'serverCn', 'serverInternational', 'stageNotOpen', 'stageUnsupported', 'acceptResult', 'discardResult',
  'welcomeServer', 'welcomeClose', 'timeSync', 'timeError', 'timeRetry', 'lockAttribute', 'unlockAttribute',
  'viewProbabilities', 'probabilityTitle', 'probabilityCaption', 'probabilityTable', 'probabilityAxis',
  'probabilityPercent', 'probabilityConfig', 'probabilityDecreaseTwo', 'probabilityDecreaseOne',
  'probabilityUnchanged', 'probabilityIncreaseOne', 'probabilityIncreaseTwo', 'close',
  'probabilityChartLoadError', 'probabilityChartRetry',
];

test('18种语言只保留当前生产界面使用的翻译键', () => {
  const expected = [...productionKeys].sort();
  assert.equal(languages.length, 18);
  assert.deepEqual(Object.keys(messages).sort(), languages.map(({ code }) => code).sort());
  assert.deepEqual(Object.keys(messages['zh-CN']).sort(), expected);
  for (const { code, dir } of languages) {
    assert.deepEqual(Object.keys(messages[code]).sort(), expected, `${code} 键集合不一致`);
    for (const [key, value] of Object.entries(messages[code])) {
      assert.equal(typeof value, 'string', `${code}.${key} 必须是文本`);
      assert.ok(value.trim(), `${code}.${key} 不能为空`);
      assert.doesNotMatch(value, /^\s*\[[^\]]+\]\s*$/, `${code}.${key} 不可使用占位翻译`);
      if (code === 'ar') assert.equal(dir, 'rtl');
      else assert.equal(dir, 'ltr');
    }
  }
});

test('各语言占位符集合一致', () => {
  const placeholders = (value) => [...value.matchAll(/\{([a-zA-Z][\w]*)\}/g)].map((match) => match[1]).sort();
  for (const key of productionKeys) {
    for (const { code } of languages) {
      assert.deepEqual(placeholders(messages[code][key]), placeholders(messages['zh-CN'][key]), `${code}.${key} 占位符不一致`);
    }
  }
});

test('18种语言均提供旗帜代码且语言名称保持原文', () => {
  const expectedFlags = {
    'zh-CN': 'cn', 'zh-TW': 'tw', en: 'gb', ar: 'sa', fr: 'fr', de: 'de', id: 'id', it: 'it',
    ja: 'jp', ko: 'kr', ms: 'my', pl: 'pl', pt: 'br', ru: 'ru', es: 'es', th: 'th', tr: 'tr', vi: 'vn',
  };
  for (const language of languages) {
    assert.equal(language.flag, expectedFlags[language.code], `${language.code} 旗帜代码不正确`);
    assert.ok(language.name.trim(), `${language.code} 必须保留语言名称`);
  }
});

test('当前界面文案覆盖全部语言并正确插值', () => {
  const interpolated = {
    deltaLabel: { n: 2 },
    chipCost: { cost: 20 },
    qualityLabel: { section: 'Current quality', n: 2 },
    qualityRange: { cap: 11 },
    stageUnsupported: { group: '60' },
    lockAttribute: { n: 2 },
    unlockAttribute: { n: 2 },
    probabilityConfig: { group: '40', cap: 11 },
  };
  for (const { code } of languages) {
    for (const key of productionKeys) assert.ok(messages[code][key]?.trim(), `${code}.${key} 缺失`);
    for (const [key, values] of Object.entries(interpolated)) {
      assert.doesNotMatch(translate(code, key, values), /\{[a-zA-Z][\w]*\}/, `${code}.${key} 未插值`);
    }
    assert.equal(messages[code].probabilityAxis, messages[code].current, `${code}.probabilityAxis 应沿用当前品阶译名`);
    for (const key of ['probabilityDecreaseTwo', 'probabilityDecreaseOne', 'probabilityIncreaseOne', 'probabilityIncreaseTwo']) {
      assert.ok(messages[code][key].includes(messages[code].quality), `${code}.${key} 必须沿用品阶单位`);
    }
  }
  assert.equal(messages['zh-CN'].compare, '计算');
  assert.equal(messages['zh-CN'].enterQuality, '请输入');
  assert.equal(messages['zh-TW'].enterQuality, '請輸入');
  assert.equal(messages['zh-CN'].lockWarning, '根据现有数据，推荐您任何时候都选择消耗5张计算卡同时洗练3个词条。');
  assert.equal(messages['zh-CN'].welcomeClose, '我知道了');
  assert.equal(messages['zh-TW'].welcomeClose, '我知道了');
  assert.equal(messages['zh-CN'].probabilityCaption, '每根柱子表示当前品阶下单个词条的升降概率。');
});

test('游戏词条名称以 canonical source IDs 为依据', () => {
  // 类别名对应 Buffname#buff_intro#all_officer_skill_damage_b_p / all_officer_skill_avoid_b_p 与 all_bullet_damage_b_p / all_bullet_avoid_b_p。
  // 伤害词根对应 blueprint_deepens / blueprint_resistance；芯片名对应 super_compute_deep_calculate_item。
  assert.equal(messages.en.skillAttribute, 'Officer Skill Boost/Resilience');
  assert.equal(messages.en.globalAttribute, 'Dmg Intensity/Resist');
  assert.equal(messages.en.normalAttribute, 'Normal Attack Boost/Resilience');
  assert.equal(messages.en.chipCost, 'Uses {cost} Compute Chips');
  assert.equal(messages.en.title, 'Data Mining Calculator');
  const metricTerms = {
    en: 'Advanced Metric', de: 'Fortgeschrittene Kennzahl', fr: 'indicateur avancé',
    id: 'Advanced Metric', ja: '高級データ', ko: '고급 데이터',
  };
  for (const [code, term] of Object.entries(metricTerms)) {
    assert.ok(messages[code].lockAttribute.includes(term), `${code}.lockAttribute 应使用游戏内 Advanced Metric 译名`);
    assert.ok(messages[code].unlockAttribute.includes(term), `${code}.unlockAttribute 应使用游戏内 Advanced Metric 译名`);
  }
});

test('依浏览器语言和中文地区选择界面语言', () => {
  assert.equal(detectLanguage(['fr-CA', 'ja-JP']), 'fr');
  assert.equal(detectLanguage(['zh-Hans']), 'zh-CN');
  assert.equal(detectLanguage(['zh-CN']), 'zh-CN');
  assert.equal(detectLanguage(['zh-SG']), 'zh-CN');
  assert.equal(detectLanguage(['zh-Hant']), 'zh-TW');
  assert.equal(detectLanguage(['zh-HK']), 'zh-TW');
  assert.equal(detectLanguage(['zh-TW']), 'zh-TW');
  assert.equal(detectLanguage(['xx', 'pt-BR']), 'pt');
  assert.equal(detectLanguage([]), 'en');
});

test('阿拉伯语使用RTL，其他语言使用LTR', () => {
  assert.equal(languages.find(({ code }) => code === 'ar').dir, 'rtl');
  assert.ok(languages.filter(({ code }) => code !== 'ar').every(({ dir }) => dir === 'ltr'));
});

test('翻译替换变量并对缺失语言或键明确报错', () => {
  const currentLabel = translate('en', 'current');
  assert.equal(translate('en', 'qualityLabel', { section: currentLabel, n: 2 }), `${currentLabel} · Advanced Metric 2`);
  assert.throws(() => translate('en', 'notAKey'), /Missing translation: en\.notAKey/);
  assert.throws(() => translate('xx', 'title'), /Missing translation: xx\.title/);
});
