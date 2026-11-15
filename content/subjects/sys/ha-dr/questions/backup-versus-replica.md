---
id: sys-design-backup-versus-replica
kind: question
topicId: system-design-ha-dr
lessonId: lesson-sys-ha-dr
prompt: "Why are multiple database replicas insufficient protection against an accidental deletion, and how do RPO and RTO guide recovery?"
difficulty: medium
status: published
revision: 1
order: 421
tags: [system-design, disaster-recovery]
followUps: ["What must a restore drill validate beyond the database files?", "What shared failure can affect active-active regions?"]
---

## Answer

Replicas normally apply the deletion too, so they preserve availability of the current state rather than a recoverable earlier state. Backups plus retained logs or other point-in-time recovery mechanisms are needed to restore the intended prior data.

RPO specifies acceptable recent data loss; RTO specifies acceptable restoration time. A nightly backup alone may lose nearly a day's writes and take hours to restore, violating tighter objectives. Measure restore and application recovery at realistic scale, including keys, credentials, infrastructure, dependent services, and routing.

### Evaluation rubric

Require separate availability, durability, and recovery reasoning. Strong answers include fencing during promotion, independent backup protection, corruption detection, and a tested runbook rather than treating replica count as a complete disaster-recovery plan.
