---
id: ai-vector-rebuild-consistency
kind: question
topicId: ai-vector-databases
lessonId: lesson-ai-vector-lifecycle
prompt: How would you rebuild a collection for a new embedding model while writes continue, and why is switching a collection alias alone insufficient?
difficulty: hard
status: published
revision: 1
order: 930
tags: [vector-databases, migrations, consistency]
conceptIds: [concept-vector-lifecycle]
followUps:
  - What keeps a delayed backfill from overwriting a newer update?
  - Does a successful write acknowledgment always imply immediate search visibility?
misconception: Routing to new document vectors does not automatically switch the query encoder to the same space.
---

## Answer

Backfill a separately versioned collection from a snapshot, replay later updates
and deletes from a watermark, and enforce revision ordering. Validate quality,
eligibility, freshness, and latency, then coordinate the query encoder and collection
switch under one versioned routing configuration with a rollback policy.

### Supporting reasoning

An alias changes storage routing but does not reconfigure a query encoder. Write
acceptance, durability, replication, and search visibility may be separate stages;
the application must use the database's documented consistency semantics.

### Evaluation rubric

One point each: snapshot plus change replay; version/delete handling; coordinated
encoder/collection cutover; evaluation, rollback, or visibility semantics.
