---
id: ai-embedding-migration-drift
kind: question
topicId: ai-embeddings
lessonId: lesson-ai-embedding-evaluation-migration
prompt: How should an embedding model upgrade be migrated and monitored without mixing incompatible vector spaces?
difficulty: medium
status: published
revision: 1
order: 760
tags: [embeddings, model-migration, drift]
conceptIds: [concept-embedding-evaluation]
followUps:
  - Why migrate the query encoder and document collection together?
  - Does score-distribution drift necessarily mean relevance degraded?
misconception: Same dimensionality does not imply coordinate compatibility, and vector-health metrics alone do not establish relevance.
---

## Answer

Version the complete encoder/preprocessing contract, build separate candidate
document vectors, evaluate with candidate queries, synchronize updates/deletions,
and cut over query encoder plus collection together with rollback available.

### Supporting reasoning

Compare relevance slices, thresholds, latency, cost, dimensions, norms, and invalid
vectors. Distinguish model/preprocessing changes from corpus/query drift. Distribution
shifts prompt investigation; only task evidence establishes quality impact.

### Evaluation rubric

One point each: full-contract versioning; isolated compatible-space evaluation;
synchronized cutover/rollback; outcome-based drift monitoring.
