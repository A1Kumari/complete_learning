---
id: sys-design-offsets-and-effects
kind: question
topicId: system-design-stream-processing
lessonId: lesson-sys-stream-processing
prompt: "Does a Kafka transaction make a payment-provider HTTP call exactly once?"
difficulty: hard
status: published
revision: 1
order: 418
tags: [system-design, kafka, streaming]
followUps: ["What can consumed offsets and produced Kafka records commit atomically?", "What policy is needed for late event-time records?"]
---

## Answer

No. Kafka transactions can coordinate supported Kafka record production and consumed offsets within their transaction boundary, with appropriately configured consumers. An unrelated payment-provider HTTP call is outside that atomic commit boundary.

A crash after the provider acts but before transaction completion can cause reprocessing. Use a stable provider idempotency key and durable operation tracking, then reconcile unknown outcomes. For a transactional database sink, an effect and receipt/progress record can sometimes share the sink transaction instead.

### Evaluation rubric

Require a precise guarantee boundary and crash trace. Strong answers also distinguish partition-local offsets from global order, retention from consumer progress, and record lag from time-based processing freshness.
