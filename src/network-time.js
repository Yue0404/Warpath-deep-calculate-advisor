const DEFAULT_TIMEOUT_MS = 5000;

function parseAge(value) {
  if (value === null || value === '') return 0;
  if (!/^\d+$/.test(value)) throw new TypeError('网络时间响应中的 Age 字段无效');
  const seconds = Number(value);
  if (!Number.isSafeInteger(seconds)) throw new TypeError('网络时间响应中的 Age 字段无效');
  return seconds * 1000;
}

function parseHttpDate(value) {
  if (typeof value !== 'string' || !/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), \d{2} (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{4} \d{2}:\d{2}:\d{2} GMT$/.test(value)) {
    throw new TypeError('网络时间响应中的 Date 字段格式无效');
  }
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp) || new Date(timestamp).toUTCString() !== value) {
    throw new TypeError('网络时间响应中的 Date 字段无效');
  }
  return timestamp;
}

export function createNetworkClock({
  fetchImpl = globalThis.fetch,
  timeUrl = new URL('../index.html', import.meta.url),
  monotonicNow = () => globalThis.performance.now(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
} = {}) {
  if (typeof fetchImpl !== 'function') throw new TypeError('需要提供 fetch 实现');
  if (typeof monotonicNow !== 'function') throw new TypeError('需要提供单调时钟');
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) throw new RangeError('网络时间请求超时必须大于0');

  let anchorEpochMs = null;
  let anchorMonotonicMs = null;
  let syncing = null;
  let lastError = null;
  let requestSequence = 0;

  function monotonicValue() {
    const value = monotonicNow();
    if (!Number.isFinite(value)) throw new TypeError('单调时钟返回值无效');
    return value;
  }

  function isReady() {
    return anchorEpochMs !== null;
  }

  function now() {
    if (!isReady()) throw new Error('网络时间尚未同步');
    return anchorEpochMs + Math.max(0, monotonicValue() - anchorMonotonicMs);
  }

  function status() {
    return { ready: isReady(), syncing: syncing !== null, lastError };
  }

  function sync() {
    if (syncing) return syncing;
    let operation;
    operation = Promise.resolve().then(async () => {
      let timeout;
      try {
        const startedAt = monotonicValue();
        const controller = new AbortController();
        timeout = setTimeout(() => controller.abort(), timeoutMs);
        const url = new URL(timeUrl, globalThis.location?.href ?? import.meta.url);
        url.searchParams.set('_utc', `${Math.floor(startedAt)}-${++requestSequence}`);
        const response = await fetchImpl(url, {
          method: 'HEAD',
          cache: 'no-store',
          signal: controller.signal,
        });
        if (!response?.ok) throw new Error(`网络时间请求失败：HTTP ${response?.status ?? '未知'}`);
        const dateHeader = response.headers?.get?.('Date');
        const serverDateMs = parseHttpDate(dateHeader);
        const ageMs = parseAge(response.headers.get('Age'));
        const finishedAt = monotonicValue();
        const roundTripMs = Math.max(0, finishedAt - startedAt);
        anchorEpochMs = serverDateMs + ageMs + roundTripMs / 2;
        anchorMonotonicMs = finishedAt;
        lastError = null;
        return { ok: true, now: anchorEpochMs, sampledAt: finishedAt };
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error);
        return { ok: false, error: lastError, stale: isReady() };
      } finally {
        if (timeout !== undefined) clearTimeout(timeout);
      }
    }).finally(() => {
      if (syncing === operation) syncing = null;
    });
    syncing = operation;
    return operation;
  }

  return { sync, now, isReady, status };
}
