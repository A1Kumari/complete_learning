---
id: ai-search-recall-vs-ranking
kind: question
topicId: ai-search-recommendations
lessonId: lesson-ai-search-ranking-pipeline
prompt: Why must candidate recall be measured separately from ranking quality?
difficulty: medium
status: published
revision: 1
order: 110
tags: [search, retrieval, ranking, evaluation]
followUps:
  - What happens when a relevant item never enters the candidate set?
  - Which metrics can measure top-ranking quality?
misconception: A stronger ranker can recover every relevant result.
---

## Answer

Ranking only orders retrieved candidates. If retrieval misses a relevant item, no
ranker can place it in the results. Measure candidate recall first, then metrics such
as MRR or nDCG for ordering, and analyze the two failure stages separately.

### Evaluation rubric

One point each: candidate-set limitation; separate retrieval and ranking metrics;
failure-stage diagnosis; appropriate top-ranking metric.
