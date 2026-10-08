const TOLERANCE = 1e-8;
export const OUTCOME_DELTAS = Object.freeze([-2, -1, 0, 1, 2]);
export const CALCULATION_COSTS = Object.freeze({ ordinary: 5, locked: 20 });

function fail(message) {
  throw new TypeError(`计算器数据无效：${message}`);
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
  if (!model || !probabilities || !reference) fail('模型、概率或参考表缺失');
  const group = model.group;
  const cap = model.cap;
  const probabilityGroup = probabilities.group;
  const probabilityCap = probabilities.cap;
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
  if (probabilityGroup !== group || probabilityCap !== cap) {
    fail('概率数据的分组或品级上限与模型不匹配');
  }
  if (Object.hasOwn(model, 'source_version') || Object.hasOwn(model, 'mechanics_from_configuration')
      || Object.hasOwn(probabilities, 'source')) {
    fail('只支持公开模型格式');
  }
  if (reference.group !== group || reference.cap !== cap) {
    fail('参考值分组或品级上限与模型不匹配');
  }
  const mechanics = model.mechanics;
  if (mechanics?.ordinary_deep_calculation_chip_cost !== CALCULATION_COSTS.ordinary
      || mechanics?.lock_one_attribute_chip_cost !== CALCULATION_COSTS.locked) {
    fail('计算成本必须为 5 与 20');
  }
  if (!Number.isInteger(weightScale) || weightScale < 1 || !Array.isArray(rows)
      || rows.length !== cap + 1) {
    fail('概率上限、行数或权重刻度不正确');
  }
  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    if (!row || typeof row !== 'object'
        || row.quality_index !== index || row.row_total_weight !== weightScale) {
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
    const deltas = new Map(OUTCOME_DELTAS.map((delta) => [delta, 0]));
    for (const [outcome, weight] of entries) {
      const delta = Number(outcome) - index;
      if (!deltas.has(delta)) fail(`概率行 ${index} 的结果超出 -2 到 +2 品`);
      deltas.set(delta, deltas.get(delta) + weight);
    }
    for (const [delta, weight] of deltas) {
      if (row.delta_weights?.[String(delta)] !== weight) fail(`概率行 ${index} 的变化权重与绝对结果不一致`);
    }
  }
  const stateCount = ((cap + 1) * (cap + 2) * (cap + 3)) / 6;
  if (model.dynamic_program?.state_count !== stateCount
      || reference.stateCount !== stateCount || reference.states?.length !== stateCount) {
    fail(`模型状态数或状态表覆盖范围必须为 ${stateCount} 个排序状态`);
  }
  const target = Array(3).fill(cap);
  if (model.objective?.target_state?.join(',') !== target.join(',')
      || reference.target?.join(',') !== target.join(',') || reference.terminalValue !== 0
      || model.dynamic_program?.terminal_value_chips !== 0) fail('目标状态或终止值不匹配');
  return {
    group,
    cap,
    rows,
    weightScale,
    stateCount,
    ordinaryCost: mechanics.ordinary_deep_calculation_chip_cost,
    lockedCost: mechanics.lock_one_attribute_chip_cost,
  };
}

export function createCalculator(entry = {}) {
  const { model, probabilities, reference } = entry ?? {};
  const {
    cap, rows, weightScale, stateCount, ordinaryCost, lockedCost,
  } = validateData(model, probabilities, reference);
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
  if (values.size !== stateCount) {
    fail(`参考表必须覆盖全部 ${stateCount} 个排序状态`);
  }
  const targetKey = Array(3).fill(cap).join(',');
  if (values.get(targetKey) !== 0) fail('目标状态的参考值必须为 0');
  const probabilityOf = (from, to) => (rows[from].absolute_outcome_weights[String(to)] ?? 0) / weightScale;
  const referenceValue = (state) => values.get(sortedState(state, cap, '状态').join(','));

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
    ordinaryCost,
    lockedCost,
    model,
    probabilities,
    reference,
    value: referenceValue,
    evaluate,
  };
}
