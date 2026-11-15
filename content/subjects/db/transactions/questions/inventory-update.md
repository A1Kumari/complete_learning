---
id: db-transactions-inventory-update
kind: question
topicId: db-transactions
lessonId: lesson-db-transactions
prompt: "How can a single SQL update prevent an inventory count from going below zero under concurrent orders?"
difficulty: medium
frequent: true
status: published
revision: 1
order: 40
tags: [transactions, concurrency]
---

## Answer

Use a guarded update such as `UPDATE inventory SET quantity = quantity - 1 WHERE product_id = 42 AND quantity > 0`, and check that exactly one row was affected. The database coordinates the update according to its concurrency semantics, combining the check with the write. Include related order changes in the same transaction and handle errors and retries as required by the engine.
