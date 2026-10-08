import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { availableDeltas, deriveResult, parseQuality } from '../src/input.js';

test('品阶输入允许编辑空值，拒绝负数、小数、指数和粘贴的非整数文本', () => {
  assert.deepEqual(parseQuality('', 11), { valid: true, empty: true, value: null });
  for (const raw of ['-1', '1.5', '1e2', '2abc', ' 2', '2 ']) {
    assert.equal(parseQuality(raw, 11).valid, false, raw);
  }
});

test('品阶输入接受边界整数，拒绝超过上限的输入而不夹限', () => {
  assert.equal(parseQuality('0', 7).value, 0);
  assert.equal(parseQuality('7', 7).value, 7);
  assert.equal(parseQuality('8', 7).valid, false);
  assert.equal(parseQuality('999999999999999999999', 11).valid, false);
});

test('只提供能落在 0..上限内的变化量，并精确推导结果', () => {
  assert.deepEqual(availableDeltas(0, 7), [0, 1, 2]);
  assert.deepEqual(availableDeltas(1, 7), [-1, 0, 1, 2]);
  assert.deepEqual(availableDeltas(7, 7), [-2, -1, 0]);
  assert.deepEqual(deriveResult('6', '-2', 7), { valid: true, value: 4 });
  assert.equal(deriveResult('0', '-1', 7).valid, false);
  assert.equal(deriveResult('7', '1', 7).valid, false);
});

test('锁定项只能取变化量 0；重新计算始终使用当前输入', () => {
  assert.deepEqual(availableDeltas(3, 7, true), [0]);
  assert.deepEqual(deriveResult('3', '0', 7, true), { valid: true, value: 3 });
  assert.equal(deriveResult('3', '1', 7, true).valid, false);
  assert.deepEqual(deriveResult('4', '1', 7), { valid: true, value: 5 });
  assert.deepEqual(deriveResult('2', '1', 7), { valid: true, value: 3 });
});

test('实际组 40 概率行会隐藏零权重变化，锁定的 0 不受抽取概率影响', async () => {
  const probabilities = JSON.parse(await readFile(new URL('../data/probabilities.json', import.meta.url), 'utf8'));
  const cap = probabilities.source.current_cap;
  const zeroQuality = probabilities.rows.find(({ quality_index }) => quality_index === 0).delta_weights;
  const firstQuality = probabilities.rows.find(({ quality_index }) => quality_index === 1).delta_weights;

  assert.deepEqual(availableDeltas(0, cap, false, zeroQuality), [1]);
  assert.deepEqual(availableDeltas(1, cap, false, firstQuality), [0, 1, 2]);
  assert.equal(deriveResult('0', '0', cap, false, zeroQuality).valid, false);
  assert.deepEqual(deriveResult('0', '1', cap, false, zeroQuality), { valid: true, value: 1 });
  assert.deepEqual(availableDeltas(0, cap, true, zeroQuality), [0]);
  assert.deepEqual(deriveResult('0', '0', cap, true, zeroQuality), { valid: true, value: 0 });
  assert.equal(deriveResult('1', '-1', cap, false, firstQuality).valid, false);
});
