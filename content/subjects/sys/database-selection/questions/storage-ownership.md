---
id: sys-design-storage-ownership
kind: question
topicId: system-design-database-selection
lessonId: lesson-sys-database-selection
prompt: "Choose storage for marketplace orders, product search, images, sessions, and revenue analytics."
difficulty: medium
frequent: true
status: published
revision: 1
order: 409
tags: [system-design, databases]
followUps: ["Which stores are authoritative versus rebuildable?", "When would using fewer datastores be the better decision?"]
---

## Answer

A relational store is a reasonable starting point for orders because transactions, uniqueness, and relationships support order invariants. A derived search index supports retrieval and ranking. Object storage holds images, with metadata and access ownership elsewhere. Sessions can use a suitably durable/available key-value service according to logout and recovery requirements. An analytical store can serve large revenue aggregations from a controlled ingestion pipeline.

These are workload-based options, not mandatory technologies. A smaller product may use one relational store plus object storage initially. Every added store requires monitoring, backups, access control, schema evolution, and reconciliation.

### Evaluation rubric

Require access patterns and consistency reasoning. Reject claims that SQL cannot scale horizontally, that every NoSQL database lacks transactions, or that a search index is automatically the authoritative inventory source.
