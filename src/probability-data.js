const DELTAS = [-2, -1, 0, 1, 2];

/** 将已校验的概率模型整理为质量等级有序的百分比数据。 */
export function normalizeProbabilityData(probabilities) {
  const source = probabilities?.source;
  const cap = source?.current_cap;
  const group = source?.group_key;
  const weightScale = probabilities?.weight_scale;
  const rows = probabilities?.rows;

  if (!Number.isInteger(group) || group < 0 || !Number.isInteger(cap) || cap < 0
      || !Number.isFinite(weightScale) || weightScale <= 0 || !Array.isArray(rows)
      || rows.length !== cap + 1) {
    throw new TypeError('概率模型元数据或行数无效');
  }

  const ordered = new Array(cap + 1);
  for (const row of rows) {
    const quality = row?.quality_index;
    if (!Number.isInteger(quality) || quality < 0 || quality > cap || ordered[quality]) {
      throw new TypeError('概率行的质量等级缺失、重复或越界');
    }
    const weights = row.delta_weights;
    if (!weights || DELTAS.some((delta) => !Number.isFinite(weights[String(delta)])
        || weights[String(delta)] < 0)) {
      throw new TypeError(`质量 ${quality} 的概率权重无效`);
    }
    const total = DELTAS.reduce((sum, delta) => sum + weights[String(delta)], 0);
    if (total !== weightScale) throw new TypeError(`质量 ${quality} 的概率权重总和无效`);
    ordered[quality] = {
      quality,
      weights: DELTAS.map((delta) => weights[String(delta)]),
      percentages: DELTAS.map((delta) => (weights[String(delta)] / weightScale) * 100),
    };
  }
  if (ordered.some((row) => !row)) throw new TypeError('概率模型缺少质量等级');

  return { group, cap, weightScale, rows: ordered };
}
