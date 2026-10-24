---
id: ai-llm-sampling-trace
kind: question
topicId: ai-llm-fundamentals
lessonId: lesson-ai-llm-inference
prompt: For logits [2,1,0], what does top-p=0.8 retain after temperature-1 softmax?
difficulty: medium
status: published
revision: 1
order: 330
tags: [llm, sampling]
followUps:
  - How does decreasing temperature change this distribution?
  - Is low temperature a factuality control?
misconception: Nucleus filtering retains the threshold-crossing token, then renormalizes.
---

## Answer

Softmax gives approximately `[0.6652,0.2447,0.0900]`. Keep the first two entries:
their cumulative mass first reaches 0.8. Renormalizing gives approximately
`[0.7311,0.2689]` over those entries.

### Supporting reasoning

Lower positive temperature sharpens relative probabilities; it cannot verify whether
the most likely candidate is true. Filtering order and zero-temperature conventions
are implementation-specific.

### Evaluation rubric

One point each: softmax distribution; crossing-token rule; renormalized values;
temperature/factuality distinction.
