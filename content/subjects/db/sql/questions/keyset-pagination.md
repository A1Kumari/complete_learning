---
id: db-sql-keyset-pagination
kind: question
topicId: db-sql
lessonId: lesson-db-sql-advanced
prompt: "How does keyset pagination work for an ordering by created_at and id?"
difficulty: medium
frequent: true
status: published
revision: 1
order: 80
tags: [sql, pagination]
---

## Answer

Remember the last row's `(created_at, id)` and request rows with a greater timestamp or the same timestamp and greater ID, ordered by those columns with a limit. A matching composite index can help avoid scanning a large offset. A unique tie-breaker ensures a total order; use a suitable snapshot if pages must reflect one consistent database state.
