---
id: db-sql-not-in-null
kind: question
topicId: db-sql
lessonId: lesson-db-sql-querying
prompt: "Why can NOT IN return no rows when its subquery includes NULL?"
difficulty: medium
frequent: true
status: published
revision: 1
order: 30
tags: [sql, "null", subqueries]
---

## Answer

For a nonmatching value, comparison with the NULL member is UNKNOWN, so `NOT IN` can evaluate to UNKNOWN rather than TRUE. WHERE removes that row. `NOT EXISTS` with an explicit correlation is often a clearer anti-join, but consider nullable outer values and the desired matching semantics.
