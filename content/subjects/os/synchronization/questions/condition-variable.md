---
id: os-sync-condition-loop
kind: question
topicId: os-synchronization
lessonId: lesson-os-synchronization
prompt: "Why should a condition-variable wait check its predicate in a loop?"
difficulty: medium
frequent: false
status: published
revision: 1
order: 10
tags: [concurrency, synchronization]
followUps:
  - "Which mutex must protect the predicate?"
---

## Answer

A wakeup only means the predicate may have changed, not that it is true when the thread reacquires the mutex. Wakeups can be spurious, and another thread may consume the resource first. Check the shared predicate under its associated mutex, wait while it is false, and recheck after each return from the wait.
