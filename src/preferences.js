/** 首次载入时记录浏览器识别出的界面语言，并与手动选择的语言分开保存。 */
export function resolveBrowserPreference({ browserLanguages, supportedLocales, detectLanguage, storage }) {
  const recorded = storage.get('warpath-browser-locale');
  if (supportedLocales.includes(recorded)) return recorded;

  const detected = detectLanguage(browserLanguages);
  const preference = supportedLocales.includes(detected) ? detected : 'en';
  storage.set('warpath-browser-locale', preference);
  return preference;
}

/** 按首次识别的浏览器语言决定服务器默认值；非简中访客固定使用国际服。 */
export function resolveInitialServer({ browserPreference, savedServer }) {
  if (browserPreference !== 'zh-CN') return 'international';
  return savedServer === 'cn' || savedServer === 'international' ? savedServer : 'cn';
}

/** 简中浏览器访客首次看到服务器说明，关闭状态保存在本机。 */
export function shouldShowServerWelcome({ browserPreference, storage }) {
  return browserPreference === 'zh-CN' && storage.get('warpath-server-welcome-dismissed') !== 'true';
}
