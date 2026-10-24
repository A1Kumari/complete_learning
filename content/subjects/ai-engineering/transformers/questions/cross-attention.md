---
id: ai-transformer-cross-attention
kind: question
topicId: ai-transformers
lessonId: lesson-ai-transformer-variants
prompt: With four source tokens and two target tokens, where do cross-attention Q/K/V come from and what is the attention-weight shape for one head?
difficulty: medium
status: published
revision: 1
order: 820
tags: [transformers, cross-attention]
conceptIds: [concept-transformer-variants]
followUps:
  - Which source positions should be masked?
  - How does target self-attention visibility differ?
misconception: Cross-attention weights need not be square or follow the target causal triangle over source positions.
---

## Answer

Q comes from target decoder states and K/V from source encoder states. Weights
have shape `(2,4)` for one head without a batch dimension. Each target query
can ordinarily read all nonpadding source positions.

### Supporting reasoning

The target's own self-attention remains causal over the target prefix. Source
padding is excluded independently; applying a two-token causal triangle to four
source keys would impose the wrong visibility rule.

### Evaluation rubric

One point each: query origin; key/value origin; rectangular dimensions; source
padding versus target-causal distinction.
