---
id: lesson-db-distributed
kind: lesson
topicId: db-distributed
title: Replication, sharding, and database models
summary: Compare replication and partitioning, reason about stale reads and failures, and choose data models based on access patterns.
difficulty: hard
status: published
revision: 1
order: 10
tags: [replication, sharding, distributed-systems]
prerequisiteIds: [lesson-db-transactions, lesson-db-indexes]
relatedIds: [db-q039, db-q040, db-q041, db-q042, db-q043, db-q044, db-q049, db-q050]
---

## Replication: copies and tradeoffs

Replication maintains copies of data on multiple nodes. In a primary-replica configuration, the primary accepts writes and replicas apply changes. With asynchronous replication, a committed write may not yet be visible on a replica, and a failover can lose writes that never reached the promoted node. Synchronous acknowledgment can reduce certain loss windows but adds latency and depends on the exact acknowledgment and failure policy.

If a user saves a profile and immediately reads from a lagging replica, they may see an old version. Read from the primary, use a consistency token or wait for a replica to catch up where supported, or design the experience to tolerate staleness. Failover also needs leader election and fencing so an old primary cannot continue accepting conflicting writes. Replication alone does not ensure backups or zero downtime.

## Partitioning and sharding

Horizontal partitioning divides rows by a key such as date or tenant; vertical partitioning separates columns. A partitioned table can allow pruning when predicates identify relevant partitions, but a query that does not constrain the partition key may still scan many partitions. Partitioning may be local or distributed, depending on the product.

Sharding distributes data partitions across nodes. A tenant key can colocate tenant-specific data, but a large or busy tenant can become a hotspot. Hashing may distribute keys evenly but makes range queries harder; range partitioning makes ranges natural but can create hot partitions. Cross-shard joins, uniqueness, transactions, rebalancing, and failure handling add complexity. Distributed transactions are possible in some systems, with coordination costs; sharding does not inherently eliminate ACID.

## CAP and consistency

CAP concerns a distributed system facing a network partition: under the theorem's assumptions, it cannot guarantee both linearizable consistency and availability for every request while the partition persists. A system must choose how operations behave during that failure. This is not a permanent label for an entire product: topology, operation, and configuration matter. CAP consistency is different from ACID consistency, which concerns preservation of database invariants.

Eventual consistency means replicas converge if updates stop and communication resumes, under the system's assumptions; it does not promise a fixed convergence time or read-your-writes. Define the user-visible consistency requirement rather than relying on the label.

## Choose a model for the workload

Relational databases provide tables, constraints, joins, and often strong transaction support; they can also use JSON and distributed deployments. Document databases group data into documents and may support transactions and schema validation. Key-value systems favor key-based access; wide-column systems often organize data around partition keys and query patterns; graph systems emphasize relationships and traversals. Product capabilities vary, so neither “SQL always scales vertically” nor “NoSQL cannot be ACID” is a reliable rule.

OLTP workloads typically involve many short operational transactions; OLAP workloads often scan and aggregate large historical datasets. A star schema separates facts such as sales from dimensions such as time and product. Analytical data can be stale relative to the source depending on the ingestion pipeline. Choose storage and indexes based on query patterns, freshness, consistency, and operational requirements.

## Review

Is a replica automatically current after a primary commit? Not with asynchronous replication. Does sharding guarantee even load? No, a poor key or skewed traffic creates hotspots. Can a document database support transactions? Some do; verify the scope and guarantees of the chosen product.

## Further reading

- [PostgreSQL warm standby and replication](https://www.postgresql.org/docs/current/warm-standby.html)
- [Google Cloud on CAP theorem](https://cloud.google.com/learn/what-is-cap-theorem)
