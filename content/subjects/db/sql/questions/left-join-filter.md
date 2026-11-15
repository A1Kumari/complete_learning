---
id: db-sql-left-join-filter
kind: question
topicId: db-sql
lessonId: lesson-db-sql-querying
prompt: "Why does filtering the right side of a LEFT JOIN in WHERE often remove unmatched rows?"
difficulty: medium
frequent: true
status: published
revision: 1
order: 10
tags: [sql, joins, "null"]
---

## Answer

Unmatched left rows receive NULL values for right-side columns. A predicate such as `WHERE r.status = 'active'` evaluates to UNKNOWN for those rows, and WHERE keeps only TRUE. Put the right-side matching condition in `ON` when all left rows must remain, and check whether that matches the intended business rule.
