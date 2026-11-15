---
id: sys-design-partition-key-tradeoffs
kind: question
topicId: system-design-sharding
lessonId: lesson-sys-sharding
prompt: "Why might tenant ID be a good shard key initially and a poor one for a very large customer?"
difficulty: hard
status: published
revision: 1
order: 411
tags: [system-design, sharding]
followUps: ["How would you migrate one tenant without losing concurrent writes?", "What queries become fan-out operations?"]
---

## Answer

Tenant ID can co-locate a customer's records, keep tenant-local transactions simple, and support isolation and targeted migration. However, one very large or busy tenant can exceed a shard's storage or throughput, while other shards remain underutilized.

Possible adaptations include dedicated placement, tenant-plus-bucket keys, or separate partitioning for high-volume data. Each can complicate tenant-wide queries and transaction boundaries. Choose from actual request and growth distributions rather than only equal row counts.

### Evaluation rubric

Require locality versus skew reasoning and a versioned migration plan with snapshot, change catch-up, ownership cutover, and stale-router handling. Cross-shard joins are costly in many designs but not universally impossible.
