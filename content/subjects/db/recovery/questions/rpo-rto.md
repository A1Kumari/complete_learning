---
id: db-recovery-rpo-rto
kind: question
topicId: db-recovery
lessonId: lesson-db-recovery
prompt: "How do RPO and RTO influence a database recovery plan?"
difficulty: medium
frequent: false
status: published
revision: 1
order: 40
tags: [backup, recovery]
---

## Answer

RPO specifies the maximum acceptable data loss measured in time; RTO specifies the maximum acceptable time to restore service. RPO informs backup and log retention and replication choices, while RTO informs restore speed, automation, capacity, and failover design. Measure both through realistic recovery exercises.
