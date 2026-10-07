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
