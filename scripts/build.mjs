import { cp, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCalculator } from '../src/calculator.js';
import { generateRuntimeModels, readRuntimeInputs } from './generate-models.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const flags = path.join(root, 'flags');
const flagLicense = path.join(flags, 'LICENSE');
const chartPackage = path.join(root, 'node_modules', 'chart.js');
const chartColorPackage = path.join(root, 'node_modules', '@kurkle', 'color');
const dataFiles = ['model.json', 'probabilities.json', 'decision_reference.json'];
const stageFile = 'stage_profiles.json';
const groupedProbabilitiesFile = 'probabilities_by_group.json';

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
const runtimeInputs = await readRuntimeInputs(root);
const runtimeModels = generateRuntimeModels(runtimeInputs);
for (const [group, entry] of Object.entries(runtimeModels.groups)) {
  const calculator = createCalculator(entry);
  if (calculator.cap !== entry.reference.cap || calculator.stateCount !== entry.reference.stateCount) {
    throw new Error(`组 ${group} 的生成模型元数据不一致`);
  }
  if (calculator.lockProof.valid !== entry.lockProof.valid
      || Math.abs(calculator.lockProof.minAdvantage - entry.lockProof.minAdvantage) > 1e-7) {
    throw new Error(`组 ${group} 的锁定证明与当前模型不一致`);
  }
}

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
const flagFiles = [...new Set(languages.map(({ flag }) => {
  if (typeof flag !== 'string' || !/^[a-z]{2}$/i.test(flag)) {
    throw new Error('每种语言都必须提供 ISO alpha-2 国旗代码');
  }
  return `${flag.toLowerCase()}.svg`;
}))];
await Promise.all(flagFiles.map((name) => stat(path.join(flags, name))));
await stat(flagLicense);
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
const runtimeInputsAfter = await readRuntimeInputs(root);
if (runtimeInputs.snapshot.stageText !== runtimeInputsAfter.snapshot.stageText
    || runtimeInputs.snapshot.probabilityText !== runtimeInputsAfter.snapshot.probabilityText) {
  throw new Error(`构建期间 data/${stageFile} 或 data/${groupedProbabilitiesFile} 已变化，请重试构建`);
}

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await Promise.all([
  cp(indexPath, path.join(dist, 'index.html')),
  cp(stylesPath, path.join(dist, 'styles.css')),
  cp(path.join(root, 'src'), path.join(dist, 'src'), { recursive: true }),
  mkdir(path.join(dist, 'flags'), { recursive: true }),
  mkdir(path.join(dist, 'data'), { recursive: true }),
  mkdir(path.join(dist, 'vendor'), { recursive: true }),
]);
await Promise.all(dataFiles.map((name) => writeFile(path.join(dist, 'data', name), before.get(name))));
await writeFile(path.join(dist, 'data', 'runtime_models.json'), `${JSON.stringify(runtimeModels)}\n`);
await Promise.all(flagFiles.map((name) => cp(path.join(flags, name), path.join(dist, 'flags', name))));
await cp(flagLicense, path.join(dist, 'flags', 'LICENSE'));
await Promise.all([
  cp(path.join(chartPackage, 'dist', 'chart.umd.js'), path.join(dist, 'vendor', 'chart.umd.js')),
  cp(path.join(chartPackage, 'LICENSE.md'), path.join(dist, 'vendor', 'chartjs-LICENSE.md')),
  cp(path.join(chartColorPackage, 'LICENSE.md'), path.join(dist, 'vendor', 'kurkle-color-LICENSE.md')),
]);
console.log('已生成 dist：页面、样式、ES 模块、既有数据、五组运行时模型及本地 Chart.js。');
