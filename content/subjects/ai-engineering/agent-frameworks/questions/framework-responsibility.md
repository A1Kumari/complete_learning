---
id: ai-framework-responsibility
kind: question
topicId: ai-agent-frameworks
lessonId: lesson-ai-workflow-abstractions
prompt: Which responsibilities should remain explicit when adopting an agent framework, even if it provides tool dispatch, state, and tracing?
difficulty: medium
status: published
revision: 1
order: 1190
tags: [agent-frameworks, architecture]
conceptIds: [concept-workflow-abstractions]
followUps:
  - What is the value of retaining a plain-Python baseline?
  - Does a session history automatically provide resumable workflow state?
misconception: A framework cannot infer an application's authorization, business rules, or correct completion criteria.
---

## Answer

Keep domain schemas, trusted identity and resource authorization, budgets, scoped
approvals, task acceptance, and external-effect idempotency/reconciliation explicit.
Understand the chosen persistence backend and deployment guarantees instead of
assuming state or tracing supplies durability.

### Supporting reasoning

A runtime can automate mechanics but cannot know who may refund an order or what
counts as complete evidence. A plain baseline helps compare quality, debug effort,
recovery behavior, and operating cost rather than only abstraction line count.

### Evaluation rubric

One point each: domain authorization; acceptance/budgets; effect correctness;
persistence or baseline-comparison qualification.
