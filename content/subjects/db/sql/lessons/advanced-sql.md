---
id: lesson-db-sql-advanced
kind: lesson
topicId: db-sql
title: Subqueries, window functions, and practical SQL patterns
summary: Use CTEs, ranking, running totals, and pagination while accounting for ties, window frames, and query semantics.
difficulty: medium
status: published
revision: 1
order: 20
tags: [sql, window-functions, cte]
prerequisiteIds: [lesson-db-sql-querying]
relatedIds: [db-q016, db-q018, db-q019, db-q020, db-q021, db-q022, db-q023, db-q024, db-q047]
---

## Groups versus windows

`GROUP BY` produces one result row per group. A window function calculates over related rows while retaining individual rows. `PARTITION BY` defines groups and `ORDER BY` defines their order. For salaries 90, 90, and 80, `RANK()` gives 1, 1, 3; `DENSE_RANK()` gives 1, 1, 2; `ROW_NUMBER()` assigns distinct numbers. Add a unique tie-breaker to `ROW_NUMBER()` when deterministic selection matters, but do not add it to the rank ordering if equal salaries must remain tied.

```sql
WITH ranked AS (
  SELECT employee_id, department_id, salary,
         ROW_NUMBER() OVER (
           PARTITION BY department_id ORDER BY salary DESC, employee_id
         ) AS position
  FROM employee
)
SELECT employee_id, department_id, salary
FROM ranked
WHERE position <= 2
ORDER BY department_id, position;
```

This returns at most two employees per department; it does not return every employee tied at the second salary. Use `DENSE_RANK()` ordered by salary alone for the top two distinct salary values. The outer query filters the computed window result. Some dialects offer `QUALIFY` as an alternative.

## Running totals and neighboring rows

```sql
SELECT account_id, transaction_id, occurred_at, amount,
       SUM(amount) OVER (
         PARTITION BY account_id ORDER BY occurred_at, transaction_id
         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
       ) AS running_balance,
       LAG(amount) OVER (
         PARTITION BY account_id ORDER BY occurred_at, transaction_id
       ) AS previous_amount
FROM ledger_entry
ORDER BY account_id, occurred_at, transaction_id;
```

The explicit `ROWS` frame expresses a row-by-row cumulative sum. Default window frames can include peers with equal ordering values and vary with syntax and engine; specify the frame when it matters. The ordering needs a stable unique tie-breaker for a reproducible sequence. `LAG` returns NULL at the start of a partition unless given a default.

## CTEs, recursion, and views

A common table expression names a query for readability within a statement. It is not universally materialized or automatically faster; optimizers and hints differ. A recursive CTE has an anchor and recursive step, and needs a termination strategy. Hierarchies can contain cycles, so depth limits alone may not represent correct cycle detection.

A view names a stored query; a materialized view stores results and needs a product-specific refresh strategy. Views can simplify access but require appropriate privileges and security settings; materialized data can be stale. Trigger and stored procedure behavior, including transaction control and side effects, differs across engines.

## Pagination and stable ordering

Offset pagination is simple, but large offsets may require processing many preceding rows and concurrent inserts can shift pages. Keyset pagination uses the last seen sort key. For ascending `(occurred_at, transaction_id)`, request rows with a later timestamp or the same timestamp and a larger ID, order by both, and apply a limit. A supporting composite index can help. A stable snapshot may still be needed if the application requires a consistent multi-page view.

## Review

Can a window function replace grouping? It answers a different question: it keeps rows. Why explicitly specify `ROWS`? To define how the cumulative frame handles rows and peers. Does a CTE promise a temporary table? No; execution depends on the optimizer and database.

## Further reading

- [PostgreSQL window functions](https://www.postgresql.org/docs/current/tutorial-window.html)
- [PostgreSQL WITH queries](https://www.postgresql.org/docs/current/queries-with.html)
