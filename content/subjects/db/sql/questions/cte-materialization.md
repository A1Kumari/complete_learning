---
id: db-sql-cte-materialization
kind: question
topicId: db-sql
lessonId: lesson-db-sql-advanced
prompt: "Does writing a CTE guarantee that its result is materialized once?"
difficulty: medium
frequent: false
status: published
revision: 1
order: 70
tags: [sql, cte, query-plans]
---

## Answer

No. A CTE names a query within a statement; the optimizer may inline or materialize it according to the database, version, query, and available hints. Use CTEs for clear expression and inspect the actual plan when performance or repeated evaluation matters.
