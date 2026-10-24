---
id: lesson-ai-retrieval-pipeline-diagnosis
kind: lesson
topicId: ai-retrieval-systems
title: Retrieval Pipelines, Query Processing, and Failure Diagnosis
summary: Trace a retrieval request end to end and separate query, indexing, ranking, filtering, and presentation failures.
difficulty: medium
status: published
revision: 1
order: 515
tags: [retrieval, debugging, search-pipelines]
prerequisiteIds: [lesson-ai-retrieval-evaluation, lesson-ai-retrieval-reranking]
---

## Diagnose the stage, not the symptom

When a user says “search failed,” capture the raw query, normalized query, eligible
corpus, candidate IDs and scores, filter decisions, reranker scores, and final results.
An empty result may be a tokenizer bug, an over-restrictive tenant filter, a stale
index, or a genuinely missing document.

```text
request → auth/filter scope → query rewrite → lexical+dense candidates
        → fusion/rerank → diversity/deduplication → response
```

Keep candidate retrieval separate from user-facing ranking. ANN recall asks whether the
index found the true nearest vectors; relevance recall asks whether the system found a
document judged useful for the query. Improving the first does not necessarily improve
the second.

## A practical failure table

Exact identifier missing: add lexical search. Synonym missing: test dense or query
expansion. Relevant result filtered out: inspect authorization and metadata. Good
candidate ranked low: tune fusion or reranking. Good result but bad answer: debug the
RAG context and generator, not retrieval alone.

## Recall

What evidence distinguishes “the index missed it” from “the document was filtered”?
Why should the raw query remain available after query rewriting?
