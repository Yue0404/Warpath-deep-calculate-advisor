import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { createCalculator } from '../src/calculator.js';

const readJson = async (name) => JSON.parse(await readFile(new URL(`../data/${name}`, import.meta.url), 'utf8'));
const [model, probabilities, reference] = await Promise.all([
  readJson('model.json'),
  readJson('probabilities.json'),
  readJson('decision_reference.json'),
]);
const calculator = createCalculator({ model, probabilities, reference });

test('参考值覆盖全部排序状态且满足 Bellman 方程', () => {
  assert.equal(reference.states.length, 364);
  let worstResidual = 0;
  for (const [a, b, c, value] of reference.states) {
    if (a === 11 && b === 11 && c === 11) {
      assert.equal(value, 0);
      continue;
    }
    let expected = 0;
    const rows = [a, b, c].map((quality) => probabilities.rows[quality].absolute_outcome_weights);
    for (const [qa, wa] of Object.entries(rows[0])) {
      for (const [qb, wb] of Object.entries(rows[1])) {
        for (const [qc, wc] of Object.entries(rows[2])) {
          const next = [Number(qa), Number(qb), Number(qc)].sort((x, y) => x - y);
          const nextValue = calculator.value(next);
          expected += wa * wb * wc / (probabilities.weight_scale ** 3) * Math.min(value, nextValue);
        }
      }
    }
    worstResidual = Math.max(worstResidual, Math.abs(value - (5 + expected)));
  }
  assert.ok(worstResidual < 1e-8, `最大 Bellman 残差 ${worstResidual}`);
});

test('全部 1081 条交换建议与逐条比较一致', () => {
  assert.equal(reference.exchanges.length, 1081);
  for (const [fromIndex, toIndex, expectedChoice] of reference.exchanges) {
    const from = reference.states[fromIndex].slice(0, 3);
    const to = reference.states[toIndex].slice(0, 3);
    assert.equal(calculator.evaluate(from, to).choice, expectedChoice, `${from} -> ${to}`);
  }
});

test('品阶排列不改变价值或选择', () => {
  const current = [4, 7, 9];
  const next = [5, 8, 9];
  const expected = calculator.evaluate(current, next);
  assert.equal(calculator.value([9, 4, 7]), calculator.value(current));
  assert.deepEqual(calculator.evaluate([9, 7, 4], [9, 8, 5]), expected);
});

test('锁定位置保持不变，且锁后无支持概率时仍可比较参考值', () => {
  assert.equal(calculator.evaluate([6, 8, 9], [6, 8, 10], 0).supported, true);
  assert.throws(() => calculator.evaluate([6, 8, 9], [7, 8, 10], 0), /锁定位置/);
  const unsupported = calculator.evaluate([8, 9, 10], [11, 9, 10]);
  assert.equal(unsupported.supported, false);
  assert.ok(Number.isFinite(unsupported.currentValue));
  assert.ok(Number.isFinite(unsupported.nextValue));
});

test('输入严格限制为三个 0 到 11 的整数', () => {
  for (const bad of [[0, 1], [0, 1, 2, 3], [-1, 2, 3], [0, 12, 3], [0, 1.5, 2], [0, '1', 2]]) {
    assert.throws(() => calculator.value(bad));
  }
  for (const lockedIndex of [-1, 3, 1.5, '1']) assert.throws(() => calculator.evaluate([1, 2, 3], [1, 2, 3], lockedIndex));
});

test('返回目标与固定配置成本', () => {
  assert.equal(calculator.cap, 11);
  assert.equal(calculator.ordinaryCost, 5);
  assert.equal(calculator.lockedCost, 20);
  assert.equal(calculator.value([11, 11, 11]), 0);
  assert.equal(calculator.evaluate([0, 0, 0], [0, 0, 0]).lockedIndex, null);
});

test('拒绝版本、模型 ID、概率权重和状态覆盖不一致的数据', () => {
  assert.throws(() => createCalculator({ model: { ...model, model_id: 'other' }, probabilities, reference }), /模型 ID/);
  assert.throws(() => createCalculator({ model, probabilities: { ...probabilities, source: { ...probabilities.source, group_key: 50 } }, reference }), /不匹配/);
  const badWeights = structuredClone(probabilities);
  badWeights.rows[0].absolute_outcome_weights['1'] -= 1;
  assert.throws(() => createCalculator({ model, probabilities: badWeights, reference }), /权重/);
  const missingState = structuredClone(reference);
  missingState.states.pop();
  assert.throws(() => createCalculator({ model, probabilities, reference: missingState }), /364/);
});

test('拒绝同版本但已变化的概率表、错误 schema 与非法参考值', () => {
  const changedProbabilities = structuredClone(probabilities);
  changedProbabilities.rows[5].absolute_outcome_weights['4'] += 100;
  changedProbabilities.rows[5].absolute_outcome_weights['6'] -= 100;
  changedProbabilities.rows[5].delta_weights['-1'] += 100;
  changedProbabilities.rows[5].delta_weights['1'] -= 100;
  assert.equal(Object.values(changedProbabilities.rows[5].absolute_outcome_weights).reduce((a, b) => a + b, 0), 10000);
  assert.throws(() => createCalculator({ model, probabilities: changedProbabilities, reference }), /Bellman 残差/);

  const wrongSchema = structuredClone(reference);
  wrongSchema.v = 2;
  assert.throws(() => createCalculator({ model, probabilities, reference: wrongSchema }), /schema/);
  const wrongStateCount = structuredClone(reference);
  wrongStateCount.stateCount = 363;
  assert.throws(() => createCalculator({ model, probabilities, reference: wrongStateCount }), /状态数/);

  const negativeValue = structuredClone(reference);
  negativeValue.states[0][3] = -1;
  assert.throws(() => createCalculator({ model, probabilities, reference: negativeValue }), /非降序/);
  const wrongTerminalValue = structuredClone(reference);
  wrongTerminalValue.states.find((state) => state[0] === 11 && state[1] === 11 && state[2] === 11)[3] = 1;
  assert.throws(() => createCalculator({ model, probabilities, reference: wrongTerminalValue }), /目标状态/);
  const wrongTerminalMetadata = structuredClone(reference);
  wrongTerminalMetadata.terminalValue = 1;
  assert.throws(() => createCalculator({ model, probabilities, reference: wrongTerminalMetadata }), /终止值/);
});

test('无锁筛选成本低于锁成本，且相邻结果分布一阶随机占优', () => {
  const nonDowngrade = probabilities.rows.map((row) => Object.entries(row.absolute_outcome_weights)
    .reduce((sum, [quality, weight]) => sum + (Number(quality) >= row.quality_index ? weight : 0), 0) / probabilities.weight_scale);
  const worstFilterCost = Math.max(...nonDowngrade.map((chance) => 5 / chance));
  assert.ok(worstFilterCost < calculator.lockedCost);
  for (let quality = 0; quality < 11; quality += 1) {
    const lower = probabilities.rows[quality].absolute_outcome_weights;
    const higher = probabilities.rows[quality + 1].absolute_outcome_weights;
    for (let cutoff = 0; cutoff <= 11; cutoff += 1) {
      const lowerCdf = Object.entries(lower).reduce((sum, [outcome, weight]) => sum + (Number(outcome) <= cutoff ? weight : 0), 0);
      const higherCdf = Object.entries(higher).reduce((sum, [outcome, weight]) => sum + (Number(outcome) <= cutoff ? weight : 0), 0);
      assert.ok(higherCdf <= lowerCdf, `${quality} -> ${quality + 1} 在 cutoff ${cutoff} 不满足 FOSD`);
    }
  }
});
