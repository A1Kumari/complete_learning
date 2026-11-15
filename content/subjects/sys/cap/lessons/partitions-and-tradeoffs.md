---
id: lesson-sys-cap
kind: lesson
topicId: system-design-cap
title: Reason about CAP during an actual network partition
summary: Apply CAP's precise assumptions, distinguish availability from uptime, and choose partition behavior per operation.
difficulty: hard
status: published
revision: 1
order: 140
tags: [system-design, cap, distributed-systems]
prerequisiteIds: [lesson-sys-consistency]
---

## The theorem's terms are specific

CAP concerns a distributed shared-data system under network partitions. Its consistency property is linearizability. Its availability property requires every request received by a non-failing node to eventually receive a successful response, rather than being rejected or waiting forever. This formal availability is different from a measured uptime SLO or a low-latency target.

A partition prevents some nodes from communicating. If both sides must accept operations and return responses without communicating, they cannot always preserve the appearance of one real-time-consistent copy. The conflict is exposed **during a partition**, not by choosing two letters permanently at system creation.

## Walk through a seat reservation

```text
Initial state: one seat remains, replicated in regions A and B.
Network partition separates A from B.
Client 1 asks A to reserve the seat.
Client 2 asks B to reserve the seat.
```

If both regions independently promise the last seat, the product invariant is violated. To preserve a single authoritative ordering, the protocol may permit only the side with valid quorum or ownership to proceed. Requests on the other side can fail or wait, sacrificing CAP availability for those operations.

If both sides accept provisional requests, the product must acknowledge that conflict resolution can later cancel one request. Calling both reservations final and saying “we will eventually merge” does not solve overselling.

## Behavior can differ by operation

A marketplace can reject a checkout on the minority side while serving stale product descriptions. A chat system may accept locally queued drafts but clearly mark them unsent until the authoritative service confirms them. A shopping cart can merge some independent additions while payment capture requires stronger coordination.

The unit of reasoning is the operation, invariant, configuration, and failure scenario. Product names alone are poor labels: a database can expose different read and write consistency settings, and deployments can behave differently under failover.

## What happens when there is no partition?

Coordination still has latency and cost. Synchronous cross-region replication increases the time before a write can be acknowledged. Asynchronous replication can improve response time while allowing stale reads or acknowledged loss during failover, depending on the contract.

PACELC is a useful reminder: under a partition, availability and consistency can conflict; else, latency and consistency can also trade off. It is a reasoning framework, not a substitute for reading a database's exact guarantees.

## Common misconceptions

- “Pick any two” hides the role of the network partition and the formal definitions.
- An unavailable response is not necessarily a whole-system outage; a minority partition may reject writes while a majority continues.
- Strong consistency does not mean all replicas physically update at the same instant; the protocol controls observable operations.
- Timeouts do not reliably distinguish a crashed node from a delayed network.
- Allowing stale reads is not automatically sufficient to make every operation available.

**Exercise:** Define behavior for account balance reads, transfers, and statement downloads when one region loses contact with the majority. Explain the difference between returning a cached statement and authorizing a new withdrawal.

Reference: [Eric Brewer's retrospective on CAP](https://www.infoq.com/articles/cap-twelve-years-later-how-the-rules-have-changed/).
