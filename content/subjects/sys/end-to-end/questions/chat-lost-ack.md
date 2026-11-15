---
id: sys-design-chat-lost-ack
kind: question
topicId: system-design-end-to-end
lessonId: lesson-sys-chat
prompt: "A chat message commits and reaches the recipient, but the sender loses the acknowledgement. What happens on retry?"
difficulty: hard
status: published
revision: 1
order: 435
tags: [system-design, case-study, chat]
followUps: ["What happens when a reconnect overlaps live delivery with replay?", "Why is a timestamp insufficient for conversation order?"]
---

## Answer

The sender retries with the original client message identity. A uniqueness rule scoped to sender/conversation returns the already accepted message and its authoritative sequence rather than inserting a second logical message.

Fan-out can still deliver the same message again, so recipients deduplicate by stable message ID or conversation sequence. A disconnected device resumes from its processed cursor against durable history. Accepted, delivered, and read states remain separate.

### Evaluation rubric

Require durable acceptance before acknowledgement, conversation-local sequencing, sender and recipient deduplication, and replay. Strong answers also address authorization changes, multi-device cursors, gateway failure, and bounded slow-consumer buffers.
