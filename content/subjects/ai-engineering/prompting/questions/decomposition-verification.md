---
id: ai-prompt-decomposition-verification
kind: question
topicId: ai-prompt-engineering
lessonId: lesson-ai-prompt-examples-patterns
prompt: When is task decomposition useful, and why is a long explanation not proof of correctness?
difficulty: medium
status: published
revision: 1
order: 480
tags: [prompting, decomposition, evaluation]
followUps:
  - Give an independently checkable intermediate result for invoice processing.
  - What new failures do multiple model calls introduce?
misconception: Repeated self-verification by the same model is not independent evidence.
---

## Answer

Decompose when stages expose checkable artifacts or isolate genuinely different
operations, such as extraction, validated calculation, and presentation. A verbose
explanation may repeat the same false assumption and need not reflect reliable proof.

### Supporting reasoning

Use source spans, typed fields, and deterministic tools where useful. Extra calls
add latency, cost, and error propagation, so compare the complete pipeline empirically.

### Evaluation rubric

One point each: useful stage boundary; checkable artifact; explanation/evidence
distinction; cost and error-propagation trade-off.
