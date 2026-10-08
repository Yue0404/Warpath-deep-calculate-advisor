import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function listStates(cap) {
  const states = [];
  for (let a = 0; a <= cap; a += 1) {
    for (let b = a; b <= cap; b += 1) {
      for (let c = b; c <= cap; c += 1) states.push([a, b, c]);
    }
  }
  return states;
}

function toRows(group) {
  return Object.entries(group.qualities).map(([quality, row], index) => {
    if (Number(quality) !== index) throw new Error(`组 ${group.global_level_id} 的概率行索引错位`);
    const absolute = {};
    const deltas = { '-2': 0, '-1': 0, '0': 0, '1': 0, '2': 0 };
    for (const outcome of row.outcomes) {
      absolute[String(outcome.result_quality)] = outcome.weight;
      deltas[String(outcome.delta)] += outcome.weight;
    }
    return {
      quality_index: index,
      row_total_weight: row.weight_total,
      absolute_outcome_weights: absolute,
      delta_weights: deltas,
    };
  });
}

function calculateLockProof(states, rows, weightScale, valueOf, cap) {
  let minAdvantage = Infinity;
  let counterexample = null;
  for (const state of states) {
    if (state.every((quality) => quality === cap)) continue;
    const current = valueOf(state);
    for (let lockedIndex = 0; lockedIndex < 3; lockedIndex += 1) {
      const moving = [0, 1, 2].filter((index) => index !== lockedIndex);
      let expected = 0;
      for (const [a, wa] of Object.entries(rows[state[moving[0]]].absolute_outcome_weights)) {
        for (const [b, wb] of Object.entries(rows[state[moving[1]]].absolute_outcome_weights)) {
          const next = [...state];
          next[moving[0]] = Number(a);
          next[moving[1]] = Number(b);
          const nextValue = valueOf(next.sort((x, y) => x - y));
          expected += (wa * wb) / (weightScale ** 2) * Math.min(current, nextValue);
        }
      }
      const difference = 20 + expected - current;
      if (difference < minAdvantage) minAdvantage = difference;
      if (difference < -1e-8 && (!counterexample || difference < counterexample.difference)) {
        counterexample = { state, lockedIndex, difference };
      }
    }
  }
  return {
    valid: counterexample === null,
    minAdvantage,
    counterexample,
    method: '逐个非终止排序状态、逐个锁定位计算 Q_lock=20+E[min(V(s),V(t))]，与独立求得的无锁V(s)比较。',
  };
}

function createGroup(groupKey, rawGroup, table) {
  const cap = rawGroup.max_quality_in_table;
  if (rawGroup.global_level_id !== groupKey || rawGroup.quality_count !== cap + 1) {
    throw new Error(`组 ${groupKey} 的上限或行数不匹配`);
  }
  const rows = toRows(rawGroup);
  const states = listStates(cap);
  const values = new Map(states.map((state) => [state.join(','), 0]));
  const terminal = Array(3).fill(cap).join(',');
  let iterations = 0;
  let residual = Infinity;
  let worstState = null;
  while (iterations < 10000) {
    const nextValues = new Map();
    residual = 0;
    worstState = null;
    for (const state of states) {
      const key = state.join(',');
      if (key === terminal) {
        nextValues.set(key, 0);
        continue;
      }
      let expectedFuture = 0;
      for (const [a, wa] of Object.entries(rows[state[0]].absolute_outcome_weights)) {
        for (const [b, wb] of Object.entries(rows[state[1]].absolute_outcome_weights)) {
          for (const [c, wc] of Object.entries(rows[state[2]].absolute_outcome_weights)) {
            const next = [Number(a), Number(b), Number(c)].sort((x, y) => x - y).join(',');
            expectedFuture += (wa * wb * wc) / (table.weight_scale ** 3)
              * Math.min(values.get(key), values.get(next));
          }
        }
      }
      const computed = 5 + expectedFuture;
      nextValues.set(key, computed);
      const stateResidual = Math.abs(computed - values.get(key));
      if (stateResidual > residual) {
        residual = stateResidual;
        worstState = key;
      }
    }
    values.clear();
    for (const [key, value] of nextValues) values.set(key, value);
    iterations += 1;
    if (residual < 1e-10) break;
  }
  if (residual >= 1e-10) throw new Error(`组 ${groupKey} 的 value iteration 未收敛：${residual}`);

  let bellmanResidual = 0;
  let worstBellmanState = null;
  for (const state of states) {
    const key = state.join(',');
    if (key === terminal) continue;
    const currentValue = values.get(key);
    let expectedFuture = 0;
    for (const [a, wa] of Object.entries(rows[state[0]].absolute_outcome_weights)) {
      for (const [b, wb] of Object.entries(rows[state[1]].absolute_outcome_weights)) {
        for (const [c, wc] of Object.entries(rows[state[2]].absolute_outcome_weights)) {
          const next = [Number(a), Number(b), Number(c)].sort((x, y) => x - y).join(',');
          expectedFuture += (wa * wb * wc) / (table.weight_scale ** 3)
            * Math.min(currentValue, values.get(next));
        }
      }
    }
    const stateResidual = Math.abs(currentValue - (5 + expectedFuture));
    if (stateResidual > bellmanResidual) {
      bellmanResidual = stateResidual;
      worstBellmanState = key;
    }
  }

  const refStates = states.map((state) => [...state, values.get(state.join(','))]);
  const modelId = `three_equal_no_lock_group_accept_discard_to_${cap}_v1`;
  const sourceVersion = {
    game_version: null,
    package_version: null,
    runtime_update_version: null,
    group_key: groupKey,
    current_quality_cap: cap,
  };
  const model = {
    schema_version: 1,
    model_id: modelId,
    source_version: sourceVersion,
    mechanics_from_configuration: {
      ordinary_deep_calculation_chip_cost: 5,
      lock_one_attribute_chip_cost: 20,
    },
    objective: { target_state: [cap, cap, cap], minimize: 'expected_remaining_chips' },
    dynamic_program: {
      state_count: states.length,
      terminal_value_chips: 0,
      equation: 'V(s)=5+Σ P(t|s)·min(V(s),V(t))；三个结果独立抽取后排序。',
      solver: '离线同步 value iteration；每组概率与目标上限独立求解。',
      iterations,
      stopping_residual: residual,
      worst_bellman_residual: bellmanResidual,
      worst_bellman_state: worstBellmanState,
    },
  };
  const probabilities = {
    schema_version: 1,
    source: {
      game_version: null,
      package_version: null,
      runtime_update_version: null,
      group_key: groupKey,
      current_cap: cap,
    },
    weight_scale: table.weight_scale,
    rows,
  };
  const reference = {
    v: 1,
    model: modelId,
    group: groupKey,
    cap,
    stateCount: states.length,
    target: [cap, cap, cap],
    terminalValue: 0,
    states: refStates,
  };
  const valueOf = (state) => values.get(state.join(','));
  const lockProof = calculateLockProof(states, rows, table.weight_scale, valueOf, cap);
  return {
    model,
    probabilities,
    reference,
    diagnostics: {
      iterations,
      stoppingResidual: residual,
      bellmanResidual,
      worstBellmanState,
      stateCount: states.length,
    },
    lockProof,
  };
}

