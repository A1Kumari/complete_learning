---
id: ai-vector-collection-contract
kind: question
topicId: ai-vector-databases
lessonId: lesson-ai-exact-vector-search
prompt: Two encoders emit 768-dimensional vectors. Is that enough to put their document vectors in one cosine-search collection?
difficulty: medium
status: published
revision: 1
order: 860
tags: [vector-databases, embedding-contracts]
conceptIds: [concept-exact-vector-search]
followUps:
  - Which query and document preprocessing details should be recorded?
  - How would you migrate to a new encoder?
misconception: Equal vector width does not imply compatible embedding geometry.
---

## Answer

No. Equal dimension establishes shape compatibility, not a shared semantic space.
Use a documented compatible query/document encoder pair with matching checkpoint,
preprocessing, normalization, and metric contracts. Otherwise build separate spaces
and migrate or fuse ranked results deliberately.

### Supporting reasoning

Different models may assign entirely different meanings to coordinates. Record
source and chunk versions too, so vectors can be traced and replaced. Padding or
truncating dimensions does not make incompatible models comparable.

### Evaluation rubric

One point each: rejects dimension-only compatibility; encoder/checkpoint contract;
preprocessing/metric contract; coherent migration or separate-space approach.
