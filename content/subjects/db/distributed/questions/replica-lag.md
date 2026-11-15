---
id: db-distributed-replica-lag
kind: question
topicId: db-distributed
lessonId: lesson-db-distributed
prompt: "Why can a user see stale data immediately after saving a change when reads use a replica?"
difficulty: medium
frequent: true
status: published
revision: 1
order: 10
tags: [replication, consistency]
---

## Answer

An asynchronous replica can lag behind the primary and not yet have applied the committed change. Read from the primary for read-your-writes, wait for a replica to reach a known position where supported, or explicitly tolerate stale results. Failover can also lose writes not replicated before the failure.
