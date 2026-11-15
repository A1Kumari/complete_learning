---
id: python-async-taskgroup-cancellation
kind: question
topicId: python-async
lessonId: lesson-python-async
prompt: What happens when a child task fails in an asyncio TaskGroup?
difficulty: hard
status: published
revision: 1
order: 140
tags: [python, asyncio]
---

## Answer

For a non-cancellation failure, the task group cancels remaining children and waits for their cleanup before propagating failures, generally in an exception group. Coroutines should use `finally` for cleanup and normally propagate cancellation.
