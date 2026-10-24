---
id: lesson-ai-prefiltering-postfiltering
kind: lesson
topicId: ai-vector-databases
title: Prefiltering and Postfiltering in Vector Search
summary: Compare filtering before approximate search with filtering after candidate retrieval and understand filter starvation.
difficulty: medium
status: published
revision: 1
order: 465
tags: [vector-databases, filtering, multi-tenancy]
prerequisiteIds: [lesson-ai-filtered-vector-search, lesson-ai-approximate-indexes]
---

## The filter changes the search population

Suppose the nearest five vectors overall belong to other tenants, but the best allowed
document is ranked 80th globally. Postfiltering top five returns nothing. Prefiltering
restricts the candidate population before search, but can be expensive or unsupported
for some ANN indexes.

```text
prefilter: eligible records → nearest neighbors
postfilter: nearest neighbors globally → remove ineligible records
```

A safe system must never use postfiltering as an excuse to leak unauthorized scores or
content. If the engine cannot enforce the filter during search, over-fetching may
reduce starvation, but it does not prove correctness when eligibility is highly
selective. Test empty, sparse, and adversarial tenant cases.

## Recall

Why can `top_k=5` followed by a tenant filter produce no result even when an allowed
match exists? When is over-fetching still insufficient?
