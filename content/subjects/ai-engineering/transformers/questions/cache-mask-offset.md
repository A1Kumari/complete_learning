---
id: ai-transformer-cache-mask-offset
kind: question
topicId: ai-transformers
lessonId: lesson-ai-cached-decoding
prompt: A new one-token decode query after a three-token prefix uses a freshly created 1-by-4 lower-triangular mask. Why can cached logits disagree with a full causal pass?
difficulty: hard
status: published
revision: 1
order: 840
tags: [transformers, kv-cache, masking]
conceptIds: [concept-kv-cache]
followUps:
  - Which keys may each row of a two-token chunk read after that prefix?
  - What else should you check if fixing the mask does not restore agreement?
misconception: A cached query's local row zero is not global sequence position zero.
---

## Answer

That triangle permits only key zero, although the new query is at global position
three and may read keys zero through three. Offset the causal visibility by past
length. Compare cached and full outputs with fixed inputs and suitable tolerances.

### Supporting reasoning

For a two-token chunk after length three, rows may read columns through three and
four respectively. Also check position indices, concatenation axis, per-layer K/V,
padding, model mode, and whether the prefix changed.

### Evaluation rubric

One point each: local/global offset; correct one-token visibility; two-token
visibility; concrete full-versus-cached debugging check.
