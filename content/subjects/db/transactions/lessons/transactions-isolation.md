---
id: lesson-db-transactions
kind: lesson
topicId: db-transactions
title: Transactions, isolation, and concurrency control
summary: Trace concurrent transactions, understand ACID and isolation anomalies, and choose locking or retries for invariants.
difficulty: hard
status: published
revision: 1
order: 10
tags: [transactions, isolation, mvcc]
prerequisiteIds: [lesson-db-sql-querying]
relatedIds: [db-q003, db-q026, db-q027, db-q028, db-q029, db-q030, db-q031, db-q032]
---

## ACID and a transfer

A transaction groups database operations into one logical unit. A transfer debits one account and credits another, checks required conditions, and commits only when all steps succeed. On failure, roll back the transaction. The exact SQL, error handling, and concurrency guarantees depend on the engine.

- **Atomicity:** the transaction's effects are committed together or not committed.
- **Consistency:** a correctly designed transaction takes valid data to valid data, preserving declared and application invariants. The DBMS cannot automatically enforce every business rule.
- **Isolation:** concurrent execution has the guarantees of the configured isolation level; weaker levels allow certain anomalies.
- **Durability:** committed effects survive failures within the system's stated durability guarantees. Logging, synchronization settings, replication, and hardware matter.

Atomicity does not automatically roll back an email or external payment already sent. Use an outbox or another explicit coordination strategy for external side effects.

## Observe anomalies

| Anomaly | Example |
| --- | --- |
| Dirty read | T2 reads T1's uncommitted update; T1 rolls back. |
| Non-repeatable read | T1 reads a row twice while T2 commits a change; T1 sees different values. |
| Phantom | Repeating a predicate query produces a different set of matching rows after another transaction's changes. |
| Lost update | Two transactions derive writes from the same old value and one overwrites the other's intended change. |
| Write skew | Two transactions read a shared condition, then change different rows, jointly violating an invariant. |

For write skew, two doctors are on call and each transaction sees both. T1 takes doctor A off call; T2 takes B off call; both commit under snapshot-style isolation that permits this pattern. Each writes a different row, yet nobody remains on call. A row-level check on only the updated row does not protect the cross-row invariant.

## Isolation levels and snapshots

The SQL standard's named levels describe guarantees in terms of phenomena, but actual engines differ. Read uncommitted may permit dirty reads; read committed prevents them but repeated statements can see new commits. Repeatable read prevents non-repeatable reads by the standard's definition, while phantom and other behavior depends on the implementation. Serializable requires outcomes equivalent to some serial execution of committed transactions, not necessarily literal one-at-a-time execution. It may block or abort a transaction, so applications must retry appropriately.

For example, PostgreSQL's read committed normally uses a fresh snapshot per statement; its repeatable read uses a transaction snapshot and prevents phantom reads but can still allow serialization anomalies such as write skew. PostgreSQL serializable detects dangerous dependencies and may return a serialization failure. Other engines and locking reads behave differently; check the chosen product's documentation.

## Locks, MVCC, and deadlocks

MVCC retains versions so a consistent read can often proceed while another transaction writes. It is not universally lock-free: writers can block each other, explicit locking reads acquire locks, and behavior varies by engine. Old versions require cleanup and long transactions can delay reclamation.

Shared and exclusive locks coordinate access, but MVCC readers need not block on an exclusive row lock in every DBMS. In two-phase locking a transaction acquires locks during a growing phase and acquires no new locks after entering the shrinking phase. Strict variants retain write locks until transaction end. Locking can deadlock: T1 holds A and wants B while T2 holds B and wants A. The DBMS may abort a victim; retry the whole transaction after rollback with a bounded policy. Consistent lock ordering and short transactions reduce risk, but do not remove the need for error handling.

## Protect the actual invariant

For an inventory count, a single guarded update can combine the check and write:

```sql
UPDATE inventory
SET quantity = quantity - 1
WHERE product_id = 42 AND quantity > 0;
```

Check the affected-row count: one row means a unit was reserved, zero means no matching available item. A separate read followed by an unconditional write is vulnerable to concurrent changes. For cross-row rules such as on-call coverage, use a suitable serializable transaction with retries, a lockable common parent row, or another correctly designed enforcement mechanism. Verify actual engine semantics.

## Review

Does ACID isolation always mean serializable? No. Can MVCC prevent every anomaly? No. Can a serializable transaction fail under contention? Yes; retrying the complete transaction is part of the design.

## Further reading

- [PostgreSQL transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)
- [PostgreSQL explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)
