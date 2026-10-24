---
id: lesson-ai-why-vector-databases
kind: lesson
topicId: ai-vector-databases
title: Why Vector Databases Exist
summary: Connect embedding generation to persistent similarity search and understand why a database boundary is useful in an application.
difficulty: easy
status: published
revision: 1
order: 430
tags: [vector-databases, embeddings, retrieval]
prerequisiteIds: [lesson-ai-generating-embeddings]
---

## The gap between a vector and a product

An embedding function can turn a document into numbers, but a useful service must
store those numbers with an ID, source text, tenant, permissions, version, and update
history. It must answer nearest-neighbor queries repeatedly, survive restarts, and
avoid returning records the caller cannot access.

## What the database boundary provides

```text
source document → embedding → record(id, vector, metadata)
query → embedding → filtered nearest neighbors → application
```

The vector index accelerates candidate search. Storage provides durability and
metadata operations. The application still owns chunking, authorization policy,
answer generation, and evaluation. A vector database does not understand whether a
retrieved paragraph actually answers the question.

## Start with a transparent baseline

For a small corpus, a list of vectors and brute-force cosine similarity is easier to
debug than an index. Introduce an approximate index only when measured latency or scale
requires it. Keep the exact implementation as a test oracle for recall.

## Recall

Which responsibilities remain outside a vector database? Why is an exact search
baseline valuable even after adopting an ANN index?

Continue to [vector storage contracts](exact-vector-search.md).
