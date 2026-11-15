---
id: lesson-sys-distributed-caching
kind: lesson
topicId: system-design-distributed-caching
title: Stampedes, invalidation races, and distributed cache failure
summary: Design cache population and invalidation under concurrent requests, hot keys, failover, and backend overload.
difficulty: hard
status: published
revision: 1
order: 80
tags: [system-design, caching, reliability]
prerequisiteIds: [lesson-sys-caching-fundamentals, lesson-sys-consistent-hashing]
---

## Shared caches create shared failure modes

A distributed cache lets many application instances reuse data. It also adds a network hop, independent failure behavior, sharding, and replication choices. Treat cache data as derived state unless you deliberately design the service as a durable primary store.

Local in-process caches are faster but each instance can hold a different version. A two-level design—local L1 plus shared L2—can reduce network traffic, but invalidation and memory budgets become more complicated. A permission change must not remain valid indefinitely just because one L1 missed an invalidation message.

## Stop a stampede at its source

When a hot entry expires, many readers can miss together and recompute the same expensive value. A cache stampede converts one cache miss into thousands of database queries.

Options solve different parts of the problem:

- **Single-flight:** Combine concurrent loads for one key within a process.
- **Per-key distributed lease:** Permit one loader across processes; give leases an expiry and bounded waits.
- **Stale-while-revalidate:** Serve a previously stored value during a defined stale window while one refresh runs.
- **TTL jitter:** Spread independent expirations across time.
- **Early refresh:** Refresh popular values before hard expiration.

An expired lease may let a second loader start while the first is still running. That can be acceptable for duplicate read-only computation, but not for arbitrary side effects. Do not treat a best-effort cache lock as proof of exclusive ownership over a financial operation.

## Trace the stale-fill race

```text
1. Reader misses cache and reads database version 7.
2. Writer commits version 8 and invalidates the cache.
3. Reader stores version 7 in the cache.
4. Later readers see version 7 until another correction or expiry.
```

Deleting after writing is a useful baseline, not a proof of consistency. For stronger freshness, carry versions and ensure cache updates never regress relative to the version information the protocol preserves. Merely comparing against a missing cache entry is insufficient after eviction. An ordered CDC pipeline, persistent version watermark, or routing freshness-critical reads to the authoritative store may be necessary.

## Failure does not justify unlimited fallback

Suppose 98% of 50,000 reads/s are cache hits. The database normally handles 1,000 reads/s; a total cache outage can demand 50,000 reads/s. Blindly bypassing the cache may turn a cache incident into a database outage.

Use a bounded fallback: concurrency limits, admission control, cached stale responses where allowed, and deliberate shedding of nonessential work. Keep lookup timeouts short relative to the end-to-end deadline. A circuit breaker can prevent spending every request deadline on a failed cache.

Failover may lose recently cached writes or resurrect older replicas. That is acceptable only within the application's freshness contract. For revocation and inventory decisions, use an authoritative check or stronger versioning rather than assuming cache replication is linearizable.

## Operational exercise

Design a product page with a 30-second freshness target. Specify soft expiry, hard expiry, single-flight scope, maximum backend concurrency, and behavior when both the cache and database are slow. Track stale response rate, refresh errors, per-key request skew, and origin query amplification.

Reference: [Google SRE on cascading failures](https://sre.google/sre-book/addressing-cascading-failures/).
