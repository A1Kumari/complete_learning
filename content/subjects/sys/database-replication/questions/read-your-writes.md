---
id: sys-design-replica-read-your-writes
kind: question
topicId: system-design-database-replication
lessonId: lesson-sys-database-replication
prompt: "How can a user reliably read a profile update immediately when reads normally use asynchronous replicas?"
difficulty: hard
status: published
revision: 1
order: 410
tags: [system-design, replication]
followUps: ["Why is leader routing for a fixed five seconds only a heuristic?", "What acknowledged data can be lost during failover?"]
---

## Answer

Route the freshness-critical read to the leader, or return a commit/version token and read from a replica only after it has reached the required position. If the replica cannot catch up within a bounded deadline, fall back to an eligible authoritative path or expose a pending/error state according to the contract.

Routing to the leader for an arbitrary time window is not a proof because replica lag can exceed that interval. Optimistic UI can improve appearance but does not make server reads consistent.

### Evaluation rubric

Require an explicit freshness mechanism and bounded waiting. Strong answers distinguish receipt, durable replication, and application of the log, and note that promotion of a lagging asynchronous follower can lose acknowledged updates.
