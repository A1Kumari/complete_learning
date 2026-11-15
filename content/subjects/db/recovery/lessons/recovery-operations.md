---
id: lesson-db-recovery
kind: lesson
topicId: db-recovery
title: Recovery, backups, and database operations
summary: Trace write-ahead logging and recovery, plan tested backups, and manage connection and security boundaries.
difficulty: medium
status: published
revision: 1
order: 10
tags: [recovery, backup, operations]
prerequisiteIds: [lesson-db-transactions]
relatedIds: [db-q003, db-q045, db-q048]
---

## Write-ahead logging

Data pages are often cached in memory and written to storage later. With write-ahead logging, the log information required to recover a change must reach durable storage before the corresponding modified data page is allowed to reach durable storage. For a durable commit, the relevant commit log records must also be flushed according to the engine's configured guarantees before success is acknowledged.

After a crash, recovery uses the log and a checkpoint to restore a consistent database state. Implementations vary: some redo committed changes and undo incomplete ones; others combine redo with version visibility or other mechanisms. A checkpoint limits recovery work; it is not itself a substitute for a backup. Disabled synchronous durability or storage that does not honor flushes changes the guarantees.

## Backups and restore objectives

A full backup captures a base. A differential backup generally contains changes since a base full backup; an incremental contains changes since an earlier backup in its chain. Exact definitions and restore procedures are product-specific. Point-in-time recovery combines a suitable base backup with a continuous sequence of archived logs to reach a chosen recovery point. Log gaps, expired backups, missing encryption keys, or incompatible versions can prevent restoration.

**RPO** is the maximum acceptable data loss measured in time; **RTO** is the maximum acceptable time to restore service. Set both with stakeholders, choose backup and log retention to meet them, and test full restores and point-in-time restores in an isolated environment. Measure the actual duration and verify data and application behavior. A successful backup job is not proof of a usable restore.

Replication is not a backup: accidental deletes and corruption can propagate to replicas, and replicas can share failure domains. Keep protected backups and test recovery independently.

## Connections and safe access

A connection pool reuses sessions and bounds concurrent database work. Size it across all application instances relative to database capacity; too many connections can amplify contention. Return connections reliably, end transactions promptly, set appropriate timeouts, and avoid returning a session with an open transaction or unexpected session settings. Monitor pool wait time, active connections, query latency, and database saturation together.

Use parameterized queries for values rather than string concatenation. Identifiers such as table names generally cannot be supplied as ordinary value parameters; choose them from a trusted allowlist or use the driver's safe identifier API. Give each application the minimum privileges needed and protect credentials, backups, and network connections.

## Review

If a primary and its replica both receive an accidental delete, what restores yesterday's data? A usable backup and logs or another independent historical recovery mechanism. Can a long-running transaction harm operations even while idle? Yes; it can retain locks or old versions depending on the engine.

## Further reading

- [PostgreSQL write-ahead logging](https://www.postgresql.org/docs/current/wal-intro.html)
- [PostgreSQL continuous archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)
