---
id: db-indexes-sequential-scan
kind: question
topicId: db-indexes
lessonId: lesson-db-indexes
prompt: "Why might a database choose a sequential scan even when an index exists?"
difficulty: medium
frequent: true
status: published
revision: 1
order: 20
tags: [indexes, query-plans]
---

## Answer

The optimizer may estimate that reading most of a small table sequentially is cheaper than traversing an index and fetching many table rows. Stale statistics, parameter estimates, predicate shape, and random I/O costs can also influence its choice. Compare estimated and actual rows and measure before concluding the scan is wrong.
