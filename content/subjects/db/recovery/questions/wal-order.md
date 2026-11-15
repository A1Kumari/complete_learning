---
id: db-recovery-wal-order
kind: question
topicId: db-recovery
lessonId: lesson-db-recovery
prompt: "What must write-ahead logging ensure before a modified data page is persisted?"
difficulty: medium
frequent: true
status: published
revision: 1
order: 10
tags: [wal, recovery]
---

## Answer

The recovery log information needed for the change must reach durable storage before the corresponding modified data page. A durable commit also requires the relevant commit log records to be flushed before success is acknowledged, subject to configured durability. Recovery details differ across engines.
