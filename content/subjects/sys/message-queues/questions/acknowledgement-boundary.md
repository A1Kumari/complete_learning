---
id: sys-design-acknowledgement-boundary
kind: question
topicId: system-design-message-queues
lessonId: lesson-sys-message-queues
prompt: "A worker updates a database and crashes before acknowledging a message. How do you prevent a duplicate effect?"
difficulty: hard
frequent: true
status: published
revision: 1
order: 416
tags: [system-design, messaging]
followUps: ["What if the effect is an external email instead of a database write?", "Why is acknowledging before the effect unsafe?"]
---

## Answer

Expect redelivery. Insert a unique message receipt and apply the business change in one database transaction. On repeated delivery, the receipt conflict identifies an already applied message, so the worker skips the repeated effect and acknowledges it. The receipt and change must not be independently committed.

For an external effect, a local database receipt cannot atomically prove whether the provider acted before a crash. Use the provider's idempotency contract with a stable operation reference or query and reconcile its outcome. State any remaining duplicate risk.

### Evaluation rubric

Require the crash window, atomic receipt/effect boundary, and receipt retention policy. “Use a queue with exactly-once delivery” is insufficient without defining the boundary of the guarantee.
