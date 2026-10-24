---
id: ai-agent-workflow-distinction
kind: question
topicId: ai-agents
lessonId: lesson-ai-agent-loop
prompt: What distinguishes a model-directed tool-use agent from a fixed retrieve-then-answer workflow, and who executes the actions?
difficulty: medium
frequent: true
status: published
revision: 1
order: 1100
tags: [agents, workflows, tools]
conceptIds: [concept-agent-loop]
followUps:
  - Can a deterministic graph contain a model-directed agent node?
  - When might a fixed workflow be preferable?
misconception: A model's tool proposal or generated plan is not an executed operation.
---

## Answer

In a model-directed agent, the model proposes the next action based on observations;
a fixed workflow follows code-defined paths. The application controller validates,
authorizes, and executes tool actions, then returns observations to the model.

### Supporting reasoning

Plans record intended work, while observations and receipts establish what occurred.
Autonomy can help discovery-heavy tasks but adds cost and failure opportunities.
A short policy lookup may be better served by a bounded two-step RAG workflow.

### Evaluation rubric

One point each: next-step control distinction; application execution boundary;
plan-versus-observation distinction; task-dependent trade-off.
