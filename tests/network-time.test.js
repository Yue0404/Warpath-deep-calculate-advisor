import assert from 'node:assert/strict';
import test from 'node:test';
import { createNetworkClock } from '../src/network-time.js';

function response({ date = 'Thu, 08 Oct 2026 05:35:45 GMT', age = null, status = 200 } = {}) {
  const headers = new Headers({ Date: date });
  if (age !== null) headers.set('Age', String(age));
  return { ok: status >= 200 && status < 300, status, headers };
}

test('网络时钟以HTTP Date与Age校准，并由单调时钟推进', async () => {
  let monotonic = 100;
  let requested;
  const clock = createNetworkClock({
    monotonicNow: () => monotonic,
    fetchImpl: async (url, options) => {
      requested = { url: new URL(url), options };
      monotonic = 300;
      return response({ age: 2 });
    },
  });

  assert.throws(() => clock.now(), /尚未同步/);
  const result = await clock.sync();
  const date = Date.parse('Thu, 08 Oct 2026 05:35:45 GMT');
  assert.equal(result.ok, true);
  assert.equal(result.now, date + 2_000 + 100);
  assert.equal(clock.now(), result.now);
  assert.equal(requested.options.method, 'HEAD');
  assert.equal(requested.options.cache, 'no-store');
  assert.ok(requested.url.searchParams.has('_utc'));
  monotonic += 1_500;
  assert.equal(clock.now(), result.now + 1_500);
});

test('首次网络时间获取失败时不伪用本机时钟，后续失败保留网络锚点', async () => {
  let monotonic = 10;
  let fail = true;
  const clock = createNetworkClock({
    monotonicNow: () => monotonic,
    fetchImpl: async () => {
      if (fail) throw new Error('离线');
      return response();
    },
  });

  const first = await clock.sync();
  assert.deepEqual(first, { ok: false, error: '离线', stale: false });
  assert.equal(clock.status().ready, false);
  assert.throws(() => clock.now(), /尚未同步/);

  fail = false;
  await clock.sync();
  const synchronizedTime = clock.now();
  fail = true;
  const later = await clock.sync();
  assert.deepEqual(later, { ok: false, error: '离线', stale: true });
  monotonic += 2_000;
  assert.equal(clock.now(), synchronizedTime + 2_000);
  assert.equal(clock.status().ready, true);
});

test('拒绝无效Date、Age和HTTP错误响应', async () => {
  for (const fetchImpl of [
    async () => response({ date: 'not a date' }),
    async () => response({ date: 'Thu, 31 Feb 2026 05:35:45 GMT' }),
    async () => response({ age: '-1' }),
    async () => response({ age: '1.5' }),
    async () => response({ status: 503 }),
  ]) {
    const clock = createNetworkClock({ fetchImpl, monotonicNow: () => 1 });
    const result = await clock.sync();
    assert.equal(result.ok, false);
    assert.equal(clock.isReady(), false);
  }
});

test('同步调用抛错后可重试，且并发调用共用一次网络请求', async () => {
  let requests = 0;
  let monotonic = 50;
  const clock = createNetworkClock({
    monotonicNow: () => monotonic,
    fetchImpl: async () => {
      requests += 1;
      if (requests === 1) throw new Error('模拟同步异常');
      await new Promise((resolve) => setTimeout(resolve, 5));
      monotonic += 4;
      return response();
    },
  });

  assert.equal((await clock.sync()).ok, false);
  assert.equal(clock.status().syncing, false);
  const [first, second] = await Promise.all([clock.sync(), clock.sync()]);
  assert.equal(first.ok, true);
  assert.equal(second, first);
  assert.equal(requests, 2);
  assert.equal(clock.status().syncing, false);
  assert.equal(clock.status().ready, true);
});

test('单调时钟异常不会卡住同步状态，修复后可重试', async () => {
  let monotonic = Number.NaN;
  const clock = createNetworkClock({
    monotonicNow: () => monotonic,
    fetchImpl: async () => response(),
  });

  assert.equal((await clock.sync()).ok, false);
  assert.equal(clock.status().syncing, false);
  monotonic = 100;
  assert.equal((await clock.sync()).ok, true);
});

test('网络请求超时会中止fetch，释放状态并允许重新同步', async () => {
  let requests = 0;
  let aborted = false;
  const clock = createNetworkClock({
    timeoutMs: 5,
    monotonicNow: () => 100,
    fetchImpl: async (_url, { signal }) => {
      requests += 1;
      if (requests > 1) return response();
      return new Promise((_resolve, reject) => {
        signal.addEventListener('abort', () => {
          aborted = true;
          reject(signal.reason);
        }, { once: true });
      });
    },
  });

  const timedOut = await clock.sync();
  assert.equal(timedOut.ok, false);
  assert.equal(timedOut.stale, false);
  assert.equal(aborted, true);
  assert.equal(clock.status().ready, false);
  assert.equal(clock.status().syncing, false);

  assert.equal((await clock.sync()).ok, true);
  assert.equal(requests, 2);
  assert.equal(clock.status().ready, true);
  assert.equal(clock.status().syncing, false);
});
