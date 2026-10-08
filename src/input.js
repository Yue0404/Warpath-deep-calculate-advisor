/** 校验用户输入的品阶；空值单独保留，便于编辑但不可提交。 */
export function parseQuality(raw, cap) {
  const value = String(raw);
  if (value === '') return { valid: true, empty: true, value: null };
  if (!/^\d+$/.test(value)) return { valid: false, empty: false, value: null };
  const quality = Number(value);
  if (!Number.isSafeInteger(quality) || quality < 0 || quality > cap) {
    return { valid: false, empty: false, value: null };
  }
  return { valid: true, empty: false, value: quality };
}

/** 返回处于品阶范围内且概率权重大于零的变化量。 */
export function availableDeltas(current, cap, locked = false, deltaWeights = null) {
  if (locked) return [0];
  return [-2, -1, 0, 1, 2].filter((delta) => current + delta >= 0 && current + delta <= cap
    && (deltaWeights === null || deltaWeights === undefined || deltaWeights[String(delta)] > 0));
}

/** 从当前品阶和变化量推导结果，拒绝越界、零概率及锁定项变化。 */
export function deriveResult(rawCurrent, rawDelta, cap, locked = false, deltaWeights = null) {
  const parsed = parseQuality(rawCurrent, cap);
  if (!parsed.valid || parsed.empty) return { valid: false, value: null };
  if (!['-2', '-1', '0', '1', '2'].includes(String(rawDelta))) return { valid: false, value: null };
  const delta = Number(rawDelta);
  if ((locked && delta !== 0) || !availableDeltas(parsed.value, cap, locked, deltaWeights).includes(delta)) {
    return { valid: false, value: null };
  }
  return { valid: true, value: parsed.value + delta };
}
