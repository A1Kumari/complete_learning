---
id: ai-text-cosine-calculation
kind: question
topicId: ai-tokenization-embeddings
lessonId: lesson-ai-sentence-embeddings
prompt: Calculate cosine similarity for [1,0] and [3,1]. When is cosine equal to dot product?
difficulty: medium
status: published
revision: 1
order: 270
tags: [embeddings, cosine-similarity]
followUps:
  - What happens for a zero vector?
  - Does multiplying [3,1] by ten change its cosine score?
misconception: Raw dot product depends on magnitude; cosine normally removes positive scale.
---

## Answer

Cosine is `dot(a,b)/(norm(a)*norm(b))`, so the score is `3/sqrt(10) ≈ 0.9487`.
For unit-normalized vectors cosine equals dot product. A zero-vector cosine is
undefined and requires explicit handling.

### Supporting reasoning

Positive scaling changes both numerator and denominator proportionally, so `[30,10]`
has the same cosine. Unnormalized dot products can produce different rankings.

### Evaluation rubric

One point each: correct formula; numeric calculation; normalization condition;
handling zero vectors or explaining scale behavior.
