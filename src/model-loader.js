import { createCalculator } from './calculator.js';

function epochMilliseconds(value) {
  const timestamp = value instanceof Date ? value.getTime()
    : typeof value === 'number' ? value : Date.parse(value);
  if (!Number.isFinite(timestamp)) throw new TypeError('当前时间必须是有效的时间戳或 ISO-8601 时刻');
  return timestamp;
}

export function selectStage(profiles, region, now = Date.now()) {
  if (region !== 'cn' && region !== 'international') {
    throw new RangeError('服务器区域必须是 cn 或 international');
  }
  const profile = profiles?.[region];
  if (!profile) throw new TypeError(`缺少 ${region} 阶段配置`);
  const nowMs = epochMilliseconds(now);
  const openMs = Date.parse(profile.openAt);
  const intervalMs = profile.intervalMs;
  const initialGroup = profile.initialGroup;
  const initialCap = profile.initialCap;
  if (!Number.isFinite(openMs) || !Number.isInteger(intervalMs) || intervalMs <= 0
      || !Number.isInteger(initialGroup) || !Number.isInteger(initialCap)
      || !Number.isInteger(profile.groupStep) || !Number.isInteger(profile.capStep)) {
    throw new TypeError(`${region} 阶段配置字段无效`);
  }
  if (nowMs < openMs) {
    return {
      status: 'not_open',
      region,
      label: profile.label,
      group: null,
      cap: null,
      generation: null,
      promotionCount: null,
      nextChangeAt: openMs,
      version: profile.version,
      timezone: profile.timezone,
    };
  }
  const promotionCount = Math.floor((nowMs - openMs) / intervalMs);
  const group = initialGroup + profile.groupStep * promotionCount;
  const cap = initialCap + profile.capStep * promotionCount;
  const supported = profile.supportedGroups.includes(group);
  return {
    status: supported ? 'supported' : 'unsupported',
    region,
    label: profile.label,
    group,
    cap,
    generation: (profile.initialGeneration ?? 2) + promotionCount,
    promotionCount,
    nextChangeAt: openMs + (promotionCount + 1) * intervalMs,
    version: profile.version,
    timezone: profile.timezone,
  };
}

function validateRuntimeModels(models) {
  if (models?.schema_version !== 1 || !models.profiles || !models.groups) {
    throw new TypeError('运行时模型文件 schema 无效');
  }
  for (const region of ['cn', 'international']) {
    const profile = models.profiles[region];
    if (!profile || !Array.isArray(profile.supportedGroups)) {
      throw new TypeError(`运行时模型缺少 ${region} 阶段配置`);
    }
  }
}

export function createModelLoader({
  fetchImpl = globalThis.fetch,
  modelsUrl = new URL('../data/runtime_models.json', import.meta.url),
} = {}) {
  if (typeof fetchImpl !== 'function') throw new TypeError('需要提供 fetch 实现');
  let modelsPromise;
  async function loadModels() {
    if (!modelsPromise) {
      modelsPromise = (async () => {
        const response = await fetchImpl(modelsUrl);
        if (!response?.ok) throw new Error(`读取运行时模型失败：HTTP ${response?.status ?? '未知'}`);
        const models = await response.json();
        validateRuntimeModels(models);
        return models;
      })().catch((error) => {
        modelsPromise = null;
        throw error;
      });
    }
    return modelsPromise;
  }

  return async function loadModel(region, now = Date.now()) {
    const models = await loadModels();
    const stage = selectStage(models.profiles, region, now);
    if (stage.status !== 'supported') return { status: stage.status, region, stage };
    const entry = models.groups[String(stage.group)];
    if (!entry || entry.model?.source_version?.group_key !== stage.group
        || entry.model?.source_version?.current_quality_cap !== stage.cap
        || entry.probabilities?.source?.group_key !== stage.group
        || entry.probabilities?.source?.current_cap !== stage.cap) {
      stage.status = 'unsupported';
      return { status: 'unsupported', region, stage };
    }
    const calculator = createCalculator(entry);
    const storedProof = entry.lockProof;
    if (!storedProof || storedProof.valid !== calculator.lockProof.valid
        || !Number.isFinite(storedProof.minAdvantage)
        || Math.abs(storedProof.minAdvantage - calculator.lockProof.minAdvantage) > 1e-7) {
      throw new TypeError(`组 ${stage.group} 的锁定证明与当前概率或参考值不一致`);
    }
    return {
      status: 'ready',
      region,
      stage,
      model: entry.model,
      probabilities: entry.probabilities,
      reference: entry.reference,
      calculator,
      lockProof: calculator.lockProof,
    };
  };
}

export const loadModel = createModelLoader();
