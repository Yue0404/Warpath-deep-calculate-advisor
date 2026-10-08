const TOLERANCE = 1e-8;

function fail(message) {
  throw new TypeError(`计算器数据无效：${message}`);
}

function combinations(cap) {
  const states = [];
  for (let a = 0; a <= cap; a += 1) {
    for (let b = a; b <= cap; b += 1) {
      for (let c = b; c <= cap; c += 1) states.push([a, b, c]);
    }
  }
  return states;
}

function expectedStateCount(cap) {
  return ((cap + 1) * (cap + 2) * (cap + 3)) / 6;
}

function sortedState(state, cap, label) {
  if (!Array.isArray(state) || state.length !== 3) {
    throw new TypeError(`${label}必须是三个品阶组成的数组`);
  }
  for (const value of state) {
    if (!Number.isInteger(value) || value < 0 || value > cap) {
      throw new RangeError(`${label}中的品阶必须是 0 到 ${cap} 的整数`);
    }
  }
  return [...state].sort((a, b) => a - b);
}

function validateData(model, probabilities, reference) {
  const group = model?.source_version?.group_key;
  const cap = model?.source_version?.current_quality_cap;
  const rows = probabilities?.rows;
  const weightScale = probabilities?.weight_scale;
  if (!Number.isInteger(group) || group < 0 || !Number.isInteger(cap) || cap < 1) {
    fail('模型分组或品级上限无效');
  }
  if (model?.model_id !== `three_equal_no_lock_group_accept_discard_to_${cap}_v1`
      || reference?.model !== model.model_id) fail('模型 ID 不匹配');
  if (model.schema_version !== 1 || probabilities.schema_version !== 1 || reference.v !== 1) {
    fail('模型、概率或参考表 schema 版本不匹配');
  }
  for (const key of ['game_version', 'package_version', 'runtime_update_version', 'group_key', 'current_quality_cap']) {
    const probabilityKey = key === 'current_quality_cap' ? 'current_cap' : key;
    if (model.source_version?.[key] !== probabilities.source?.[probabilityKey]) {
      fail(`模型与概率数据的版本字段 ${key} 不匹配`);
    }
  }
  if (probabilities.source?.group_key !== group || probabilities.source?.current_cap !== cap) {
    fail('概率数据的分组或品级上限与模型不匹配');
  }
  if ((reference.group !== undefined && reference.group !== group)
      || (reference.cap !== undefined && reference.cap !== cap)) {
    fail('参考值分组或品级上限与模型不匹配');
  }
  if (model.mechanics_from_configuration?.ordinary_deep_calculation_chip_cost !== 5
      || model.mechanics_from_configuration?.lock_one_attribute_chip_cost !== 20) {
    fail('计算成本必须为 5 与 20');
  }
  if (!Number.isInteger(weightScale) || weightScale < 1 || rows?.length !== cap + 1) {
    fail('概率上限、行数或权重刻度不正确');
  }
  rows.forEach((row, index) => {
    if (row.quality_index !== index || row.row_total_weight !== weightScale) {
      fail(`概率行 ${index} 未按索引排序或权重总和不正确`);
    }
    const entries = Object.entries(row.absolute_outcome_weights ?? {});
    let total = 0;
    for (const [outcome, weight] of entries) {
      if (!/^\d+$/.test(outcome) || Number(outcome) < 0 || Number(outcome) > cap
          || !Number.isInteger(weight) || weight <= 0) fail(`概率行 ${index} 包含非法结果`);
      total += weight;
    }
    if (total !== weightScale) fail(`概率行 ${index} 权重不等于 ${weightScale}`);
    const deltas = new Map([[-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0]]);
    for (const [outcome, weight] of entries) {
      const delta = Number(outcome) - index;
      if (!deltas.has(delta)) fail(`概率行 ${index} 的结果超出 -2 到 +2 品`);
      deltas.set(delta, deltas.get(delta) + weight);
    }
    for (const [delta, weight] of deltas) {
      if (row.delta_weights?.[String(delta)] !== weight) fail(`概率行 ${index} 的变化权重与绝对结果不一致`);
    }
  });
  const stateCount = expectedStateCount(cap);
  if (model.dynamic_program?.state_count !== stateCount
      || reference.stateCount !== stateCount || reference.states?.length !== stateCount) {
    fail(`模型状态数或状态表覆盖范围必须为 ${stateCount} 个排序状态`);
  }
  const target = Array(3).fill(cap);
  if (model.objective?.target_state?.join(',') !== target.join(',')
      || reference.target?.join(',') !== target.join(',') || reference.terminalValue !== 0
      || model.dynamic_program?.terminal_value_chips !== 0) fail('目标状态或终止值不匹配');
  return { group, cap, rows, weightScale, states: combinations(cap), stateCount };
}

