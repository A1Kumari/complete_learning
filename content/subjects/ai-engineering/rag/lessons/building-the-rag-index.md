---
id: lesson-ai-building-rag-index
kind: lesson
topicId: ai-rag
title: Building and Updating a RAG Index
summary: Turn versioned chunks into embeddings and searchable records while handling incremental updates, stale data, and deletion.
difficulty: medium
status: published
revision: 1
order: 525
tags: [rag, indexing, embeddings, versioning]
prerequisiteIds: [lesson-ai-rag-ingestion, lesson-ai-vector-lifecycle]
---

## Index records need identity

Use a deterministic key such as `tenant/document_id/version/chunk_number` or a content
hash with an explicit document identity. Store the embedding model revision, chunking
version, source location, ACL scope, and active status. The vector alone cannot tell
you whether a result is current or authorized.

## Incremental indexing

```text
source event → compare content hash → parse/chunk changed document
             → embed → upsert new version → mark old version inactive
```

Make each step idempotent. A retry of the same event should not create duplicate
chunks. Publish an index version only after all required records are present, or query
with an explicit active-version filter. Deletion requires both removing or hiding
vectors and invalidating caches that contain the old evidence.

## Operational checks

Count source documents and chunks before and after a batch, sample provenance, compare
embedding dimensions, and retain a dead-letter record for parse or embedding failures.
A successful job means records were processed, not that retrieval quality remained
unchanged; run regression queries after reindexing.

## Recall

Why is a content hash alone insufficient for document identity? What can happen if an
old version remains searchable after a new version is indexed?
