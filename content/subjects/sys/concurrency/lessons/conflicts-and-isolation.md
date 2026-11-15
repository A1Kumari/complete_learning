---
id: lesson-sys-concurrency
kind: lesson
topicId: system-design-concurrency
title: Prevent lost updates, overselling, and write skew
summary: Use atomic updates, optimistic versions, row locks, constraints, and serializable isolation to enforce explicit invariants.
difficulty: hard
status: published
revision: 1
order: 160
tags: [system-design, concurrency, transactions]
prerequisiteIds: [lesson-sys-database-selection, lesson-sys-consistency]
---

## Read-modify-write can lose work

Two requests read stock=1. Both independently decide an item is available and save stock=0. The final count looks valid, but two orders were accepted for one item. Protect the decision and update together rather than validating only in application memory.

For one-row inventory, an atomic conditional update is a strong starting point:

```sql
UPDATE inventory
SET available = available - 1
WHERE product_id = :product_id AND available > 0
RETURNING available;
```

One returned row means the reservation succeeded; no row means unavailable or missing. Keep the related reservation record in the same transaction. Ensure every writer follows the invariant, and use constraints as another layer of protection.

## Optimistic concurrency control

Store a version with the entity. A client reads version 7 and submits an update conditional on that version:

```sql
UPDATE documents
SET body = :new_body, version = version + 1
WHERE id = :id AND version = :expected_version;
```

If zero rows changed, the version is stale or the entity is absent. Reload and decide whether to merge, reject, or retry the whole business operation. Blindly repeating the same stale replacement defeats conflict detection. Optimistic control works well when conflicts are uncommon and retry cost is acceptable.

## Pessimistic locking

`SELECT ... FOR UPDATE` can lock rows while a short transaction checks and updates them. This is useful when conflicts are frequent or several related updates must be coordinated. Acquire locks in a stable order, use timeouts, and retry aborted transactions where appropriate.

Do not hold a row lock while waiting for user input or an external API. Locks protect database work; they do not make a remote side effect atomic. An in-process mutex only protects one process and cannot coordinate a fleet of application instances.

## Isolation has product consequences

- **Read committed:** Typically prevents dirty reads; successive statements can observe different committed states.
- **Repeatable read / snapshot isolation:** Provides a stable snapshot in many implementations, but can permit write skew.
- **Serializable:** Committed transactions behave like a serial execution, potentially by aborting conflicting transactions that callers must retry.

Exact behavior depends on the database. In PostgreSQL, repeatable read prevents phantom reads but can still allow serialization anomalies. Two on-call doctors can each see the other as available and independently go off duty; they update different rows, so simple per-row version checks do not enforce “at least one doctor remains.” Use an appropriate serializable transaction or a correctly scoped locking protocol.

## Constraints and idempotency complete the picture

A unique constraint on `(user_id, event_id)` can prevent duplicate registrations even when two requests race. Checking existence and then inserting without a constraint is not sufficient. Catch constraint violations and map them to a defined outcome.

Idempotency prevents duplicate effects for one logical request. Isolation prevents conflicting independent requests from violating invariants. They solve different problems and are often both required.

**Exercise:** Model a seat hold with an expiry and confirmation. Show how confirmation and expiration compete safely without issuing the same seat twice.

Reference: [PostgreSQL transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html).
