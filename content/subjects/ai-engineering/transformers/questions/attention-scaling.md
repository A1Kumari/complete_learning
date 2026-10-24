---
id: ai-transformer-attention-scaling
kind: question
topicId: ai-transformers
lessonId: lesson-ai-scaled-attention
prompt: What do Q, K, and V do in attention, and why divide QK-transpose by the square root of the key width?
difficulty: medium
frequent: true
status: published
revision: 1
order: 780
tags: [transformers, attention]
conceptIds: [concept-scaled-attention]
followUps:
  - Along which dimension does softmax operate?
  - Can values have a different width from keys?
misconception: Q/K/V are input-dependent projections, not three independent stores of facts.
---

## Answer

Queries match keys to produce logits; row-wise softmax turns those logits into
weights over key positions. The weights mix values. Scaling by sqrt(dk) stabilizes
logit variance as key width increases under an approximate independent unit-variance
coordinate model.

### Supporting reasoning

Without scaling, large dot products can drive saturated softmax distributions.
For Q `(Tq,dk)`, K `(Tk,dk)`, V `(Tk,dv)`, weights are `(Tq,Tk)` and output is
`(Tq,dv)`. The statistical motivation is not a guarantee about learned activations.

### Evaluation rubric

One point each: Q/K matching; value mixing; correct softmax axis/shapes; scaling
intuition with its assumptions.
