---
id: lesson-sys-sharding
kind: lesson
topicId: system-design-sharding
title: Partition data with good keys and a migration plan
summary: Choose hash, range, or directory partitioning, diagnose skew, handle cross-shard work, and rebalance with versioned ownership.
difficulty: hard
status: published
revision: 1
order: 120
tags: [system-design, sharding, databases]
prerequisiteIds: [lesson-sys-database-selection, lesson-sys-consistent-hashing]
---

## Partitioning and sharding

Partitioning splits a dataset into subsets. It can occur within one server or across servers. Sharding commonly refers to distributing horizontal partitions across independently hosted storage nodes. Replication creates copies; sharding creates ownership subsets. A production shard often has its own replicas.

The purpose may be to increase write throughput, fit a dataset, isolate tenants, or improve locality. Sharding adds routing, cross-partition query costs, uneven load, and operational complexity, so first identify the limit it addresses.

## Select a partition key from access patterns

| Scheme | Benefit | Risk |
| --- | --- | --- |
| Hash of key | Distributes many independent keys | Range scans fan out |
| Range of key | Efficient ordered scans | Sequential writes can hit the newest range |
| Directory mapping | Flexible tenant or range placement | Directory availability and metadata consistency |

For chat, a conversation key keeps message history together but a massive group can become hot. For a multi-tenant product, tenant ID offers isolation and local transactions, but one huge tenant may outgrow a shard. Time buckets can bound partition size, at the cost of querying multiple buckets for history.

Do not choose only for evenly distributed bytes. Evaluate request rate, write amplification, object size, and growth. A popular celebrity can cause a hot partition even if it stores few records.

## Cross-shard work changes the API

An order lookup by order ID can route directly if the routing scheme is known. Listing all recent orders across tenants may need fan-out and merge or a separate read model. Cross-shard joins are possible in some databases, but can require expensive network exchange; they are not categorically impossible.

Choose transaction boundaries deliberately. Co-locating one customer's orders can simplify customer-scoped operations, while transfers between customers may need a distributed transaction or a workflow with compensations. Secondary indexes can be local per shard or global, with different write and consistency costs.

## Rebalancing without losing writes

```text
1. Allocate destination shard and register migration state.
2. Copy an initial snapshot from source.
3. Stream or replay changes made during the copy.
4. Verify destination is caught up.
5. Change ownership using a versioned routing epoch.
6. Reject or forward stale-epoch requests safely.
7. Retain source temporarily, then retire it after verification.
```

This is a conceptual protocol, not a complete implementation. The design must prevent writes from being lost between snapshot and cutover and avoid two independent owners acknowledging conflicting writes. Dual writing from the application without a recovery protocol introduces another partial-failure problem.

Keep migrations resumable and rate-limited. Verify row counts, checksums or application invariants, and request correctness. A rollback must account for writes already accepted at the destination.

## Practice the trade-off

**Exercise:** Design storage for user activity with 90-day retention. Compare `user_id`, `(user_id, month)`, and a hash of event ID. Discuss one-user history queries, global analytics, deletion, large users, and retention cleanup. A strong answer may use a user-local primary store and a separate analytical projection instead of forcing every query through one partitioning scheme.
