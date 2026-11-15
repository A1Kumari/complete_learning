---
id: sys-design-outbox-replay
kind: question
topicId: system-design-event-driven
lessonId: lesson-sys-event-driven
prompt: "What does a transactional outbox guarantee, and why can it still publish duplicate events?"
difficulty: hard
frequent: true
status: published
revision: 1
order: 417
tags: [system-design, outbox, events]
followUps: ["How should a consumer handle an aggregate-version gap?", "Why should replay not automatically resend every historical email?"]
---

## Answer

The business update and outbox record commit in one local transaction, so an accepted state change has a durable publication record. A relay can resume publication after failure instead of losing the event in a database-plus-broker dual-write gap.

If the relay publishes successfully and crashes before recording progress, it publishes again after restart. Consumers therefore need stable event IDs and duplicate-safe processing. The outbox does not by itself guarantee broker availability, bounded publication latency, or exactly-once external effects.

### Evaluation rubric

Require both the gap it closes and the duplicate window it leaves. Strong answers explain relay monitoring, ordering requirements, schema versioning, and replay policies that distinguish rebuildable projections from external side effects.
