import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { createModelLoader, selectStage } from '../src/model-loader.js';
import { generateRuntimeModels, readRuntimeInputs } from '../scripts/generate-models.mjs';

const stageSource = JSON.parse(await readFile(new URL('../data/stage_profiles.json', import.meta.url), 'utf8'));
const runtimeModels = generateRuntimeModels(await readRuntimeInputs());

test('阶段边界夹具在开服与每次升档前后1毫秒均匹配', () => {
  for (const fixture of stageSource.boundary_test_fixtures) {
    const [region, , , , iso, status, promotions, generation, group, cap, candidateGroup] = fixture;
    const stage = selectStage(runtimeModels.profiles, region, iso);
    assert.equal(stage.status, status, `${region} ${iso}`);
    assert.equal(stage.promotionCount, promotions, `${region} ${iso} promotion`);
    assert.equal(stage.generation, generation, `${region} ${iso} generation`);
    assert.equal(stage.group, group ?? candidateGroup, `${region} ${iso} group`);
    assert.equal(stage.cap, cap, `${region} ${iso} cap`);
  }
});

test('两服按各自UTC刷新边界计算游戏内容日期和下一次日刷新', () => {
  const beforeUtcMidnight = selectStage(runtimeModels.profiles, 'international', '2026-08-08T23:59:59.999Z');
  const atUtcMidnight = selectStage(runtimeModels.profiles, 'international', '2026-08-09T00:00:00Z');
  assert.equal(beforeUtcMidnight.gameDate, '2026-08-08');
  assert.equal(beforeUtcMidnight.nextDailyRefreshAt, Date.parse('2026-08-09T00:00:00Z'));
  assert.equal(atUtcMidnight.gameDate, '2026-08-09');
  assert.equal(atUtcMidnight.nextDailyRefreshAt, Date.parse('2026-08-10T00:00:00Z'));

  const beforeCnRefresh = selectStage(runtimeModels.profiles, 'cn', '2026-08-08T15:59:59.999Z');
  const atCnRefresh = selectStage(runtimeModels.profiles, 'cn', '2026-08-08T16:00:00Z');
  assert.equal(beforeCnRefresh.gameDate, '2026-08-08');
  assert.equal(beforeCnRefresh.nextDailyRefreshAt, Date.parse('2026-08-08T16:00:00Z'));
  assert.equal(atCnRefresh.gameDate, '2026-08-09');
  assert.equal(atCnRefresh.nextDailyRefreshAt, Date.parse('2026-08-09T16:00:00Z'));

  const exampleCn = selectStage(runtimeModels.profiles, 'cn', '2026-08-08T20:00:00Z');
  const exampleInternational = selectStage(runtimeModels.profiles, 'international', '2026-08-08T20:00:00Z');
  assert.equal(exampleCn.gameDate, '2026-08-09');
  assert.equal(exampleCn.nextDailyRefreshAt, Date.parse('2026-08-09T16:00:00Z'));
  assert.equal(exampleInternational.gameDate, '2026-08-08');
  assert.equal(exampleInternational.nextDailyRefreshAt, Date.parse('2026-08-09T00:00:00Z'));
});

test('同一绝对时刻按所选服务器分别载入CN20/7与国际40/11', async () => {
  const now = Date.parse('2026-10-08T00:00:00Z');
  const loadModel = createModelLoader({ fetchImpl: async () => ({ ok: true, json: async () => runtimeModels }) });
  const [cn, international] = await Promise.all([
    loadModel('cn', now),
    loadModel('international', now),
  ]);
  assert.equal(cn.status, 'ready');
  assert.equal(cn.stage.group, 20);
  assert.equal(cn.stage.cap, 7);
  assert.equal(cn.calculator.cap, 7);
  assert.equal(international.status, 'ready');
  assert.equal(international.stage.group, 40);
  assert.equal(international.stage.cap, 11);
  assert.equal(international.calculator.cap, 11);
  assert.notEqual(cn.calculator.value([7, 7, 7]), international.calculator.value([7, 7, 7]));
});

test('开服前和未知未来组不返回计算器，且未知组不钳制到最后一组', async () => {
  const loadModel = createModelLoader({ fetchImpl: async () => ({ ok: true, json: async () => runtimeModels }) });
  const beforeOpen = await loadModel('cn', '2026-07-26T15:59:59.999Z');
  assert.equal(beforeOpen.status, 'not_open');
  assert.equal(beforeOpen.calculator, undefined);
  const unknownGroup = await loadModel('international', '2027-06-02T00:00:00Z');
  assert.equal(unknownGroup.status, 'unsupported');
  assert.equal(unknownGroup.stage.group, 60);
  assert.equal(unknownGroup.stage.cap, 15);
  assert.equal(unknownGroup.calculator, undefined);
});

test('loader只缓存有效模型文件，并拒绝非法区域和模型版本', async () => {
  let fetchCount = 0;
  const loadModel = createModelLoader({ fetchImpl: async () => {
    fetchCount += 1;
    return { ok: true, json: async () => runtimeModels };
  } });
  await loadModel('cn', '2026-10-08T00:00:00Z');
  await loadModel('international', '2026-10-08T00:00:00Z');
  assert.equal(fetchCount, 1);
  await assert.rejects(loadModel('global', Date.now()), /cn 或 international/);

  const invalidLoader = createModelLoader({ fetchImpl: async () => ({ ok: true, json: async () => ({ schema_version: 2 }) }) });
  await assert.rejects(invalidLoader('cn', Date.now()), /schema/);

  const staleProofModels = structuredClone(runtimeModels);
  staleProofModels.groups['20'].lockProof.minAdvantage += 1;
  const staleProofLoader = createModelLoader({ fetchImpl: async () => ({ ok: true, json: async () => staleProofModels }) });
  await assert.rejects(staleProofLoader('cn', '2026-10-08T00:00:00Z'), /锁定证明/);
});
