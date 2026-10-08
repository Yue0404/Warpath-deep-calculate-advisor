import test from 'node:test';
import assert from 'node:assert/strict';
import { detectLanguage, languages, messages, translate } from '../src/i18n.js';

test('全部支持语言具有相同且非空的翻译键', () => {
  const expected = Object.keys(messages['zh-CN']).sort();
  assert.equal(languages.length, 18);
  assert.deepEqual(Object.keys(messages).sort(), languages.map(({ code }) => code).sort());
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
  for (const key of Object.keys(messages['zh-CN'])) {
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
  assert.equal(languages.length, 18);
  for (const language of languages) {
    assert.equal(language.flag, expectedFlags[language.code], `${language.code} 旗帜代码不正确`);
    assert.ok(language.name.trim(), `${language.code} 必须保留语言名称`);
  }
});

test('新增界面词条覆盖全部语言并正确插值', () => {
  const addedKeys = [
    'skillAttribute', 'globalAttribute', 'normalAttribute', 'delta', 'deltaLabel', 'unchanged',
    'lockWarning', 'continue', 'qualityRange', 'invalidChange', 'server', 'serverCn', 'serverInternational',
    'stageStatus', 'clockEstimate', 'stageNotOpen', 'stageUnsupported',
  ];
  for (const { code } of languages) {
    for (const key of addedKeys) {
      assert.ok(messages[code][key]?.trim(), `${code}.${key} 缺失`);
    }
    assert.equal(translate(code, 'deltaLabel', { n: 2 }).includes('{n}'), false, `${code}.deltaLabel 未插值`);
    assert.equal(translate(code, 'qualityRange', { cap: 11 }).includes('{cap}'), false, `${code}.qualityRange 未插值`);
    assert.equal(translate(code, 'stageStatus', { group: 'A', cap: 11 }).includes('{group}'), false, `${code}.stageStatus 未插值 group`);
    assert.equal(translate(code, 'stageStatus', { group: 'A', cap: 11 }).includes('{cap}'), false, `${code}.stageStatus 未插值 cap`);
    assert.equal(translate(code, 'stageUnsupported', { group: 'A' }).includes('{group}'), false, `${code}.stageUnsupported 未插值`);
  }
  assert.equal(messages['zh-CN'].skillAttribute, '技能伤害加深/抵抗');
  assert.equal(messages['zh-CN'].globalAttribute, '全局伤害加深/抵抗');
  assert.equal(messages['zh-CN'].normalAttribute, '普攻伤害加深/抵抗');
  assert.equal(messages['zh-CN'].lockWarning, '根据现有数据，推荐您任何时候都选择消耗5张计算卡同时洗练3个词条。');
  assert.equal(messages['zh-CN'].continue, '继续');
  assert.equal(messages['zh-CN'].indifferent, '保留或放弃均可');
  assert.equal(messages['zh-CN'].accept, '建议保留');
  assert.equal(messages['zh-CN'].discard, '建议放弃');
  assert.equal(messages['zh-CN'].complete, '三个词条均已满品');
  assert.equal(messages['zh-CN'].server, '服务器');
});

test('游戏词条名称以 canonical source IDs 为依据', () => {
  // 类别名对应 Buffname#buff_intro#all_officer_skill_damage_b_p / all_officer_skill_avoid_b_p 与 all_bullet_damage_b_p / all_bullet_avoid_b_p。
  // 伤害词根对应 blueprint_deepens / blueprint_resistance；芯片名对应 super_compute_deep_calculate_item。
  assert.equal(messages.en.skillAttribute, 'Officer Skill Boost/Resilience');
  assert.equal(messages.en.globalAttribute, 'Dmg Intensity/Resist');
  assert.equal(messages.en.normalAttribute, 'Normal Attack Boost/Resilience');
  assert.equal(messages.en.unit, 'Compute Chips');
  assert.equal(messages.en.title, 'Data Mining Calculator');
  assert.match(messages.en.all, /Compute Chips/);
  assert.match(messages.en.lock, /Compute Chips/);
  assert.match(messages.en.mode, /Data Mining/);
  assert.match(messages.en.nextRoll, /Data Mining/);
});

test('非中文可见流程使用游戏功能与道具术语', () => {
  const visibleKeys = ['title','intro','current','result','quality','delta','deltaLabel','mode','all','lock','apply','nextRoll','indifferent','stageStatus'];
  for (const { code } of languages.filter(({ code }) => !code.startsWith('zh-'))) {
    for (const key of visibleKeys) assert.ok(messages[code][key]?.trim(), `${code}.${key} 缺少可见文案`);
    for (const key of ['title','result','mode','all','lock','nextRoll']) {
      assert.doesNotMatch(messages[code][key], /refin(e|ement|ing)|raffin|洗練|세공|заточ/i, `${code}.${key} 仍使用非游戏功能名称`);
    }
    assert.match(messages[code].all, new RegExp(messages[code].unit.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), `${code}.all 未使用对应的芯片名称`);
    assert.match(messages[code].lock, new RegExp(messages[code].unit.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), `${code}.lock 未使用对应的芯片名称`);
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
  assert.equal(translate('en', 'attribute', { n: 2 }), 'Attribute 2');
  assert.throws(() => translate('en', 'notAKey'), /Missing translation: en\.notAKey/);
  assert.throws(() => translate('xx', 'title'), /Missing translation: xx\.title/);
});
