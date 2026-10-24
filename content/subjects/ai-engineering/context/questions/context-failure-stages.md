---
id: ai-context-failure-stage-diagnosis
kind: question
topicId: ai-context-engineering
lessonId: lesson-ai-context-evaluation
prompt: How do you distinguish context omission from evidence-use failure?
difficulty: medium
status: published
revision: 1
order: 600
tags: [context-engineering, observability, evaluation]
conceptIds: [concept-context-evaluation]
followUps:
  - What should a context manifest record?
  - Can a packed passage be present but missing its crucial exception?
misconception: A wrong final answer alone does not identify which pipeline stage failed.
---

## Answer

Inspect whether eligible relevant evidence was retrieved and packed completely.
If absent, diagnose retrieval/selection/assembly. If present, current, and sufficient
but misused, investigate evidence use and output acceptance.

### Supporting reasoning

Record source IDs/revisions, drop reasons, counts, and configuration safely.
Presence alone is not enough: a clipped exception or ambiguous source can make
the packed evidence insufficient. Do not infer a precise model cause from one failure.

### Evaluation rubric

One point each: manifest inspection; omission distinction; completeness/scope
qualification; controlled investigation rather than blame from aggregate accuracy.
