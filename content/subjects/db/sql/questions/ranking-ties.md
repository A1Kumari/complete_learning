---
id: db-sql-ranking-ties
kind: question
topicId: db-sql
lessonId: lesson-db-sql-advanced
prompt: "For scores 90, 90, 80, what do ROW_NUMBER, RANK, and DENSE_RANK return?"
difficulty: medium
frequent: true
status: published
revision: 1
order: 50
tags: [sql, window-functions]
---

## Answer

Ordered descending by score, `ROW_NUMBER()` assigns 1, 2, 3, with the order of tied rows unspecified unless a tie-breaker is included. `RANK()` returns 1, 1, 3; `DENSE_RANK()` returns 1, 1, 2. Adding a unique tie-breaker to the ranking expression changes which rows are peers.
