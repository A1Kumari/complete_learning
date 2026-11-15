---
id: db-recovery-pitr
kind: question
topicId: db-recovery
lessonId: lesson-db-recovery
prompt: "What is needed to restore a database to a point just before an accidental deletion?"
difficulty: medium
frequent: true
status: published
revision: 1
order: 20
tags: [backup, recovery]
---

## Answer

Restore an appropriate base backup and replay an unbroken sequence of archived transaction logs to a target before the deletion, following the engine's point-in-time recovery procedure. The backup, logs, encryption keys, and compatible software must all be available. Test the procedure and verify the restored data.
