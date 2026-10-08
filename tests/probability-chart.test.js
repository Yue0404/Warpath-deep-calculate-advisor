import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { normalizeProbabilityData } from '../src/probability-data.js';

const deltas = [-2, -1, 0, 1, 2];

function readJson(relativePath) {
  return JSON.parse(readFileSync(new URL(relativePath, import.meta.url), 'utf8'));
}

function loadGroup20() {
  const table = readJson('../data/probabilities_by_group.json');
  const group = table.groups_by_global_level_id['20'];
  return {
    weight_scale: table.weight_scale,
    source: { group_key: 20, current_cap: group.max_quality_in_table },
    rows: Object.values(group.qualities).map((quality) => ({
      quality_index: quality.quality,
      delta_weights: Object.fromEntries(deltas.map((delta) => [
        String(delta), quality.delta_columns_percent[String(delta)] * (table.weight_scale / 100),
      ])),
    })),
  };
}

const actualGroups = [
  { group: 20, expectedCap: 7, probabilities: loadGroup20() },
  { group: 40, expectedCap: 11, probabilities: readJson('../data/probabilities.json') },
];

for (const { group, expectedCap, probabilities } of actualGroups) {
  test(`真实组 ${group}（上限 ${expectedCap}）每行百分比总和为 100%`, () => {
    const normalized = normalizeProbabilityData(probabilities);
    assert.deepEqual([normalized.group, normalized.cap], [group, expectedCap]);
    assert.equal(normalized.rows.length, expectedCap + 1);
    for (const row of normalized.rows) {
      assert.ok(Math.abs(row.percentages.reduce((sum, value) => sum + value, 0) - 100) < 1e-9);
    }
  });
}

test('真实组 20 和 40 的首行、已知行与上限行概率一致', () => {
  const group20 = normalizeProbabilityData(actualGroups[0].probabilities);
  const group40 = normalizeProbabilityData(actualGroups[1].probabilities);

  assert.deepEqual(group20.rows[0].percentages, [0, 0, 0, 100, 0]);
  assert.deepEqual(group20.rows[1].percentages, [0, 0, 26, 64, 10]);
  assert.deepEqual(group20.rows[7].percentages, [15, 45, 40, 0, 0]);

  assert.deepEqual(group40.rows[0].percentages, [0, 0, 0, 100, 0]);
  assert.deepEqual(group40.rows[1].percentages, [0, 0, 13, 75, 12]);
  assert.deepEqual(group40.rows[11].percentages, [15, 45, 40, 0, 0]);
});

test('按 quality_index 排序而非数组位置，并拒绝重复与缺失等级', () => {
  const shuffled = { ...actualGroups[1].probabilities, rows: [...actualGroups[1].probabilities.rows].reverse() };
  const normalized = normalizeProbabilityData(shuffled);
  assert.deepEqual(normalized.rows.map(({ quality }) => quality), Array.from({ length: 12 }, (_, i) => i));
  assert.deepEqual(normalized.rows[1].percentages, [0, 0, 13, 75, 12]);

  const duplicate = { ...shuffled, rows: [...shuffled.rows] };
  duplicate.rows[0] = { ...duplicate.rows[0], quality_index: 1 };
  assert.throws(() => normalizeProbabilityData(duplicate), /重复或越界/);

  const missing = { ...shuffled, rows: [...shuffled.rows] };
  delete missing.rows[0];
  assert.throws(() => normalizeProbabilityData(missing), /质量等级缺失/);
});

test('切换真实组时使用各自的组号与上限元数据', () => {
  const group20 = normalizeProbabilityData(actualGroups[0].probabilities);
  const group40 = normalizeProbabilityData(actualGroups[1].probabilities);
  assert.deepEqual([group20.group, group20.cap, group20.rows.length], [20, 7, 8]);
  assert.deepEqual([group40.group, group40.cap, group40.rows.length], [40, 11, 12]);
});
