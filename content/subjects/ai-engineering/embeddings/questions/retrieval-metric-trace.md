---
id: ai-embedding-retrieval-metric-trace
kind: question
topicId: ai-embeddings
lessonId: lesson-ai-embedding-evaluation-migration
prompt: With one relevant document per query at ranks 1 and 3, what are mean recall@2 and MRR? What if the ranks become 2 and 1?
difficulty: medium
status: published
revision: 1
order: 750
tags: [embeddings, evaluation, retrieval]
conceptIds: [concept-embedding-evaluation]
followUps:
  - How should duplicate document IDs affect the metric?
  - Why evaluate no-answer queries separately?
misconception: Two fictional query results demonstrate metric arithmetic, not a statistically reliable production improvement.
---

## Answer

Baseline mean recall@2 is 0.5 and MRR is `(1+1/3)/2 ≈ 0.6667`. Candidate recall@2
is 1 and MRR is `(1/2+1)/2 = 0.75`. Count each document once under the declared
evaluation protocol.

### Supporting reasoning

Recall uses the fraction of known relevant documents retrieved in the first k.
No-answer cases have an empty relevant set and need abstention/false-acceptance
evaluation rather than dividing by zero. Judge completeness and sample uncertainty matter.

### Evaluation rubric

One point each: baseline recall/MRR; candidate recall/MRR; unique-ID/judgment
policy; no-answer or uncertainty qualification.
