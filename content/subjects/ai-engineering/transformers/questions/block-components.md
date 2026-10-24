---
id: ai-transformer-block-components
kind: question
topicId: ai-transformers
lessonId: lesson-ai-transformer-blocks
prompt: What separate jobs do attention, a position-wise FFN, residual paths, normalization, and position information perform in a Transformer?
difficulty: medium
frequent: true
status: published
revision: 1
order: 810
tags: [transformers, architecture]
conceptIds: [concept-transformer-block]
followUps:
  - How do pre-norm and post-norm formulas differ?
  - Does supporting longer position indices establish reliable length extrapolation?
misconception: A standard position-wise feed-forward network does not mix different token positions.
---

## Answer

Attention mixes information across accessible positions. The FFN nonlinearly
transforms features independently at each position with shared parameters. Residuals
provide additive identity paths; normalization stabilizes feature scales for
optimization. Position mechanisms supply ordering information beyond token content.

### Supporting reasoning

Without position signals or ordering constraints, self-attention is permutation
equivariant. Pre-norm applies normalization before a sublayer; post-norm applies it
after residual addition. Neither convention guarantees training success by itself.

### Evaluation rubric

One point each: cross-token versus token-wise distinction; residual role;
normalization role and placement; position-information role.
