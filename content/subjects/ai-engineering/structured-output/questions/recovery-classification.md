---
id: ai-output-recovery-classification
kind: question
topicId: ai-structured-output
lessonId: lesson-ai-output-recovery
prompt: Which output failures should trigger validation repair, and which require another outcome?
difficulty: medium
status: published
revision: 1
order: 650
tags: [structured-output, retries, reliability]
conceptIds: [concept-output-recovery]
followUps:
  - Why should an intentionally null answer not automatically be retried?
  - Is a transport exception a structural validation error?
misconception: Every failure should not be converted into another generation attempt.
---

## Answer

Retry a correctable structural error only under a bounded declared policy. Handle
refusal, incomplete generation, transport failure, and unsupported semantics as
distinct outcomes. Missing evidence may need retrieval or review, not formatting repair.

### Supporting reasoning

The lesson retries a mistyped count, stops on refusal/incomplete, and routes a typed
but unsupported count to review. Re-run all checks after repair and preserve source
evidence rather than changing it to match the candidate.

### Evaluation rubric

One point each: failure taxonomy; bounded structural repair; semantic/evidence
distinction; independent transport/refusal handling.
