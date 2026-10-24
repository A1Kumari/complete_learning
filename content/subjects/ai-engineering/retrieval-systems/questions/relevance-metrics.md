---
id: ai-retrieval-relevance-metrics
kind: question
topicId: ai-retrieval-systems
lessonId: lesson-ai-retrieval-evaluation
prompt: Labels are A=3, B=1, C=0 and results are [C,B,A]. Calculate Recall@2, reciprocal rank at 2, and nDCG@2 using exponential gains.
difficulty: hard
status: published
revision: 1
order: 1000
tags: [retrieval, evaluation, ndcg]
conceptIds: [concept-retrieval-evaluation]
followUps:
  - How does reciprocal rank for one query become MRR?
  - Why can nDCG change even if the same relevant IDs are returned?
misconception: Recall, reciprocal rank, and nDCG measure different properties of a ranking.
---

## Answer

Recall@2 is 1/2. The first relevant result is at rank two, so reciprocal rank is
1/2. DCG@2 is `1/log2(3)` and ideal DCG@2 is `7+1/log2(3)`, giving nDCG about
0.0827 with gain `2^grade-1`.

### Supporting reasoning

A and B are both relevant, but A is much more relevant under these grades. Recall
measures coverage, reciprocal rank focuses on the first relevant hit, and nDCG
rewards high-grade items early. MRR averages per-query reciprocal ranks.

### Evaluation rubric

One point each: recall; reciprocal rank; gain/discount and ideal calculation;
correct normalized value or metric interpretation.
