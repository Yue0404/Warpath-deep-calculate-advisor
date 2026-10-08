import test from 'node:test';
import assert from 'node:assert/strict';
import { renderRecommendation } from '../src/viewer.js';

function fixture() {
  const panel = { hidden: true, dataset: {} };
  const title = { textContent: '' };
  const unsupported = { hidden: true };
  const apply = { hidden: true };
  const nextRoll = { hidden: true };
  return { panel, title, unsupported, apply, nextRoll };
}

test('建议区将接受或放弃映射到对应重点动作', () => {
  for (const choice of ['accept', 'discard', 'indifferent']) {
    const elements = fixture();
    renderRecommendation({
      ...elements,
      decision: { choice, supported: true },
      complete: false,
      translate: (key) => key,
    });

    assert.equal(elements.panel.hidden, false);
    assert.equal(elements.panel.dataset.choice, choice);
    assert.equal(elements.panel.dataset.priority, choice === 'indifferent' ? 'none' : choice);
    assert.equal(elements.title.textContent, choice);
    assert.equal(elements.apply.hidden, false);
    assert.equal(elements.nextRoll.hidden, false);
  }
});

test('无结果时隐藏建议，满品时隐藏动作按钮', () => {
  const empty = fixture();
  renderRecommendation({ ...empty, decision: null, complete: false, translate: (key) => key });
  assert.equal(empty.panel.hidden, true);

  const complete = fixture();
  renderRecommendation({ ...complete, decision: null, complete: true, translate: (key) => key });
  assert.equal(complete.panel.hidden, false);
  assert.equal(complete.title.textContent, 'complete');
  assert.equal(complete.panel.dataset.priority, 'none');
  assert.equal(complete.apply.hidden, true);
  assert.equal(complete.nextRoll.hidden, true);
});
