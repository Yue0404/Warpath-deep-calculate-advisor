/** 把计算结果映射为建议区的语义状态和可见内容。 */
export function renderRecommendation({ panel, title, unsupported, apply, nextRoll, decision, complete, translate }) {
  panel.hidden = !decision && !complete;
  panel.dataset.choice = complete ? 'complete' : decision?.choice ?? '';
  panel.dataset.priority = decision?.choice === 'accept' || decision?.choice === 'discard' ? decision.choice : 'none';
  title.textContent = complete ? translate('complete') : decision ? translate(decision.choice) : '';
  unsupported.hidden = !decision || decision.supported;
  apply.hidden = !decision || complete;
  nextRoll.hidden = !decision || complete;
}
