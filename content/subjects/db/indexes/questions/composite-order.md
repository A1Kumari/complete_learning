---
id: db-indexes-composite-order
kind: question
topicId: db-indexes
lessonId: lesson-db-indexes
prompt: "How would you choose a composite index for orders filtered by customer and date and sorted by date?"
difficulty: medium
frequent: true
status: published
revision: 1
order: 10
tags: [indexes, query-plans]
---

## Answer

An index beginning `(customer_id, created_at)` is a reasonable candidate: customer equality narrows the index range and the following date supports the range and ordering. Add a tie-breaker or covering columns only if the workload and DBMS justify them. Inspect the plan and measure write and storage costs rather than assuming the most selective column must always come first.
