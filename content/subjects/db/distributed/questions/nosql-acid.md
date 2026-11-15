---
id: db-distributed-nosql-acid
kind: question
topicId: db-distributed
lessonId: lesson-db-distributed
prompt: "Does choosing a NoSQL database necessarily mean giving up transactions or strong consistency?"
difficulty: medium
frequent: true
status: published
revision: 1
order: 40
tags: [nosql, transactions]
---

## Answer

No. Some nonrelational systems offer transactions or strong consistency with particular scopes and configurations, and relational systems can also scale across nodes. Evaluate the actual product's transaction scope, consistency, query patterns, operational constraints, and failure behavior instead of inferring guarantees from the label.
