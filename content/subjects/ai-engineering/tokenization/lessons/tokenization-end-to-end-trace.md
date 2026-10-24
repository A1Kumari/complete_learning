---
id: lesson-ai-tokenization-end-to-end
kind: lesson
topicId: ai-tokenization-embeddings
title: "From Text to Contextual States: An End-to-End Trace"
summary: Follow a short sentence through token pieces, IDs, embedding lookup, contextual processing, and a pooled whole-text representation.
difficulty: medium
status: published
revision: 1
order: 135
tags: [tokenization, embeddings, representations]
prerequisiteIds: [lesson-ai-token-representations, lesson-ai-sentence-embeddings]
---

## Keep the layers separate

For `cats sleep`, a tokenizer may produce token pieces and IDs such as
`[cats, sleep] → [412, 981]`. The embedding table looks up one learned vector per
ID. A Transformer then mixes information across positions, producing contextual
vectors. A pooling function can reduce those vectors to one sentence vector.

```text
text → token pieces → token IDs → token embeddings
     → contextual token states → pooling → text embedding
```

The IDs are labels, token embeddings are initial per-token vectors, contextual states
depend on neighboring tokens, and a pooled text embedding is one representation for
similarity. Calling all four “the embedding” hides important bugs.

## A numerical shape check

If a sequence has 4 tokens and the model width is 3, the embedding lookup has shape
`4 × 3`. Contextual processing preserves that shape; mean pooling produces `1 × 3`.
Padding masks determine whether padded rows participate in the mean.

## Recall

Which layer changes when the same token appears in two different sentences? Why must a
pooling function ignore padding?
