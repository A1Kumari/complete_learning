---
id: sys-design-saga-timeout
kind: question
topicId: system-design-transactions
lessonId: lesson-sys-transactions
prompt: "A payment step times out after inventory was reserved. How should a saga recover?"
difficulty: hard
frequent: true
status: published
revision: 1
order: 414
tags: [system-design, transactions, sagas]
followUps: ["Why is compensation not equivalent to database rollback?", "What publication gap does an outbox close?"]
---

## Answer

Persist the workflow state and stable payment operation identity. A timeout leaves the provider outcome unknown: the payment may have succeeded. Query or retry using the same provider idempotency contract and reconcile the result before issuing a new charge or blindly assuming failure.

If the workflow must cancel, release the inventory reservation and void or refund the payment according to its actual state. Compensation is a new business action that can itself fail and require retries or manual resolution; it does not erase externally observed effects.

### Evaluation rubric

Require durable state, unknown-outcome handling, idempotent steps, and legal transitions. Strong answers explain how outbox publication and duplicate-safe consumers support restartable orchestration, and when a local transaction or supported distributed transaction would be simpler.
