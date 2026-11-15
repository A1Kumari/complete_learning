---
id: db-sql-join-fanout
kind: question
topicId: db-sql
lessonId: lesson-db-sql-querying
prompt: "A customer has 3 orders and 4 support tickets. Why can joining both child tables produce 12 rows?"
difficulty: medium
frequent: false
status: published
revision: 1
order: 40
tags: [sql, joins, aggregation]
---

## Answer

Each of the three order rows can pair with each of the four ticket rows for that customer, producing 3 × 4 combinations. Aggregating after this join can inflate counts and sums. Aggregate each child relation by customer first, then join the aggregate results, or use another query shape matching the desired result.
