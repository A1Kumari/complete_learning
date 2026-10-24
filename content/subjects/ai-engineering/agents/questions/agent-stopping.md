---
id: ai-agent-stopping
kind: question
topicId: ai-agents
lessonId: lesson-ai-agent-loop
prompt: An agent repeatedly requests the same policy and eventually says done. Which controls and evidence should determine the outcome?
difficulty: hard
status: published
revision: 1
order: 1110
tags: [agents, budgets, completion]
conceptIds: [concept-agent-loop]
followUps:
  - When can repeating an identical read be reasonable?
  - Does a successful last tool call imply the overall task completed before its deadline?
misconception: A step limit or a model saying done is not proof of successful task completion.
---

## Answer

Enforce hard turn/tool/time/cost limits and a declared repetition/no-progress policy.
Validate completion against the task's required observations or receipts. Preserve
statuses such as repeated action, exhausted budget, or unsupported finish instead
of reporting every termination as success.

### Supporting reasoning

A final generation turn can still be missing after a successful read. Repeated
reads can be useful when an external resource changed, so compare normalized
arguments and observation versions where appropriate.

### Evaluation rubric

One point each: hard budgets; repetition/progress control; task-specific completion;
explicit non-success outcomes or version-aware repetition.
