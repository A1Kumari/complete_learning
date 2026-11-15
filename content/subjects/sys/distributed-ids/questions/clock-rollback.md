---
id: sys-design-id-clock-rollback
kind: question
topicId: system-design-distributed-ids
lessonId: lesson-sys-distributed-ids
prompt: "What can go wrong with a Snowflake-style generator after clock rollback or worker-ID reuse?"
difficulty: hard
status: published
revision: 1
order: 431
tags: [system-design, identifiers]
followUps: ["Do time-sortable IDs prove transaction commit order?", "Why might a 64-bit ID be serialized as a JSON string?"]
---

## Answer

Reusing a timestamp, worker ID, and sequence combination can generate duplicate IDs. Prevent overlapping worker identities and define clock rollback behavior: stop until time catches up, maintain a safely recovered logical high-water mark, or choose another ID scheme. Sequence exhaustion must wait or follow an explicitly safe alternative, not wrap silently.

Time-sortable IDs provide useful locality and approximate creation order, not a proof of causality or commit order across machines. Worker lease expiry alone may not stop a paused previous generator from resuming.

### Evaluation rubric

Require both time and identity failure cases, restart state, and storage collision handling. Strong answers distinguish uniqueness, ordering, unpredictability, and authorization, and note JavaScript number precision limits for large integers.
