---
id: lesson-ai-search-fundamentals
kind: lesson
topicId: ai-retrieval-systems
title: "Search Fundamentals: Queries, Documents, and Relevance"
summary: Define relevance and build a measurable search problem before choosing lexical, dense, or hybrid retrieval.
difficulty: easy
status: published
revision: 1
order: 475
tags: [retrieval, search, relevance]
prerequisiteIds: [lesson-ai-why-vector-databases]
---

## Search is a ranking problem

Given a query and a collection, a search system should return useful documents near the
top. “Useful” depends on the task: exact policy version, conceptually related guide,
or product recommendation. Relevance is a judgment or labeled relationship, not the
same thing as vector distance or keyword overlap.

## Define the objects

Store a stable document ID, searchable fields, permissions, version, and enough source
metadata to explain a result. Normalize the query only when the transformation helps:
lowercasing can help prose but may damage case-sensitive identifiers. Preserve the raw
query for logging and diagnosis.

```text
query → analyze → retrieve candidates → rank → filter/format → user
```

Create a small labeled set before tuning. Include exact names, synonyms, typos,
ambiguous questions, and queries with no answer. Without it, every ranking change is
anecdotal.

## Recall

Why is “top result looks plausible” not a sufficient evaluation? Give one query type
where lexical matching is likely to beat semantic matching.

Continue to [lexical retrieval](lexical-retrieval.md).
