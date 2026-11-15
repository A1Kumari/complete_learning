---
id: db-indexes-index-only
kind: question
topicId: db-indexes
lessonId: lesson-db-indexes
prompt: "What is a covering index, and does it always eliminate table access?"
difficulty: medium
frequent: false
status: published
revision: 1
order: 30
tags: [indexes]
---

## Answer

A covering index contains the values needed to answer a particular query. It may allow an index-only scan, but some engines still need table or heap visits to check visibility or retrieve other information. Whether it helps depends on implementation, query, and data state; extra columns also increase maintenance cost.