function sanitizeProfiles(profiles, groups) {
  const outputs = {};
  for (const [region, profile] of Object.entries(profiles.profiles)) {
    outputs[region] = {
      label: profile.label,
      openAt: profile.open_at,
      timezone: profile.timezone,
      version: {
        game: profile.version.game,
        package: profile.version.package,
        runtime: profile.version.runtime,
        runtimeStatus: profile.version.runtime_status,
      },
      intervalMs: profiles.formula.interval_seconds * 1000,
      initialGroup: profiles.formula.initial_level,
      initialCap: profiles.formula.initial_quality,
      groupStep: profiles.formula.level_step,
      capStep: profiles.formula.quality_step,
      supportedGroups: groups.map(Number).sort((a, b) => a - b),
    };
  }
  return outputs;
}

export function generateRuntimeModels({ stageProfiles, groupedProbabilities }) {
  if (stageProfiles.v !== 1 || groupedProbabilities.weight_scale !== 10000) {
    throw new Error('阶段配置或概率数据 schema 不支持');
  }
  const groups = {};
  for (const [key, rawGroup] of Object.entries(groupedProbabilities.groups_by_global_level_id)) {
    const groupKey = Number(key);
    groups[key] = createGroup(groupKey, rawGroup, groupedProbabilities);
  }
  const expectedGroupIds = [...stageProfiles.group_ids].sort((a, b) => a - b);
  const actualGroupIds = Object.keys(groups).map(Number).sort((a, b) => a - b);
  if (JSON.stringify(expectedGroupIds) !== JSON.stringify(actualGroupIds)) {
    throw new Error('阶段配置与概率数据的分组集合不匹配');
  }
  for (const [group, , cap, valid] of stageProfiles.group_checks) {
    if (valid !== true || groups[String(group)]?.reference.cap !== cap) {
      throw new Error(`阶段配置中的组 ${group} 上限与概率表不一致`);
    }
  }
  for (const [group, same] of Object.entries(stageProfiles.group_comparison.same_content_by_id)) {
    if (!groups[group] || same !== true) throw new Error(`组 ${group} 缺少跨服同ID一致性证据`);
  }
  return {
    schema_version: 1,
    built_at: new Date().toISOString(),
    probability_evidence: {
      source_region: groupedProbabilities.server_region,
      group_equality_evidence: stageProfiles.probability_data.group_equality_evidence,
      note: stageProfiles.probability_data.note,
    },
    stage_formula: {
      intervalMs: stageProfiles.formula.interval_seconds * 1000,
      initialGroup: stageProfiles.formula.initial_level,
      initialCap: stageProfiles.formula.initial_quality,
      groupStep: stageProfiles.formula.level_step,
      capStep: stageProfiles.formula.quality_step,
      initialGeneration: stageProfiles.formula.initial_generation,
    },
    profiles: sanitizeProfiles(stageProfiles, Object.keys(groups)),
    groups,
    diagnostics: Object.fromEntries(Object.entries(groups).map(([key, value]) => [key, value.diagnostics])),
    lockProofs: Object.fromEntries(Object.entries(groups).map(([key, value]) => [key, value.lockProof])),
  };
}

export async function readRuntimeInputs(baseDir = root) {
  const [stageText, probabilityText] = await Promise.all([
    readFile(path.join(baseDir, 'data', 'stage_profiles.json'), 'utf8'),
    readFile(path.join(baseDir, 'data', 'probabilities_by_group.json'), 'utf8'),
  ]);
  return {
    stageProfiles: JSON.parse(stageText),
    groupedProbabilities: JSON.parse(probabilityText),
    snapshot: { stageText, probabilityText },
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const inputs = await readRuntimeInputs();
  const models = generateRuntimeModels(inputs);
  console.log(`已计算 ${Object.keys(models.groups).length} 组独立模型；状态数、迭代次数及最大残差如下：`);
  for (const [group, diagnostics] of Object.entries(models.diagnostics)) {
    console.log(`组 ${group}：${diagnostics.stateCount} 状态，${diagnostics.iterations} 次迭代，Bellman最大残差 ${diagnostics.bellmanResidual}`);
  }
}
