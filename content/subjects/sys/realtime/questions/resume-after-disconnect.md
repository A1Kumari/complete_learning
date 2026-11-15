---
id: sys-design-resume-after-disconnect
kind: question
topicId: system-design-realtime
lessonId: lesson-sys-realtime
prompt: "Why is a WebSocket connection insufficient for reliable chat delivery after a gateway restart?"
difficulty: medium
status: published
revision: 1
order: 424
tags: [system-design, realtime]
followUps: ["What must SSE servers implement beyond Last-Event-ID?", "How should slow consumers be bounded?"]
---

## Answer

A socket provides a live transport, not durable history or application-level delivery receipts. A gateway restart loses its connections and any unpersisted outbound buffers. Store messages durably, assign stable IDs or conversation sequence numbers, and let clients reconnect with their last processed cursor to replay missing messages.

Deduplicate overlap between replay and live delivery. If retained history no longer covers the cursor, require explicit resynchronization. Reauthorize subscriptions after reconnect and handle revoked membership on long-lived sessions.

### Evaluation rubric

Require separation of connection ownership and message ownership, bounded outbound queues, and reconnect jitter. Sticky sessions can improve locality but do not replace replay or durability. Socket write success is not proof that a user read the message.
