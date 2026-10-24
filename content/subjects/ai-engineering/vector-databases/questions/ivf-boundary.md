---
id: ai-vector-ivf-boundary
kind: question
topicId: ai-vector-databases
lessonId: lesson-ai-approximate-indexes
prompt: IVF centroids are 0 and 10; A=4.8 belongs to the first cell and B=5.1 to the second. Query 4.99 probes only its closest centroid. Why can exact candidate reranking still return the wrong nearest neighbor?
difficulty: hard
status: published
revision: 1
order: 880
tags: [vector-databases, ivf, ann]
conceptIds: [concept-ann-indexes]
followUps:
  - Which parameter can increase the number of searched cells?
  - How is compressed-distance error different from this failure?
misconception: Exact distance calculations cannot recover a neighbor excluded from the candidate set.
---

## Answer

The query selects centroid 0, so A is scored but B is not. Yet B is closer:
distance 0.11 versus 0.19. Reranking visited candidates exactly still cannot return
B. Increasing nprobe to include the second cell recovers it in this example.

### Supporting reasoning

This is a candidate-generation miss, not numerical or compression error. IVF may
score stored candidates exactly while remaining approximate because only some
lists are searched.

### Evaluation rubric

One point each: selected cell; both distances; candidate ceiling; nprobe fix or
candidate-versus-compression distinction.
