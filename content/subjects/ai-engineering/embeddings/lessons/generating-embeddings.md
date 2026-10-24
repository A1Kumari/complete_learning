---
id: lesson-ai-generating-embeddings
kind: lesson
topicId: ai-embeddings
title: Generating Embeddings with APIs and Local Models
summary: Define an embedding input contract and implement a small batch pipeline that is safe to retry and ready for indexing.
difficulty: medium
status: published
revision: 1
order: 355
tags: [embeddings, python, apis, batching]
prerequisiteIds: [lesson-ai-semantic-embeddings, lesson-ai-embedding-input-contracts]
---

## Treat embedding generation as a data pipeline

For every vector, retain the source ID, model name and revision, preprocessing version,
dimension, normalization policy, and creation time. A vector without this metadata
cannot be safely compared after a model migration.

```python
def embed_in_batches(texts, embed, batch_size=32):
    results = []
    for start in range(0, len(texts), batch_size):
        batch = texts[start:start + batch_size]
        vectors = embed(batch)  # provider or local model adapter
        if len(vectors) != len(batch):
            raise ValueError('provider returned the wrong number of vectors')
        results.extend(vectors)
    return results
```

An API adapter owns authentication, retries, rate limits, and response validation.
A local model owns loading, device placement, batching, and memory. The application
should expose the same internal record shape for both so a local experiment can be
compared with a hosted model.

## Batching and retry safety

Batching improves throughput but increases request size and failure blast radius. Use
bounded batches, idempotent source IDs, exponential backoff for transient failures,
and a dead-letter path for permanent input errors. Never silently replace a failed
vector with a zero vector.

## Recall

Which metadata fields are needed to detect incompatible vectors? Why is an embedding
job easier to resume when source IDs are stable?

Continue to [embedding metrics](embedding-metrics.md).
