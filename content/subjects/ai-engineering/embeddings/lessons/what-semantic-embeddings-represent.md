---
id: lesson-ai-semantic-embeddings
kind: lesson
topicId: ai-embeddings
title: What Semantic Embeddings Represent
summary: Understand how a whole text becomes a vector for similarity, retrieval, clustering, and recommendation systems.
difficulty: easy
status: published
revision: 1
order: 335
tags: [embeddings, semantics, retrieval]
prerequisiteIds: [lesson-ai-sentence-embeddings]
---

## A coordinate system for meaning

An embedding model maps an input into a fixed-length vector. Similar inputs should be
near one another under a chosen metric:

```text
"reset my password" → [0.12, -0.44, ...]
"forgotten password help" → [0.10, -0.41, ...]
```

The individual coordinates usually do not have human-readable labels. Meaning is
distributed across dimensions, and closeness is useful only for the task and model
that produced the vectors.

## Representation is not truth

An embedding captures patterns learned from training data. It can miss a rare product
identifier, encode unwanted social associations, or place two opposites near each
other because their language is similar. Retrieval still needs lexical matching,
metadata filters, and evaluation on real queries.

## Generative hidden states versus retrieval embeddings

A language model's token hidden states support next-token generation and change with
context. A retrieval embedding is a deliberate interface that maps a query or document
to a comparable fixed-size vector, often trained with positive and negative pairs.
They may share an encoder, but they are not interchangeable by definition.

## Recall

Why is semantic similarity not a guarantee of factual equivalence? Why might a
retrieval embedding model be better for search than a generative model's hidden state?

Continue to [embedding objectives](embedding-objectives.md).
