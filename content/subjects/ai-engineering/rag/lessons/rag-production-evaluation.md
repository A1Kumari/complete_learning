---
id: lesson-ai-rag-production-evaluation
kind: lesson
topicId: ai-rag
title: RAG Evaluation and Production Engineering
summary: Build golden datasets and monitor retrieval, groundedness, latency, cost, access controls, freshness, and regressions together.
difficulty: hard
status: published
revision: 1
order: 560
tags: [rag, evaluation, production, observability]
prerequisiteIds: [lesson-ai-rag-grounding, lesson-ai-rag-patterns, lesson-ai-rag-pipeline]
---

## Evaluate the system in layers

Create questions with labeled relevant documents, expected claims, allowed citations,
and no-answer cases. Measure retrieval Recall@K and MRR or nDCG separately from answer
correctness and groundedness. A relevant passage can still produce an unsupported
answer; a correct-looking answer can be lucky.

```text
retrieval: did the right evidence appear?
generation: did the answer make the right claims?
grounding: can each claim be supported by cited evidence?
operations: was it timely, affordable, authorized, and observable?
```

Run the set on every chunking, embedding, reranking, prompt, and model change. Break
results down by language, document type, query intent, tenant, freshness, and answerable
versus unanswerable questions. Store traces with corpus and configuration versions.

## Production safeguards

Apply access control before retrieval, use effective document versions, bound context
and output tokens, cache only with identity and configuration in the key, and expose
an explicit abstention state. Monitor retrieval misses, citation failures, latency,
provider errors, token cost, and index freshness. Regression tests should include
deleted documents and permission changes.

## Recall

How could retrieval Recall@5 improve while grounded answer quality gets worse? Name
three production metrics that do not measure answer correctness.
