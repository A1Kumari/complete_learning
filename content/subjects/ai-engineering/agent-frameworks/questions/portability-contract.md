---
id: ai-framework-portability-contract
kind: question
topicId: ai-agent-frameworks
lessonId: lesson-ai-framework-portability
prompt: Two framework adapters return identical final text. What else must a portability test compare before declaring their behavior equivalent?
difficulty: hard
status: published
revision: 1
order: 1250
tags: [agent-frameworks, portability, evaluation]
conceptIds: [concept-framework-portability]
followUps:
  - Why should truncated output remain incomplete even if its text looks final?
  - Can deduplicating receipt IDs undo duplicate external effects?
misconception: Matching final prose does not establish matching execution semantics or effect correctness.
---

## Answer

Compare terminal statuses, evidence/source identities, tool proposals and actual
effect counts, permissions, approval outcomes, budgets, cancellation, and recovery
behavior. Include failure and replay fixtures plus persisted-state compatibility,
not just successful text output.

### Supporting reasoning

A truncated run may contain a plausible answer but lack completion. Two receipts
can represent one duplicate event or two actual writes; presentation deduplication
cannot reverse a duplicate effect. Normalize documented SDK events without hiding
meaningful failure distinctions.

### Evaluation rubric

One point each: terminal/failure semantics; effect and permission checks;
replay/persistence tests; normalization or duplicate-effect qualification.
