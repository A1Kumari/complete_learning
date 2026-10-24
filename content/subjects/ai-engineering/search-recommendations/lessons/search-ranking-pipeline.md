---
id: lesson-ai-search-ranking-pipeline
kind: lesson
topicId: ai-search-recommendations
title: Search Pipelines, Retrieval, and Ranking
summary: Build a search pipeline that separates candidate retrieval, ranking, filtering, and evaluation.
difficulty: medium
status: published
revision: 1
order: 100
tags: [search, ranking, retrieval]
---

## Search is a staged system

Production search usually separates candidate generation from ranking. A lexical
index, vector index, or both retrieve a broad candidate set. Filters remove
ineligible results. A ranker scores the remaining candidates, and a final policy
handles diversity, freshness, and presentation.

```text
query → normalize/rewrite → retrieve candidates → eligibility filters
                                      ↓
                           rank → diversify → present
```

Do not evaluate only the final top result. Measure whether relevant items entered the
candidate set first, then whether ranking placed them high enough. A perfect ranker
cannot recover a document that retrieval never returned.

## Match the retrieval method to the query

Lexical retrieval is strong for exact identifiers, rare terms, and precise phrase
matching. Dense retrieval captures semantic similarity but can miss exact codes,
negation, or newly introduced vocabulary. Hybrid retrieval combines both signals;
the fusion rule and candidate depths are part of the system contract.

Ranking features can include relevance scores, freshness, authority, language, and
user context. Keep eligibility separate from preference: authorization and hard
business constraints must filter results, not merely lower their score.

## Evaluation and failure analysis

Use a labeled query set with slices for head and tail queries, languages, spelling,
identifiers, and freshness. Track candidate recall, MRR, nDCG, click behavior, and
task success. Inspect false positives and false negatives, not just one aggregate.

Online clicks are useful but biased by position and presentation. Pair offline
regressions with controlled experiments and guardrails for latency, zero-result rate,
and unsafe or unauthorized exposure.

## Recall

Why can a better ranker fail to improve search? Which constraints belong in filters
rather than ranking features? Name two query slices that should be evaluated
separately.
