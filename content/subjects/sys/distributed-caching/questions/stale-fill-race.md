---
id: sys-design-stale-fill-race
kind: question
topicId: system-design-distributed-caching
lessonId: lesson-sys-distributed-caching
prompt: "How can a cache return old data even when a writer updates the database and then deletes the cache key?"
difficulty: hard
frequent: true
status: published
revision: 1
order: 407
tags: [system-design, caching, concurrency]
followUps: ["Why is comparing versions against an absent cache entry insufficient?", "How do you protect the database during a cache outage?"]
---

## Answer

A reader misses and reads version 7 from the database. The writer commits version 8 and invalidates the cache. The delayed reader then populates version 7 after that invalidation, leaving stale data for later readers.

TTL can limit some stale periods but does not eliminate the race. Stronger options include version-aware writes with preserved watermarks, an ordered change stream, serialized per-key ownership, or routing freshness-critical reads to the authoritative store. If eviction removes all version knowledge, a stale reader can still populate an empty entry unless the protocol preserves a relevant watermark elsewhere.

### Evaluation rubric

Require the interleaving, not merely “cache invalidation is hard.” Explain the guarantee of the proposed fix and distinguish stampede protection from freshness correctness.
