---
id: db-distributed-cap
kind: question
topicId: db-distributed
lessonId: lesson-db-distributed
prompt: "What tradeoff does CAP describe during a network partition?"
difficulty: hard
frequent: true
status: published
revision: 1
order: 30
tags: [cap, consistency]
---

## Answer

Under CAP's assumptions, while communication is partitioned, a distributed system cannot guarantee both linearizable consistency and availability for every request. It must choose how affected operations behave. CAP consistency is distinct from ACID consistency, and a product's actual behavior depends on its operation and configuration.
