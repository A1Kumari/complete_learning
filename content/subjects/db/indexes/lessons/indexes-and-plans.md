---
id: lesson-db-indexes
kind: lesson
topicId: db-indexes
title: Indexes and query-plan diagnosis
summary: Understand B-tree access, composite indexes, query selectivity, and an evidence-driven approach to slow SQL.
difficulty: medium
status: published
revision: 1
order: 10
tags: [indexes, query-plans, performance]
prerequisiteIds: [lesson-db-sql-querying]
relatedIds: [db-q033, db-q034, db-q035, db-q036, db-q037, db-q038, db-q046]
---

## What an index buys

An index is an additional access structure maintained alongside table data. A B-tree-family index keeps keys ordered in a balanced, high-fanout tree, allowing efficient equality lookups and range scans. Engines differ in their page layouts and row locators. A hash index supports equality in systems that implement it, but does not provide B-tree ordering for range scans. Both have storage and write-maintenance costs.

An index is not always faster: reading most of a small table sequentially can cost less than many scattered lookups. A covering index contains the values needed by a query, but an index-only scan may still need table visits for visibility checks depending on the DBMS and state of the data.

## Composite index example

Suppose a large `orders` table is queried by customer and time:

```sql
SELECT order_id, created_at, total
FROM orders
WHERE customer_id = 12 AND created_at >= '2025-01-01'
ORDER BY created_at, order_id;
```

An index beginning with `(customer_id, created_at, order_id)` is a plausible candidate: equality narrows to one customer, then the time range is ordered with a tie-breaker. Whether it avoids sorting or table lookups depends on the engine, included columns, sort directions, and plan. Index choice is workload-specific: a separate query filtering only by date may need a different access path. Some optimizers can use skip scans or other strategies even without a leading-column filter, so the leftmost-prefix rule is a guideline, not a universal prohibition.

Adding `total` as an included or indexed column may enable covering access in a particular DBMS, but increases index size and write cost. The most selective column is not automatically the best first column; consider equality and range predicates, ordering, joins, and other queries.

## Read a plan, then measure

1. Capture the actual query, parameters, data volume, frequency, and latency. Establish a baseline and identify whether the bottleneck is database execution, waiting, network, or application processing.
2. Inspect `EXPLAIN`; where safe, use the engine's runtime analysis option to compare estimated and actual row counts and timings. Some forms of `EXPLAIN ANALYZE` execute the statement, including modifications.
3. Look for misestimated cardinalities, expensive joins or sorts, repeated loops, excessive I/O, and lock waits. A sequential scan is not automatically a problem.
4. Check statistics and predicate shape; for a timestamp use a half-open range such as `created_at >= start AND created_at < end` when it matches the requirement. Expression indexes may support functions where ordinary indexes do not.
5. Change one thing, test with representative data and parameters, and measure read and write impact. Avoid adding every possible index.

## Application query patterns

The N+1 problem occurs when one query fetches N parents and then N additional queries fetch their children. Batch the children or use an appropriate eager-loading strategy. A single join is not always ideal: multiple one-to-many joins can multiply rows and transfer excessive data. Connection pooling reduces connection setup, but an oversized pool can increase contention rather than throughput.

## Review

Why might an indexed query still scan the table? The optimizer may estimate a scan is cheaper. Does a correlated subquery necessarily execute once per outer row? No; optimizers may transform it. Are indexes free for writes? No; affected index entries must be maintained.

## Further reading

- [PostgreSQL indexes](https://www.postgresql.org/docs/current/indexes.html)
- [PostgreSQL EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)
