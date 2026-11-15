---
id: lesson-sys-caching-fundamentals
kind: lesson
topicId: system-design-caching-fundamentals
title: Cache strategies, freshness, and memory budgets
summary: Choose cache-aside, read-through, write-through, or write-behind with explicit ownership, expiration, and failure semantics.
difficulty: medium
status: published
revision: 1
order: 70
tags: [system-design, caching, performance]
prerequisiteIds: [lesson-sys-client-server]
---

## What a cache promises

A cache stores a reusable result closer to a consumer or in a faster storage tier. It trades memory and freshness complexity for lower latency or reduced backend work. First define the authoritative source and acceptable staleness. A profile image and a bank balance should not receive the same policy merely because both are readable by key.

Cache keys must include every input affecting the result: resource ID, tenant, relevant authorization scope, locale, query parameters, and representation version. A missing tenant or permission dimension can return another user's data. Avoid placing secrets directly in observable keys.

## Compare the strategies

| Strategy | Read/write flow | Main trade-off |
| --- | --- | --- |
| Cache-aside | Application reads cache, loads misses from source | Application owns miss and invalidation logic |
| Read-through | Cache layer loads missing values | Simpler callers, stronger coupling to cache loader |
| Write-through | Write passes through a layer that updates backing store and cache | Higher write latency; partial failures need handling |
| Write-behind | Acknowledge cache write, persist later | Lower apparent latency, but possible loss before durable persistence |

Write-through does not magically make every reader coherent: other writers, replicas, failures, and concurrent readers still matter. Write-behind is inappropriate for irreplaceable data unless the acknowledged write already has an adequate durable log and recovery protocol.

## Cache-aside example

```text
GET product:42
  cache hit -> return cached product
  cache miss -> read product database
                -> cache value with expiry
                -> return value

UPDATE product:42
  commit database update
  invalidate cached product
```

This baseline has a race: a reader can load an old database value before the writer commits and populate the cache after invalidation. TTL limits some stale periods, but does not eliminate the race. Version-aware population, serialized per-key updates, or an ordered change stream can provide stronger guarantees.

## Expiration and eviction solve different problems

**TTL** controls how long an entry remains eligible. **Eviction** decides which entries to remove under memory pressure. LRU approximates recency, LFU approximates frequency, and admission policies can avoid filling memory with one-off scans. Expiring a key does not guarantee immediate physical reclamation in every implementation.

Use TTL jitter so thousands of entries do not expire at the same instant. Negative caching stores “not found” briefly to reduce repeated misses, but invalidation must allow newly created records to become visible. Cache only suitable errors: caching a transient database failure as permanent absence is incorrect.

## Measure the right benefit

If a hit costs 2 ms, a miss costs 50 ms total, and the hit ratio is 90%, the simple average is `0.9 * 2 + 0.1 * 50 = 6.8 ms`. This does not imply a 6.8 ms p99: the miss distribution still affects tail latency.

Measure byte hit ratio as well as request hit ratio, backend work saved, memory per entry, eviction rate, and miss latency. Test a cold start and cache outage. A cache should not become an unexplained new single point of failure.

**Exercise:** Set policies for product descriptions, inventory availability, authorization decisions, and missing user profiles. For each, specify a freshness limit and a fallback when the cache is unavailable.
