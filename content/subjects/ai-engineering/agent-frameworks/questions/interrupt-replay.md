---
id: ai-framework-interrupt-replay
kind: question
topicId: ai-agent-frameworks
lessonId: lesson-ai-langgraph-execution
prompt: A LangGraph node sends a notification and then calls interrupt for approval. Why might the notification happen again after Command(resume=...) and what should change?
difficulty: hard
frequent: true
status: published
revision: 1
order: 1220
tags: [agent-frameworks, langgraph, replay]
conceptIds: [concept-langgraph-execution]
followUps:
  - Why should interrupt order remain stable inside a node?
  - Does moving a write to its own node alone guarantee exactly-once execution?
misconception: Dynamic interrupt resumption restarts the interrupted node rather than restoring the Python stack at the next line.
---

## Answer

The interrupted node restarts from its beginning on resume, so code before the
interrupt executes again. Avoid non-idempotent effects there; separate review and
effect stages and use a stable operation ID/deduplication contract for external
writes. Keep the interrupt outside broad exception handling that swallows it.

### Supporting reasoning

The saved resume value becomes the interrupt's return value during replay. A
separate node improves structure but still has a crash window between committing
an external effect and recording its checkpoint.

### Evaluation rubric

One point each: node restart semantics; duplicate-effect explanation; meaningful
restructuring; idempotency/crash-window or interrupt-signal qualification.
