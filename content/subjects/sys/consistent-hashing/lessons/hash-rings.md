---
id: lesson-sys-consistent-hashing
kind: lesson
topicId: system-design-consistent-hashing
title: Place keys with consistent hashing and virtual nodes
summary: Trace hash-ring ownership, topology changes, virtual nodes, replication placement, and hot-key limitations.
difficulty: medium
status: published
revision: 1
order: 60
tags: [system-design, hashing, partitioning]
prerequisiteIds: [lesson-sys-scaling]
---

## Why modulo routing becomes expensive

With `hash(key) % N`, changing the number of buckets changes the destination of many keys. A cache cluster that scales from four to five nodes may suddenly experience many misses because clients route existing keys to different servers. The database sees a burst precisely when the cache is reconfiguring.

Consistent hashing maps nodes and keys into the same circular hash space. A key belongs to the first node encountered clockwise from its hash. Wrapping at the end makes the space a ring. Each node therefore owns the interval after its predecessor through its own position.

## Trace a topology change

```text
Ring positions: A=10, B=40, C=75 on a toy range 0..99
key at 18 -> B
key at 58 -> C
key at 90 -> A (wraparound)

Add D=60:
key at 18 -> B (unchanged)
key at 58 -> D (moved)
key at 90 -> A (unchanged)
Only the interval (40, 60] changes owner.
```

With well-distributed, equally weighted assignments, adding a node to N nodes moves an expected fraction around `1 / (N + 1)` of keys. This is an average under assumptions, not a guarantee for every ring. Removing a node moves its ownership ranges to surviving successors.

## Virtual nodes reduce placement variance

Give each physical server many independently hashed positions. This spreads its ownership across many intervals and makes reassignment more granular. Assign more virtual nodes to a higher-capacity server when implementing weighted placement.

Virtual nodes improve statistical balance; they do not ensure perfectly equal traffic. They also increase metadata and migration bookkeeping. One extremely popular key can still overload its assigned node even if every node owns the same number of keys. Mitigations include local replicas of hot values, request coalescing, caching at another layer, or splitting an application-level hot aggregate when its semantics allow it.

## Key placement is not a complete storage protocol

The ring answers “where should this key live?” It does not answer how writes are acknowledged, how stale replicas reconcile, or whether concurrent updates are safe. A replicated store might put copies on the next three **distinct physical nodes**, with placement rules that avoid the same rack or zone. Three virtual nodes on one machine are not three independent replicas.

Membership changes need versioned routing information. During migration, clients and servers may see different ring versions. A durable database may temporarily forward reads, dual-write with a defined protocol, copy records, verify catch-up, and only then cut over ownership. Removing a node before its data is copied is data loss, not rebalancing.

## Alternatives and operational review

Rendezvous hashing ranks nodes by a key-node score and selects the highest-scoring candidates. Fixed logical partitions mapped to physical machines separate key hashing from machine count and often simplify migration. Choose a placement scheme together with an operational story.

Monitor per-node bytes, request rates, latency, ownership skew, and migration bandwidth. Rate-limit copying so rebalancing does not overwhelm the live workload.

**Exercise:** Add a node at position 5 to the toy ring. Which part of A's wrapped range moves? Explain why moving keys and replicating data are separate tasks.
