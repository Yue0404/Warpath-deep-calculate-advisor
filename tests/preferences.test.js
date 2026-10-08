import test from 'node:test';
import assert from 'node:assert/strict';
import {
  resolveBrowserPreference,
  resolveInitialServer,
  shouldShowServerWelcome,
} from '../src/preferences.js';

function makeStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    get(key) { return values.get(key) ?? null; },
    set(key, value) { values.set(key, value); },
  };
}

const supportedLocales = ['zh-CN', 'zh-TW', 'en', 'fr'];

test('首次识别并保存浏览器偏好，且后续手动语言变化不会覆盖它', () => {
  const storage = makeStorage({ 'warpath-language': 'zh-TW' });
  const detected = resolveBrowserPreference({
    browserLanguages: ['zh-Hans-CN', 'en-US'],
    supportedLocales,
    detectLanguage: () => 'zh-CN',
    storage,
  });

  assert.equal(detected, 'zh-CN');
  assert.equal(storage.get('warpath-browser-locale'), 'zh-CN');
  assert.equal(storage.get('warpath-language'), 'zh-TW');
  assert.equal(resolveBrowserPreference({
    browserLanguages: ['en-US'],
    supportedLocales,
    detectLanguage: () => 'en',
    storage,
  }), 'zh-CN');
});

test('非简体中文浏览器偏好不能通过已保存服务器选择进入国服', () => {
  assert.equal(resolveInitialServer({ browserPreference: 'en', savedServer: 'cn' }), 'international');
  assert.equal(resolveInitialServer({ browserPreference: 'zh-TW', savedServer: 'cn' }), 'international');
});

test('简体中文偏好默认国服并沿用有效的手动服务器选择', () => {
  assert.equal(resolveInitialServer({ browserPreference: 'zh-CN', savedServer: null }), 'cn');
  assert.equal(resolveInitialServer({ browserPreference: 'zh-CN', savedServer: 'international' }), 'international');
  assert.equal(resolveInitialServer({ browserPreference: 'zh-CN', savedServer: 'other' }), 'cn');
});

test('服务器说明只为简中偏好显示，且须由访客手动关闭', () => {
  const storage = makeStorage();
  assert.equal(shouldShowServerWelcome({ browserPreference: 'zh-CN', storage }), true);
  assert.equal(shouldShowServerWelcome({ browserPreference: 'zh-TW', storage }), false);
  storage.set('warpath-server-welcome-dismissed', 'true');
  assert.equal(shouldShowServerWelcome({ browserPreference: 'zh-CN', storage }), false);
});
