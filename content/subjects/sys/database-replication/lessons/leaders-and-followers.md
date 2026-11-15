---
id: lesson-sys-database-replication
kind: lesson
topicId: system-design-database-replication
title: Replication, read freshness, and safe failover
summary: Understand acknowledgement points, asynchronous and synchronous replicas, session guarantees, promotion, and split-brain prevention.
difficulty: hard
status: published
revision: 1
order: 110
tags: [system-design, replication, databases]
prerequisiteIds: [lesson-sys-database-selection]
---

## Replication copies state; it does not distribute all writes

In a leader-follower architecture, the leader accepts writes and sends log records or state changes to followers. Followers can serve reads, support failover, or provide analytical isolation. A leader still handles the write stream unless the system also partitions data or uses another write architecture.

Replication and backups solve different problems. A mistaken deletion can replicate immediately to every follower. A point-in-time backup and retained logs provide a recovery path to an earlier state.

## Acknowledgement defines the durability contract

```text
Client -> leader appends change -> local durable log
                             -> follower receives log
                             -> follower durably flushes log
                             -> follower applies change
```

These are distinct milestones. An asynchronous configuration may acknowledge before any follower receives the change. If the leader is permanently lost, promoting a lagging follower can lose acknowledged writes. A synchronous configuration waits for selected replica milestones, increasing latency and potentially reducing write availability when required replicas are unavailable.

Specify whether “replicated” means received, flushed, or applied, and how many replicas in which failure domains must acknowledge. Local disk durability alone does not guarantee regional durability.

## Read-after-write is an application requirement

After changing a profile, a user may be routed to a follower that has not applied the update. Possible solutions include:

- Read from the leader for freshness-critical operations.
- Return a commit position or version and route to a replica that has caught up.
- Wait for a bounded time, then fall back to the leader or return an explicit pending state.
- Preserve a session's observed version to prevent reads from moving backward.

Routing to the leader for an arbitrary five seconds is a heuristic, not a guaranteed session contract: lag can exceed that window. An optimistic UI masks some latency but does not change storage consistency.

## Failover is a protocol

1. Detect suspected failure with timeouts and independent observations.
2. Select an eligible replica according to the durability policy.
3. Establish its authority through the system's election or control plane.
4. Fence the old leader so it cannot continue accepting conflicting writes.
5. Update routing and reconnect clients.
6. Reconcile the old node before returning it to service.

A missed heartbeat is suspicion, not proof that a machine stopped. Without fencing, a partition can leave two writable leaders. Multi-leader systems permit multiple write locations intentionally, but then need explicit conflict handling; they are not a free way to avoid coordination.

## Lag and recovery capacity

Measure receive lag and apply lag, not just replica process health. Large transactions, long-running reads, or insufficient I/O can make followers fall behind. Retain enough logs to catch up; otherwise a replica may require a full rebuild. Rebuild traffic must be throttled so recovery does not destabilize production.

**Exercise:** A service promises no acknowledged order loss after one-zone failure and read-your-writes for order status. Define replica placement, the write acknowledgement milestone, read routing, and behavior if only one zone remains.

Reference: [PostgreSQL replication and standby behavior](https://www.postgresql.org/docs/current/warm-standby.html).
