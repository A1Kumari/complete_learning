---
id: ai-retrieval-rrf-calculation
kind: question
topicId: ai-retrieval-systems
lessonId: lesson-ai-hybrid-retrieval
prompt: With RRF constant 60, lexical ranking [C] and dense ranking [B,A,D,C], what scores do C and B receive and which ranks first?
difficulty: medium
status: published
revision: 1
order: 960
tags: [retrieval, hybrid, rrf]
conceptIds: [concept-hybrid-retrieval]
followUps:
  - What does a missing item contribute for one input list?
  - Can fusion retrieve an item missing from both lists?
misconception: The RRF rank constant is neither the number of returned results nor a similarity threshold.
---

## Answer

C receives `1/61 + 1/64`, approximately 0.032018. B receives `1/61`, approximately
0.016393. C ranks first because it appears in both lists. Use one-based ranks and
merge by stable identity; missing-list contributions are zero.

### Supporting reasoning

RRF sums reciprocal rank contributions, not raw retrieval scores. Candidate depth
and the final cutoff still matter. A candidate absent from every input list cannot
be created by this merge rule.

### Evaluation rubric

One point each: correct rank formula; C value; B value and winner; identity or
candidate-coverage qualification.
