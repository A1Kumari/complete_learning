---
id: sys-design-cache-strategy-guarantees
kind: question
topicId: system-design-caching-fundamentals
lessonId: lesson-sys-caching-fundamentals
prompt: "Does write-through caching guarantee fresh reads, and how do TTL and eviction differ?"
difficulty: medium
status: published
revision: 1
order: 406
tags: [system-design, caching]
followUps: ["What is the durability risk in write-behind?", "Which inputs belong in a cache key?"]
---

## Answer

Write-through coordinates a write through a cache layer to backing storage, but its exact acknowledgement and failure behavior must be specified. Other writers, stale replicas, concurrent reads, and partial updates can still break freshness if the protocol does not address them. The name alone does not prove coherence.

TTL controls freshness eligibility over time. Eviction chooses entries to remove under memory pressure, using policies such as LRU or LFU. A valid entry can be evicted before its TTL, and an implementation may reclaim expired memory lazily.

### Evaluation rubric

Require an authoritative source, a freshness contract, and a partial-failure example. Strong answers identify tenant and permission dimensions in cache keys and explain why write-behind needs durable acknowledgement if data loss is unacceptable.
