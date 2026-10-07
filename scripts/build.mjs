import { cp, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCalculator } from '../src/calculator.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const dataFiles = ['model.json', 'probabilities.json', 'decision_reference.json'];

async function loadSnapshot() {
  const entries = await Promise.all(dataFiles.map(async (name) => [
    name,
    await readFile(path.join(root, 'data', name)),
  ]));
  return new Map(entries);
}

function parseSnapshot(snapshot) {
  return Object.fromEntries([...snapshot].map(([name, contents]) => [
    name,
    JSON.parse(contents.toString('utf8')),
  ]));
}

const before = await loadSnapshot();
const data = parseSnapshot(before);
createCalculator({
  model: data['model.json'],
  probabilities: data['probabilities.json'],
  reference: data['decision_reference.json'],
});

const indexPath = path.join(root, 'index.html');
const stylesPath = path.join(root, 'styles.css');
const appPath = path.join(root, 'src', 'app.js');
const i18nPath = path.join(root, 'src', 'i18n.js');
await Promise.all([stat(indexPath), stat(stylesPath), stat(appPath), stat(i18nPath)]);
const { languages, messages, translate } = await import('../src/i18n.js');
const languageCodes = languages.map(({ code }) => code);
if (languages.length !== 18 || new Set(languageCodes).size !== languages.length) {
  throw new Error('语言字典必须提供 18 种不重复的语言');
}
const expectedKeys = Object.keys(messages['zh-CN'] ?? {}).sort();
for (const code of languageCodes) {
  const dictionary = messages[code];
  if (!dictionary || JSON.stringify(Object.keys(dictionary).sort()) !== JSON.stringify(expectedKeys)
      || Object.values(dictionary).some((value) => typeof value !== 'string')) {
    throw new Error(`语言字典 ${code} 缺失、键集合不完整或包含非文本值`);
  }
  for (const key of expectedKeys) translate(code, key);
}

// 再读一次数据，发现生成期间有更新就中止，避免把不同版本拼进 dist。
const after = await loadSnapshot();
for (const name of dataFiles) {
  if (!before.get(name).equals(after.get(name))) {
    throw new Error(`构建期间 data/${name} 已变化，请重试构建`);
  }
}

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await Promise.all([
  cp(indexPath, path.join(dist, 'index.html')),
  cp(stylesPath, path.join(dist, 'styles.css')),
  cp(path.join(root, 'src'), path.join(dist, 'src'), { recursive: true }),
  mkdir(path.join(dist, 'data'), { recursive: true }),
]);
await Promise.all(dataFiles.map((name) => writeFile(path.join(dist, 'data', name), before.get(name))));
console.log('已生成 dist：页面、样式、ES 模块及三份经过校验的运行时 JSON。');
