---
id: db-recovery-replica-backup
kind: question
topicId: db-recovery
lessonId: lesson-db-recovery
prompt: "Why is a database replica not a substitute for a backup?"
difficulty: easy
frequent: true
status: published
revision: 1
order: 30
tags: [backup, replication]
---

## Answer

Replication can propagate accidental deletions, bad updates, or corruption to every replica, and replicas can share failure domains. Independent, protected backups and archived logs provide historical recovery points; they must be periodically restored and verified.
