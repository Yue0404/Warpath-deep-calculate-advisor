const TOLERANCE = 1e-8;
const STATE_COUNT = 364;
const MODEL_ID = 'three_equal_no_lock_group_accept_discard_to_11_v1';

function fail(message) {
  throw new TypeError(`计算器数据无效：${message}`);
}

function sortedState(state, label) {
  if (!Array.isArray(state) || state.length !== 3) {
    throw new TypeError(`${label}必须是三个品阶组成的数组`);
  }
  for (const value of state) {
    if (!Number.isInteger(value) || value < 0 || value > 11) {
      throw new RangeError(`${label}中的品阶必须是 0 到 11 的整数`);
    }
  }
  return [...state].sort((a, b) => a - b);
}

function validateVersions(model, probabilities, reference) {
  const modelVersion = model?.source_version;
  const probabilitySource = probabilities?.source;
  if (model?.model_id !== MODEL_ID || reference?.model !== MODEL_ID) {
    fail('模型 ID 不匹配');
  }
  if (model.schema_version !== 1 || probabilities.schema_version !== 1 || reference.v !== 1) {
    fail('模型、概率或参考表 schema 版本不匹配');
  }
  for (const key of ['game_version', 'package_version', 'runtime_update_version', 'group_key', 'current_quality_cap']) {
    const probabilityKey = key === 'current_quality_cap' ? 'current_cap' : key;
    if (modelVersion?.[key] !== probabilitySource?.[probabilityKey]) {
      fail(`模型与概率数据的版本字段 ${key} 不匹配`);
    }
  }
  if (modelVersion.group_key !== 40 || modelVersion.current_quality_cap !== 11) {
    fail('需要使用分组 40 与 11 品上限');
  }
  if (model.mechanics_from_configuration?.ordinary_deep_calculation_chip_cost !== 5
      || model.mechanics_from_configuration?.lock_one_attribute_chip_cost !== 20) {
    fail('计算成本必须为 5 与 20');
  }
  if (probabilities.source.current_cap !== 11
      || probabilities.rows?.length !== 12 || probabilities.weight_scale !== 10000) {
    fail('概率数据的上限、行数或权重刻度不正确');
  }
  if (model.dynamic_program?.state_count !== STATE_COUNT
      || reference.stateCount !== STATE_COUNT || reference.exchangeCount !== 1081
      || reference.exchanges?.length !== 1081) {
    fail('模型状态数或参考交换记录数不正确');
  }
  if (model.objective?.target_state?.join(',') !== '11,11,11'
      || reference.target?.join(',') !== '11,11,11' || reference.terminalValue !== 0
      || model.dynamic_program?.terminal_value_chips !== 0) {
    fail('目标状态或终止值不匹配');
  }
}

export function createCalculator({ model, probabilities, reference }) {
  validateVersions(model, probabilities, reference);
  const weightScale = probabilities.weight_scale;
  const rows = probabilities.rows;
  rows.forEach((row, index) => {
    if (row.quality_index !== index || row.row_total_weight !== weightScale) {
      fail(`概率行 ${index} 未按索引排序或权重总和不正确`);
    }
    const entries = Object.entries(row.absolute_outcome_weights ?? {});
    const total = entries.reduce((sum, [outcome, weight]) => {
      if (!Number.isInteger(Number(outcome)) || Number(outcome) < 0 || Number(outcome) > 11
          || !Number.isInteger(weight) || weight < 0) fail(`概率行 ${index} 包含非法结果`);
      return sum + weight;
    }, 0);
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

  const values = new Map();
  for (const state of reference.states ?? []) {
    if (!Array.isArray(state) || state.length !== 4) fail('参考状态格式错误');
    const key = state.slice(0, 3).join(',');
    const normalized = sortedState(state.slice(0, 3), '参考状态');
    if (normalized.join(',') !== key || !Number.isFinite(state[3]) || state[3] < 0 || values.has(key)) {
      fail('参考状态必须唯一且按非降序排列');
    }
    values.set(key, state[3]);
  }
  const states = [];
  for (let a = 0; a <= 11; a += 1) {
    for (let b = a; b <= 11; b += 1) {
      for (let c = b; c <= 11; c += 1) states.push([a, b, c]);
    }
  }
  if (states.length !== STATE_COUNT || values.size !== STATE_COUNT
      || states.some((state) => !values.has(state.join(',')))) {
    fail('参考表必须覆盖全部 364 个排序状态');
  }
  if (values.get('11,11,11') !== 0) fail('目标状态的参考值必须为 0');

  const probabilityOf = (from, to) => {
    const weight = rows[from].absolute_outcome_weights[String(to)] ?? 0;
    return weight / weightScale;
  };
  const referenceValue = (state) => values.get(sortedState(state, '状态').join(','));

  // 用当前概率表独立重算 Bellman 右侧，防止同版本概率更新后误用旧参考值。
  for (const state of states) {
    const stateKey = state.join(',');
    const currentValue = values.get(stateKey);
    if (stateKey === '11,11,11') continue;
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
    if (residual >= 1e-7) fail(`参考值与当前概率表不一致，状态 ${stateKey} 的 Bellman 残差为 ${residual}`);
  }

  function value(state) {
    return referenceValue(state);
  }

  function evaluate(current, next, lockedIndex = null) {
    const currentSorted = sortedState(current, '当前状态');
    const nextSorted = sortedState(next, '新状态');
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
    cap: 11,
    ordinaryCost: 5,
    lockedCost: 20,
    model,
    probabilities,
    value,
    evaluate,
  };
}

export function bellmanResidual(calculator, state) {
  const currentValue = calculator.value(state);
  if (state.every((quality) => quality === 11)) return currentValue;
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
