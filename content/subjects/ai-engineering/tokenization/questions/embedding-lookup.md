---
id: ai-token-embedding-lookup
kind: question
topicId: ai-tokenization-embeddings
lessonId: lesson-ai-token-representations
prompt: What does an embedding lookup do, and what are its shapes for a batch of token IDs?
difficulty: easy
status: published
revision: 1
order: 250
tags: [embeddings, tensor-shapes]
followUps:
  - Which values are parameters and which are activations?
  - Does a numerically larger ID mean a semantically stronger token?
misconception: IDs select rows; their numeric distance does not measure semantic similarity.
---

## Answer

For a table of shape `(V,D)`, each ID selects a D-dimensional row. IDs of shape
`(B,L)` produce embeddings of shape `(B,L,D)`. The table is learned parameters;
retrieved vectors are per-input activations.

### Supporting reasoning

Repeated IDs initially retrieve identical rows during ordinary deterministic lookup.
Inference generally holds the table fixed. IDs must use the checkpoint's vocabulary.

### Evaluation rubric

One point each: row selection; correct batch shape; parameter/activation distinction;
rejecting ordinal semantic meaning for IDs.
