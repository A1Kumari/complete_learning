---
id: ai-framework-workflow-control
kind: question
topicId: ai-agent-frameworks
lessonId: lesson-ai-workflow-abstractions
prompt: Does rewriting a deterministic retrieve-and-answer function as graph nodes make it a model-directed agent?
difficulty: easy
status: published
revision: 1
order: 1180
tags: [agent-frameworks, workflows]
conceptIds: [concept-workflow-abstractions]
followUps:
  - What would actually change who selects the next step?
  - Can an agent be one bounded node inside a larger deterministic workflow?
misconception: Framework vocabulary does not determine whether execution paths are selected by code or by a model.
---

## Answer

No. If code still defines the sequence and branch conditions, it remains a fixed
workflow. It becomes model-directed where a model proposes the next action based
on observations, subject to the controller's execution limits and permissions.

### Supporting reasoning

Graph representation can improve state visibility and recovery without adding
autonomy. A graph can combine deterministic stages with a bounded agent node;
these are compatible design choices.

### Evaluation rubric

One point each: rejects naming-based distinction; code-defined path; model-driven
next action; bounded composition qualification.
