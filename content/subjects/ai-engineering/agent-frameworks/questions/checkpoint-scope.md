---
id: ai-framework-checkpoint-scope
kind: question
topicId: ai-agent-frameworks
lessonId: lesson-ai-langgraph-execution
prompt: An interrupted graph uses InMemorySaver and a thread_id. Will it survive a process restart, and may anyone with that ID resume it?
difficulty: medium
status: published
revision: 1
order: 1230
tags: [agent-frameworks, langgraph, persistence]
conceptIds: [concept-langgraph-execution]
followUps:
  - How do a checkpointer and a cross-thread store differ?
  - What does TypedDict establish about untrusted runtime input?
misconception: A thread identifier selects state; it is not an authorization credential, and RAM storage is not restart-durable.
---

## Answer

No. InMemorySaver loses checkpoints on restart. Use an appropriate persistent
checkpointer and test deployed recovery behavior. The application must authenticate
and authorize access to the selected thread before resuming; knowing its ID is
insufficient.

### Supporting reasoning

Checkpointers track thread execution state, while stores can hold application data
across threads. Schema/version compatibility and retention matter for persistent
state. TypedDict annotations alone are not strict runtime validation or authorization.

### Evaluation rubric

One point each: RAM limitation; persistent backend/recovery requirement; independent
thread authorization; state-store or schema qualification.
