---
id: ai-framework-wrapped-retries
kind: question
topicId: ai-agent-frameworks
lessonId: lesson-ai-langchain-composition
prompt: Why is adding a retry wrapper around an entire runnable workflow different from retrying one pure retrieval step?
difficulty: hard
status: published
revision: 1
order: 1210
tags: [agent-frameworks, langchain, retries]
conceptIds: [concept-langchain-composition]
followUps:
  - Can tracing make a repeated external write atomic?
  - What must be reviewed when a fixed pipeline is replaced by create_agent?
misconception: A convenient retry abstraction does not make every wrapped operation safe to repeat.
---

## Answer

A whole-workflow retry can repeat previously successful steps and external effects.
A pure read usually has different replay implications from a write with an unknown
outcome. Scope retries by failure type and operation semantics, preserving stable
IDs and reconciling writes at the effect boundary.

### Supporting reasoning

Callbacks and tracing provide visibility, not atomicity. A higher-level agent loop
also introduces model-selected actions and repeated turns, so its budgets,
permissions, completion checks, and actual provider behavior need evaluation.

### Evaluation rubric

One point each: retry scope; pure-versus-effect distinction; idempotency/reconciliation;
tracing or agent-loop qualification.
