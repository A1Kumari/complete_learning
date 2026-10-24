---
id: lesson-ai-rag-query-processing
kind: lesson
topicId: ai-rag
title: Query Processing and Evidence Retrieval
summary: Improve a RAG query with hybrid retrieval, rewriting, candidate generation, and reranking while preserving access and provenance.
difficulty: medium
status: published
revision: 1
order: 530
tags: [rag, retrieval, reranking, queries]
prerequisiteIds: [lesson-ai-retrieval-pipeline-diagnosis, lesson-ai-rag-architecture]
---

## Retrieval is a sequence of decisions

Given `Can contractors expense home internet?`, the system may normalize the query,
run lexical and dense retrieval, fuse candidates, filter by tenant and effective date,
rerank the survivors, and select evidence under a token budget.

```text
question → optional rewrite → lexical/dense candidates → filters
          → fusion/rerank → dedupe → evidence selection
```

Query rewriting can expose synonyms but can also remove a crucial identifier. Keep the
original query, log both forms, and do not let a model-generated rewrite bypass tenant
or permission filters. Reranking should operate only on eligible candidates.

## Failure modes

No relevant candidate means inspect chunking, vocabulary, embedding fit, and corpus
freshness. A relevant candidate ranked low suggests fusion or reranking. A relevant
candidate omitted from the prompt suggests budget or deduplication failure. A good
passage followed by a bad answer belongs to generation and validation.

## Recall

Why must permissions be applied before reranking or prompting? What evidence would
prove that the query rewrite, rather than the index, caused a miss?