export function createCalculator({ model, probabilities, reference }) {
  const { cap, rows, weightScale, states, stateCount } = validateData(model, probabilities, reference);
  const values = new Map();
  for (const state of reference.states) {
    if (!Array.isArray(state) || state.length !== 4) fail('参考状态格式错误');
    const key = state.slice(0, 3).join(',');
    const normalized = sortedState(state.slice(0, 3), cap, '参考状态');
    if (normalized.join(',') !== key || !Number.isFinite(state[3]) || state[3] < 0 || values.has(key)) {
      fail('参考状态必须唯一、非负且按非降序排列');
    }
    values.set(key, state[3]);
  }
  if (values.size !== stateCount || states.some((state) => !values.has(state.join(',')))) {
    fail(`参考表必须覆盖全部 ${stateCount} 个排序状态`);
  }
  const targetKey = Array(3).fill(cap).join(',');
  if (values.get(targetKey) !== 0) fail('目标状态的参考值必须为 0');
  const probabilityOf = (from, to) => (rows[from].absolute_outcome_weights[String(to)] ?? 0) / weightScale;
  const referenceValue = (state) => values.get(sortedState(state, cap, '状态').join(','));

  let worstResidual = 0;
  let worstState = null;
  for (const state of states) {
    const stateKey = state.join(',');
    const currentValue = values.get(stateKey);
    if (stateKey === targetKey) continue;
    let expectedFuture = 0;
    for (const [a, weightA] of Object.entries(rows[state[0]].absolute_outcome_weights)) {
      for (const [b, weightB] of Object.entries(rows[state[1]].absolute_outcome_weights)) {
        for (const [c, weightC] of Object.entries(rows[state[2]].absolute_outcome_weights)) {
          const nextKey = [Number(a), Number(b), Number(c)].sort((x, y) => x - y).join(',');
          expectedFuture += (weightA * weightB * weightC) / (weightScale ** 3)
            * Math.min(currentValue, values.get(nextKey));
        }
      }
    }
    const residual = Math.abs(currentValue - (5 + expectedFuture));
    if (residual > worstResidual) {
      worstResidual = residual;
      worstState = stateKey;
    }
  }
  if (worstResidual >= 1e-7) fail(`参考值与当前概率表不一致，状态 ${worstState} 的 Bellman 残差为 ${worstResidual}`);

  let minLockAdvantage = Infinity;
  let lockCounterexample = null;
  for (const state of states) {
    if (state.join(',') === targetKey) continue;
    const currentValue = values.get(state.join(','));
    for (let lockedIndex = 0; lockedIndex < 3; lockedIndex += 1) {
      const moving = [0, 1, 2].filter((index) => index !== lockedIndex);
      let expected = 0;
      for (const [a, weightA] of Object.entries(rows[state[moving[0]]].absolute_outcome_weights)) {
        for (const [b, weightB] of Object.entries(rows[state[moving[1]]].absolute_outcome_weights)) {
          const next = [...state];
          next[moving[0]] = Number(a);
          next[moving[1]] = Number(b);
          const nextValue = values.get(next.sort((x, y) => x - y).join(','));
          expected += (weightA * weightB) / (weightScale ** 2)
            * Math.min(currentValue, nextValue);
        }
      }
      const advantage = 20 + expected - currentValue;
      if (advantage < minLockAdvantage) minLockAdvantage = advantage;
      if (advantage < -1e-8 && (!lockCounterexample || advantage < lockCounterexample.difference)) {
        lockCounterexample = { state, lockedIndex, difference: advantage };
      }
    }
  }
  const lockProof = {
    valid: lockCounterexample === null,
    minAdvantage: minLockAdvantage,
    counterexample: lockCounterexample,
    method: '逐个非终止排序状态、逐个锁定位计算 Q_lock=20+E[min(V(s),V(t))]，与独立求得的无锁V(s)比较。',
  };

  function evaluate(current, next, lockedIndex = null) {
    const currentSorted = sortedState(current, cap, '当前状态');
    const nextSorted = sortedState(next, cap, '新状态');
    if (lockedIndex !== null && (!Number.isInteger(lockedIndex) || lockedIndex < 0 || lockedIndex > 2)) {
      throw new RangeError('lockedIndex 必须为 null 或 0 到 2 的整数');
    }
    if (lockedIndex !== null && current[lockedIndex] !== next[lockedIndex]) {
      throw new RangeError('锁定位置的品阶必须保持不变');
    }
    const currentValue = referenceValue(currentSorted);
    const nextValue = referenceValue(nextSorted);
    const savings = currentValue - nextValue;
    const supported = current.every((quality, index) => lockedIndex === index
      || probabilityOf(quality, next[index]) > 0);
    const choice = Math.abs(savings) <= TOLERANCE
      ? 'indifferent'
      : savings > 0 ? 'accept' : 'discard';
    return { choice, currentValue, nextValue, savings, supported, lockedIndex };
  }

  return {
    cap,
    stateCount,
    ordinaryCost: 5,
    lockedCost: 20,
    model,
    probabilities,
    reference,
    value: referenceValue,
    evaluate,
    worstBellmanResidual: worstResidual,
    worstResidualState: worstState,
    lockProof,
  };
}

export function bellmanResidual(calculator, state) {
  const currentValue = calculator.value(state);
  if (state.every((quality) => quality === calculator.cap)) return currentValue;
  let expected = 0;
  const rows = calculator.probabilities.rows;
  const scale = calculator.probabilities.weight_scale;
  for (const [a, wa] of Object.entries(rows[state[0]].absolute_outcome_weights)) {
    for (const [b, wb] of Object.entries(rows[state[1]].absolute_outcome_weights)) {
      for (const [c, wc] of Object.entries(rows[state[2]].absolute_outcome_weights)) {
        const next = [Number(a), Number(b), Number(c)].sort((x, y) => x - y);
        expected += (wa * wb * wc) / (scale ** 3) * Math.min(currentValue, calculator.value(next));
      }
    }
  }
  return currentValue - (calculator.ordinaryCost + expected);
}

export function possibleOutcomes(probabilities, quality) {
  return Object.keys(probabilities.rows[quality].absolute_outcome_weights).map(Number);
}
