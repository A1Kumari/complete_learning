---
id: ai-vector-exact-neighbors
kind: question
topicId: ai-vector-databases
lessonId: lesson-ai-exact-vector-search
prompt: For unit query [1,0] and unit documents policy=[1,0], guide=[0.8,0.6], billing=[0,1], what is exact cosine top-2 and what does exactness establish?
difficulty: easy
status: published
revision: 1
order: 870
tags: [vector-databases, exact-search]
conceptIds: [concept-exact-vector-search]
followUps:
  - What happens with a zero query vector?
  - What baseline does this give an ANN benchmark?
misconception: Exact nearest neighbors under a vector metric are not necessarily exactly relevant documents.
---

## Answer

Policy first with score 1, guide second with 0.8; billing scores 0. Exactness
establishes the top results under the chosen metric and representation after
considering every eligible vector. It does not establish semantic relevance or truth.

### Supporting reasoning

For unit vectors cosine equals dot product. Zero vectors lack a cosine direction
and need explicit rejection or handling. Exact IDs provide the reference for ANN
agreement, while task relevance requires separate judgments.

### Evaluation rubric

One point each: correct order; scores; metric-versus-relevance distinction;
zero-vector or ANN-baseline qualification.
