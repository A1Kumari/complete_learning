---
id: lesson-sys-coordination
kind: lesson
topicId: system-design-coordination
title: Consensus, leader election, leases, and fencing tokens
summary: Understand replicated logs, majority quorums, failure suspicion, stale leaders, and why leases need enforcement at the resource.
difficulty: hard
status: published
revision: 1
order: 230
tags: [system-design, consensus, coordination]
prerequisiteIds: [lesson-sys-consistency, lesson-sys-cap]
---

## What needs agreement?

Systems often need one authoritative decision: who owns a shard, which configuration version is current, or which scheduler may issue work. Consensus protocols let replicas agree on a sequence of decisions despite some failures, under their stated assumptions. They are not merely machines voting independently and hoping the results match.

A replicated state machine applies the same committed commands in the same order on each replica. The log is the agreement boundary; the state machine must apply commands deterministically or otherwise preserve the protocol's expected semantics.

## Raft intuition

Raft separates leader election, log replication, and safety rules. Servers use terms, persist voting/log state, and enforce log eligibility rules. A leader replicates entries; commitment follows quorum and term rules, not simply “any three machines have some data.” A newly elected leader cannot discard already committed history.

With five voting replicas, a majority is three. The cluster can usually make progress with two unavailable replicas if the remaining three can communicate. Safety can hold while progress stops: a minority partition cannot independently commit new decisions. Timeouts influence elections and liveness, not the proof that competing committed histories are safe.

## Heartbeats are failure suspicion

A missed heartbeat can mean a crashed machine, delayed network, overloaded process, or long runtime pause. A node marked unhealthy can still be running and reach another dependency. Gossip protocols spread membership observations efficiently, but membership dissemination is not the same as consensus about an exclusive writer.

The system needs an authority protocol that remains safe when an old owner continues executing.

## Why leases are not enough by themselves

```text
Worker A obtains lease with fencing token 41.
A pauses for a long time.
Lease expires; worker B obtains token 42 and writes.
A resumes and tries to write using token 41.
```

The resource must reject token 41 after observing token 42. A **fencing token** is a monotonically increasing ownership epoch enforced where the protected work occurs. Checking a lease only before starting the work leaves a pause window before the actual write.

A storage service can atomically compare an incoming epoch against its highest accepted epoch. Monotonic tokens require a trustworthy allocator and durable enforcement. A random lock value is useful for safe unlock checks, but is not a fencing sequence. Some resources cannot enforce fencing, in which case use another protocol or redesign the operation.

## Choose the smallest coordination scope

Do not put every application request through a global consensus service if only configuration changes need ordering. A service can use consensus to allocate shard ownership and then process independent shard-local operations without a global lock. This reduces latency and avoids making the coordination plane a throughput bottleneck.

Use established implementations for production consensus. Membership changes, snapshots, log compaction, clock assumptions, and crash recovery are subtle enough that a short homegrown election loop is not a substitute.

**Exercise:** Design a periodic invoice scheduler. Show how duplicate scheduling is prevented or made harmless after a paused leader resumes. Distinguish election, lease expiration, fencing, and invoice idempotency.

Reference: [Raft overview, paper, and visualizations](https://raft.github.io/).
