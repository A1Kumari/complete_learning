---
id: ai-attention-sequence-tradeoffs
kind: question
topicId: ai-deep-learning
lessonId: lesson-ai-architecture-selection
prompt: Why did attention-based Transformers become attractive for long-range sequence modeling, and what costs remain?
difficulty: medium
frequent: true
status: published
revision: 1
order: 210
tags: [attention, model-selection, training]
conceptIds: [concept-architecture-tradeoffs, concept-recurrent-state]
followUps:
  - Why can teacher-forced training parallelize positions while normal autoregressive generation cannot?
  - Does an optimized attention kernel necessarily remove quadratic arithmetic?
misconception: Attention is one component of a Transformer, and shorter information paths do not guarantee reliable long-context recall.
---

## Answer

Full self-attention provides direct content-dependent interactions between permitted
positions instead of passing every dependency through recurrent updates. With known
training prefixes and appropriate masks, positions can be processed in parallel.
Costs include standard full-attention interactions that grow quadratically with
sequence length, cache growth in full-history decoding, and no guarantee that a model
uses all accessible context effectively.

### Supporting reasoning

Autoregressive inference still depends on previously generated tokens. Efficient
kernels can avoid materializing the whole score matrix without removing all pairwise
computation. Restricted attention variants change paths and complexity. A complete
Transformer also uses positional information, feed-forward layers, normalization,
and residual connections.

### Evaluation rubric

- **1 point:** explains shorter permitted interaction paths versus recurrence.
- **1 point:** distinguishes full-sequence training from token-by-token generation.
- **1 point:** names a qualified computation or memory cost.
- **1 point:** distinguishes attention from the whole architecture and avoids guaranteed recall claims.

### Reference

[Vaswani et al., sections 3–4](https://arxiv.org/html/1706.03762v7).
