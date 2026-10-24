---
id: ai-embedding-unit-metric-equivalence
kind: question
topicId: ai-embeddings
lessonId: lesson-ai-embedding-metrics
prompt: Prove when cosine, dot product, and Euclidean nearest-neighbor rankings agree.
difficulty: medium
status: published
revision: 1
order: 720
tags: [embeddings, normalization]
conceptIds: [concept-embedding-metrics]
followUps:
  - What should happen to zero or nonfinite vectors?
  - Does equal vector width establish model compatibility?
misconception: Unit-vector equivalence does not justify mixing raw varying-norm vectors or unrelated model spaces.
---

## Answer

For nonzero vectors normalized to unit length, cosine equals dot product and
`||q-d||² = 2-2(q·d)`. Thus dot/cosine descending and L2 ascending agree in exact
arithmetic, aside from ties and numerical differences.

### Supporting reasoning

Check finite values, dimensions, and zero/near-zero policy before normalizing.
Use the encoder's prescribed geometry; magnitude may carry information. Equal
width from different models does not imply aligned coordinates.

### Evaluation rubric

One point each: unit assumptions; correct identity; correct ranking direction;
invalid-vector or compatibility qualification.
