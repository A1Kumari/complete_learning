---
id: ai-output-recovery-commit-boundary
kind: question
topicId: ai-structured-output
lessonId: lesson-ai-output-recovery
prompt: Why must bounded generation recovery be separated from committing a business action?
difficulty: hard
status: published
revision: 1
order: 660
tags: [structured-output, idempotency, reliability]
conceptIds: [concept-output-recovery]
followUps:
  - What if an accepted order was written but its response was lost?
  - How do an attempt cap and an overall deadline differ?
misconception: A valid object or model request ID does not make business side effects idempotent.
---

## Answer

Recovery produces an accepted candidate, not permission to repeat side effects.
Commit only after authorization and durable business-operation deduplication;
reconcile a lost response against stored operation state before reissuing a write.

### Supporting reasoning

Repeated generations can change values or request IDs for the same intended action.
Attempts bound call count; deadlines bound elapsed time across queuing, calls,
validation, and tools. Both matter independently.

### Evaluation rubric

One point each: acceptance/commit distinction; authorization; durable deduplication
and reconciliation; attempt/deadline reasoning.
