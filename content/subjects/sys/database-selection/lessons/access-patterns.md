---
id: lesson-sys-database-selection
kind: lesson
topicId: system-design-database-selection
title: Select storage from access patterns and invariants
summary: Compare relational, key-value, document, wide-column, search, and analytical stores without relying on SQL-versus-NoSQL stereotypes.
difficulty: medium
status: published
revision: 1
order: 100
tags: [system-design, databases, data-modeling]
prerequisiteIds: [lesson-sys-foundations, lesson-sys-capacity-estimation]
---

## Write the queries first

Before naming a database, list operations, keys, result sizes, consistency needs, retention, and expected scale. “Store orders” is too vague. “Fetch the latest 20 orders for one customer, retrieve one order by ID, and prevent duplicate external payment references” is actionable.

Identify invariants such as nonnegative stock, unique usernames, and balanced ledger entries. Then ask whether they fit within one record, one transaction, or multiple independently owned stores. Database selection must support these boundaries.

## Match the data structure to the workload

| Store family | Strong fit | Questions to ask |
| --- | --- | --- |
| Relational | Transactions, constraints, joins, evolving queries | Indexes, isolation, connection budget, partitioning |
| Key-value | Lookups by stable key, sessions, counters | Atomic operations, item size, hot keys, durability |
| Document | Aggregate-shaped records read together | Update conflicts, indexing, transaction scope |
| Wide-column | High-volume writes and partition-local queries | Partition key, clustering order, large partitions |
| Search index | Text retrieval, ranking, facets | Index lag, relevance, rebuilds, authorization |
| Columnar analytical | Large aggregations across many rows | Ingestion lag, scan cost, not point-update latency |
| Object storage | Large immutable blobs | Metadata ownership, lifecycle, signed access |

SQL does not imply single-machine-only, and NoSQL does not imply no transactions or unlimited scale. Modern systems overlap. Compare concrete guarantees and operating costs of the selected product and configuration.

## Example: an order service

```text
customers(id, ...)
orders(id, customer_id, state, created_at, total_minor_units)
order_items(order_id, product_id, quantity, price_minor_units)
payment_attempts(id, order_id, provider_reference UNIQUE, state)
```

Create an index on `(customer_id, created_at DESC, id DESC)` for order history. Keep money in an exact representation with an explicit currency. Use foreign keys and checks where appropriate. A transaction can create an order and its items atomically; an external payment call remains a separate failure boundary.

Use object storage for invoices, a search index for product discovery, and a relational store for orders only if each solves a real requirement. Every extra datastore adds backup, schema evolution, access control, reconciliation, and monitoring work. Begin with fewer technologies when one store can meet the workload.

## Primary and derived stores

Declare one authoritative owner for each fact. A search result may be a delayed projection of the product database. A cache is not the canonical inventory count. When a derived store is lost, define how to rebuild it, which events or snapshots are needed, and what reads do during reconstruction.

For search results requiring current permissions, apply eligibility controls in retrieval and verify sensitive decisions against the authoritative policy as needed. Index lag must not silently turn into unauthorized access.

## Evaluate rather than guess

Benchmark realistic data volume, key skew, read/write ratio, indexes, failure modes, and p95/p99 latency. Include operational staffing and managed-service costs. Consider how you will migrate if the first choice stops fitting: stable IDs, an outbox or CDC path, backfill, verification, and staged cutover are often more valuable than premature polyglot storage.

**Exercise:** Choose primary and derived stores for a marketplace. Explain where orders, product search, photographs, session state, and weekly revenue reports live, and how you recover each one.
