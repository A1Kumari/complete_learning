---
id: ai-transformer-cache-cost
kind: question
topicId: ai-transformers
lessonId: lesson-ai-cached-decoding
prompt: Estimate KV cache memory for L=24, B=1, Hkv=8, T=4096, head width=64 and two-byte elements. Does caching make decode cost constant in context length?
difficulty: hard
frequent: true
status: published
revision: 1
order: 850
tags: [transformers, kv-cache, performance]
conceptIds: [concept-kv-cache]
followUps:
  - Why use the KV head count rather than always the query head count?
  - What memory is excluded from the estimate?
misconception: Reusing prefix projections does not remove the new query's work over cached keys.
---

## Answer

Storage is `2*L*B*Hkv*T*head_width*bytes = 201326592` bytes, or 192 MiB,
excluding overhead. Full-prefix cached attention for one new token still reads
T keys/values and has attention work roughly linear in T per head.

### Supporting reasoning

The factor two counts K and V. Grouped-query attention can use fewer KV heads than
query heads. Prefill has quadratic pairwise attention work; decode also includes
projections, FFNs, bandwidth, and scheduling costs beyond the attention calculation.

### Evaluation rubric

One point each: formula; correct memory; linear per-token attention rather than
constant; overhead or grouped-query qualification.
