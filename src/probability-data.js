import { OUTCOME_DELTAS } from './calculator.js';

export function normalizeProbabilityData(probabilities) {
  const group = probabilities?.group;
  const cap = probabilities?.cap;
  const weightScale = probabilities?.weight_scale;
  const rows = probabilities?.rows;

  if (Object.hasOwn(probabilities ?? {}, 'source')
      || !Number.isInteger(group) || group < 0 || !Number.isInteger(cap) || cap < 0
      || !Number.isFinite(weightScale) || weightScale <= 0 || !Array.isArray(rows)
      || rows.length !== cap + 1) {
    throw new TypeError('公开概率模型元数据或行数无效');
  }

  const ordered = new Array(cap + 1);
  for (const row of rows) {
    const quality = row?.quality_index;
    if (!Number.isInteger(quality) || quality < 0 || quality > cap || ordered[quality]) {
      throw new TypeError('概率行的质量等级缺失、重复或越界');
    }
    const weights = row.delta_weights;
    if (!weights || OUTCOME_DELTAS.some((delta) => !Number.isFinite(weights[String(delta)])
        || weights[String(delta)] < 0)) {
      throw new TypeError(`质量 ${quality} 的概率权重无效`);
    }
    const total = OUTCOME_DELTAS.reduce((sum, delta) => sum + weights[String(delta)], 0);
    if (total !== weightScale) throw new TypeError(`质量 ${quality} 的概率权重总和无效`);
    ordered[quality] = {
      quality,
      weights: OUTCOME_DELTAS.map((delta) => weights[String(delta)]),
      percentages: OUTCOME_DELTAS.map((delta) => (weights[String(delta)] / weightScale) * 100),
    };
  }
  if (ordered.some((row) => !row)) throw new TypeError('概率模型缺少质量等级');

  return { group, cap, weightScale, rows: ordered };
}
