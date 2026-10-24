---
id: ai-embedding-metric-winners
kind: question
topicId: ai-embeddings
lessonId: lesson-ai-embedding-metrics
prompt: For query [1,0] and A=[2,0], B=[8,6], C=[0.8,0.2], which wins raw dot, cosine, and raw squared L2?
difficulty: medium
status: published
revision: 1
order: 710
tags: [embeddings, vector-metrics]
conceptIds: [concept-embedding-metrics]
followUps:
  - Which metrics should be sorted ascending?
  - Does a cosine score of 0.85 mean 85 percent relevant?
misconception: Raw dot, cosine, and Euclidean rankings are not universally interchangeable.
---

## Answer

Raw dot picks B with 8. Cosine picks A with 1; C is about 0.9701 and B is 0.8.
Raw squared L2 picks C with 0.08, compared with A at 1 and B at 85.

### Supporting reasoning

Dot and cosine usually rank larger scores first; raw distance ranks smaller first.
Magnitude changes raw metrics, while cosine compares direction. A similarity score
is not automatically calibrated relevance probability.

### Evaluation rubric

One point each: dot winner/value; cosine ranking; L2 winner/value; score-direction
or probability qualification.
