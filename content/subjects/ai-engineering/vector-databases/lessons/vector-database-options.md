---
id: lesson-ai-vector-database-options
kind: lesson
topicId: ai-vector-databases
title: Comparing FAISS, pgvector, Qdrant, and Managed Services
summary: Choose a vector storage option by workload, operational boundary, filtering needs, and recovery requirements.
difficulty: medium
status: published
revision: 1
order: 480
tags: [vector-databases, faiss, pgvector, qdrant]
prerequisiteIds: [lesson-ai-vector-lifecycle, lesson-ai-filtered-vector-search]
---

## The options solve different problems

FAISS is an indexing library: excellent for local experiments and embedded retrieval,
but it does not by itself provide a multi-tenant service, durable metadata database,
or an HTTP API. pgvector keeps vectors beside relational data and transactions, which
is attractive when PostgreSQL already owns authorization and records. Qdrant is a
purpose-built service with vector collections and filtering. Managed services trade
operational work for network, cost, provider, and data-boundary dependencies.

## Compare the boundary, not the logo

Ask where vectors live, how backups and rebuilds work, what filters are supported,
how consistency is exposed, how replicas scale, and how a tenant deletion is verified.
Benchmark query latency and recall on your dimensions, distribution, filter selectivity,
and update rate. A benchmark on random vectors is not enough for production relevance.

## A pragmatic progression

Use exact NumPy or FAISS for a teaching baseline, pgvector when relational joins and
transactions dominate, a dedicated service when retrieval scale and operational
features justify it, and managed infrastructure when the team values reduced
operations. Keep an adapter so the application does not depend on vendor response
shapes.

## Recall

Why might pgvector be a better first choice than a hosted service for a small product?
What operational question must be answered before promising deletion of a document?
