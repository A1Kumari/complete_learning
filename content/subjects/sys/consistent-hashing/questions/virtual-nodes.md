---
id: sys-design-virtual-nodes
kind: question
topicId: system-design-consistent-hashing
lessonId: lesson-sys-consistent-hashing
prompt: "On a hash ring with A=10, B=40, C=75, which keys move when D=60 is added, and do virtual nodes solve hot keys?"
difficulty: medium
frequent: true
status: published
revision: 1
order: 405
tags: [system-design, hashing]
followUps: ["Why must replicas be on distinct physical nodes?", "What additional protocol is needed for durable data migration?"]
---

## Answer

With clockwise-successor ownership, keys in the interval `(40,60]` move from C to D. Other ownership intervals remain unchanged. The expected moved fraction for a well-balanced new node is a statistical property, not a guarantee for this particular ring.

Virtual nodes spread one physical server across many ring intervals, reducing ownership variance and making migration finer-grained. They do not split the traffic for one extremely popular key. That key may need replication, additional caching, request coalescing, or a semantic redesign.

### Evaluation rubric

A strong answer distinguishes key placement from replication, consistency, and migration. Virtual nodes do not guarantee perfectly equal bytes or requests, and three virtual positions on one server do not provide three independent replicas.
