---
id: ai-retrieval-evaluation-slices
kind: question
topicId: ai-retrieval-systems
lessonId: lesson-ai-retrieval-evaluation
prompt: ANN agreement with exact vector neighbors is 99 percent, but users still get the wrong policies and error codes. What should the evaluation investigate?
difficulty: hard
status: published
revision: 1
order: 1010
tags: [retrieval, evaluation, failure-analysis]
conceptIds: [concept-retrieval-evaluation]
followUps:
  - How should queries with no relevant document be evaluated?
  - Why is treating all unjudged documents as nonrelevant potentially biased?
misconception: High ANN recall is not evidence that the underlying vector ranking satisfies the user's task.
---

## Answer

Evaluate against task relevance judgments, not only exact-vector IDs. Slice by
exact identifiers, paraphrases, tenant/date scope, language, and recent updates.
Trace eligibility, lexical/dense candidates, fusion truncation, reranking, and
source freshness to locate the failure.

### Supporting reasoning

The index may reproduce a poor vector metric perfectly. Missing candidates and
misordered candidates need different fixes. Declare policies for incomplete
judgments and no-answer queries, and keep final held-out queries separate from tuning.

### Evaluation rubric

One point each: ANN-versus-relevance distinction; meaningful query slices;
stage/freshness diagnosis; labeling or held-out-evaluation qualification.
