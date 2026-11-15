---
id: db-distributed-shard-key
kind: question
topicId: db-distributed
lessonId: lesson-db-distributed
prompt: "What makes a shard key suitable, and what can still create a hotspot?"
difficulty: medium
frequent: true
status: published
revision: 1
order: 20
tags: [sharding, scaling]
---

## Answer

A useful key distributes storage and traffic while supporting common access patterns and colocation requirements. A high-cardinality key alone is insufficient: one very active tenant or a time-based range receiving all new writes can overload a shard. Consider skew, cross-shard operations, rebalancing, and future growth.
