---
id: db-transactions-mvcc-locks
kind: question
topicId: db-transactions
lessonId: lesson-db-transactions
prompt: "Does MVCC mean a database never takes locks?"
difficulty: medium
frequent: true
status: published
revision: 1
order: 30
tags: [mvcc, locks]
---

## Answer

No. MVCC can give ordinary readers a consistent version without blocking writers, but concurrent writers may block one another and explicit locking reads acquire locks. Details vary by engine and isolation level. Old versions also require cleanup and long-lived transactions can delay it.
