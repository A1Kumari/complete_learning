---
id: db-transactions-write-skew
kind: question
topicId: db-transactions
lessonId: lesson-db-transactions
prompt: "What is write skew? Give an example where two transactions update different rows."
difficulty: hard
frequent: true
status: published
revision: 1
order: 10
tags: [transactions, isolation]
---

## Answer

Two transactions read a shared condition and each updates a different row, jointly violating an invariant. For example, each of two on-call doctors sees the other on call and goes off call; both changes can commit under snapshot isolation, leaving nobody available. Serializable isolation with whole-transaction retries or a correctly designed common lock can protect the invariant.
