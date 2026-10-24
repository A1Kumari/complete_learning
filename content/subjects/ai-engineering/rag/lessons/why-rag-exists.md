---
id: lesson-ai-why-rag
kind: lesson
topicId: ai-rag
title: Why Retrieval-Augmented Generation Exists
summary: Understand when external evidence is better than relying on model parameters, and when RAG is unnecessary.
difficulty: easy
status: published
revision: 1
order: 510
tags: [rag, retrieval, grounding]
prerequisiteIds: [lesson-ai-llm-capabilities-limitations, lesson-ai-search-fundamentals]
---

## Parameters are not a live knowledge base

A model's parameters contain learned associations from training. Company policies,
inventory, and private runbooks change after training and may not have been present at
all. RAG supplies selected external records in the request so the answer can be based
on current, attributable evidence.

## RAG, fine-tuning, and long context

Fine-tuning changes behavior or task style; it is usually a poor mechanism for frequent
facts and does not naturally provide citations. Long context can remove retrieval
misses for a small corpus, but it costs tokens and can bury the relevant passage.
RAG narrows the evidence sent to the model, but adds ingestion, search, permissions,
freshness, and evaluation work.

RAG is unnecessary when the answer is stable and already in a short trusted prompt,
when a normal database query is exact and sufficient, or when retrieval quality costs
more than it improves the task.

## Recall

Why can fine-tuning fail to keep a frequently changing policy current? Name one case
where a normal database query is preferable to RAG.

Continue to [RAG architecture](rag-architecture.md).
