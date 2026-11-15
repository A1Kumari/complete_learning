---
id: db-transactions-serializable-retry
kind: question
topicId: db-transactions
lessonId: lesson-db-transactions
prompt: "Why must an application using serializable transactions still handle retries?"
difficulty: medium
frequent: true
status: published
revision: 1
order: 20
tags: [transactions, serializability]
---

## Answer

Some serializable implementations detect a conflict and abort a transaction rather than making all transactions wait. The application should roll back and retry the entire transaction from a fresh snapshot with a bounded policy. Ensure any external side effects are coordinated or idempotent so a retry does not duplicate them.
