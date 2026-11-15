---
id: lesson-db-sql-querying
kind: lesson
topicId: db-sql
title: SQL querying, joins, and NULL
summary: Learn SQL's logical query processing, join cardinality, three-valued logic, and safe aggregation with worked examples.
difficulty: medium
status: published
revision: 1
order: 10
tags: [sql, joins, aggregation]
prerequisiteIds: [lesson-db-relational-model]
relatedIds: [db-q007, db-q010, db-q011, db-q012, db-q013, db-q014, db-q015, db-q017, db-q025]
---

## Query the data as sets of rows

Use the student, course, and enrollment tables from the modeling lesson. SQL is declarative: specify the result, while the optimizer chooses a physical plan. A useful **logical** model for a simple query is `FROM` and joins, `WHERE`, grouping and aggregates, `HAVING`, select expressions, `DISTINCT`, `ORDER BY`, then `LIMIT`. Actual execution can be reordered while preserving semantics; dialects have additional rules.

```sql
SELECT course_id, COUNT(*) AS enrollment_count
FROM enrollment
WHERE enrolled_on >= '2025-01-01'
GROUP BY course_id
HAVING COUNT(*) >= 2
ORDER BY enrollment_count DESC, course_id;
```

`WHERE` selects input rows before groups form; `HAVING` filters groups. The secondary sort makes ties deterministic. Without `ORDER BY`, neither insertion order nor index order is guaranteed.

## Join without losing or multiplying rows accidentally

An inner join returns matching pairs. A left join also returns each unmatched left row with NULLs in right-side columns. Multiple matches produce multiple output rows: joining a course with three enrollments produces three rows for that course. Joining two independent one-to-many relationships can multiply counts, so aggregate each side before joining when appropriate.

To list every course and count enrollments since 2025, including zero:

```sql
SELECT c.course_id, c.title, COUNT(e.student_id) AS recent_count
FROM course AS c
LEFT JOIN enrollment AS e
  ON e.course_id = c.course_id AND e.enrolled_on >= '2025-01-01'
GROUP BY c.course_id, c.title
ORDER BY c.course_id;
```

The date predicate is in `ON` so it controls matching while preserving unmatched courses. Putting it in `WHERE` rejects the NULL-extended rows. `COUNT(e.student_id)` counts only actual matches because this key is non-null; `COUNT(*)` would count the unmatched row as one.

## NULL and three-valued logic

Comparisons with NULL generally yield UNKNOWN. `WHERE` retains only TRUE, so use `IS NULL` or `IS NOT NULL`. `COUNT(*)` counts rows; `COUNT(column)` counts non-NULL values; `SUM` and `AVG` ignore NULL inputs. `COALESCE(value, fallback)` substitutes the first non-NULL argument, but using zero can change the meaning of an average or hide missing data.

Find courses with no enrollment using an anti-join:

```sql
SELECT c.course_id, c.title
FROM course AS c
WHERE NOT EXISTS (
  SELECT 1 FROM enrollment AS e WHERE e.course_id = c.course_id
);
```

`NOT IN` can yield UNKNOWN when the subquery contains NULL, so use `NOT EXISTS` when appropriate and reason explicitly about nullable outer values. `EXISTS` tests for a match without multiplying outer rows. An optimizer may transform subqueries into joins; do not assume a correlated subquery physically runs once per row.

## Set operations and modifications

`UNION ALL` preserves duplicate rows; `UNION` removes duplicate result rows. Use the semantics required by the question. `DELETE` removes selected rows; `DROP` removes an object. `TRUNCATE` removes all rows where supported, but logging, triggers, identity handling, locks, and rollback vary by database. Use transactions and test behavior on the target engine.

## Review

Why can a left join return more rows than its left table? A left row can match many right rows. Why does `WHERE right_column = 1` lose unmatched left rows? Their right column is NULL, making the predicate UNKNOWN. Why use a tie-breaker in ordering? Otherwise equal sort keys can appear in any order.

## Further reading

- [PostgreSQL table expressions](https://www.postgresql.org/docs/current/queries-table-expressions.html)
- [PostgreSQL comparison predicates](https://www.postgresql.org/docs/current/functions-comparison.html)
