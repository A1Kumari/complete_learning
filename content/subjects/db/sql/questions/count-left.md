---
id: db-sql-count-left
kind: question
topicId: db-sql
lessonId: lesson-db-sql-querying
prompt: "For a course with no students in a LEFT JOIN, why can COUNT(*) be 1 while COUNT(student_id) is 0?"
difficulty: medium
frequent: true
status: published
revision: 1
order: 20
tags: [sql, aggregation, joins]
---

## Answer

The outer join creates one NULL-extended row for the unmatched course. `COUNT(*)` counts that row; `COUNT(student_id)` ignores its NULL value. This assumes a matched enrollment's student ID cannot itself be NULL.
