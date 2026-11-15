---
id: lesson-sys-transactions
kind: lesson
topicId: system-design-transactions
title: Distributed transactions, sagas, and uncertain outcomes
summary: Compare local atomic transactions, two-phase commit, sagas, durable workflow state, compensation, and transactional outboxes.
difficulty: hard
status: published
revision: 1
order: 150
tags: [system-design, transactions, sagas]
prerequisiteIds: [lesson-sys-consistency, lesson-sys-cap]
---

## Start with the invariant and transaction boundary

If an order and its line items share one database, use a local transaction to commit them together. Separating services does not remove the business need for correctness; it moves coordination across network and ownership boundaries.

For a purchase involving orders, inventory, and payments, identify which intermediate states are acceptable. An order can be `PENDING_PAYMENT` while a durable workflow coordinates the rest. Do not tell the user the purchase is complete before the promised conditions hold.

## Two-phase commit

A coordinator asks all participants to **prepare**. Each participant durably records whether it can commit and holds the necessary resources. If all vote yes, the coordinator durably decides commit and distributes that decision; otherwise it decides abort.

Prepared participants cannot safely invent a different outcome if the decision is unknown. Classic 2PC can therefore block while a failed coordinator or communication path recovers. Durable logs and recovery procedures matter; “the coordinator sends a message” is not enough. Atomic commit also does not itself specify every isolation guarantee.

2PC can be appropriate when supported participants and operational constraints fit. Some distributed databases provide coordinated transactions internally. Do not claim that microservices make ACID impossible or that every workflow should be a saga.

## Sagas use local transactions and business compensation

```text
Create pending order
  -> reserve inventory
  -> authorize payment
  -> confirm order

Failure after reservation:
  -> release reservation
Failure after authorization:
  -> void authorization if possible
```

A saga exposes intermediate states and does not provide automatic global isolation. Compensation is a new business action, not time travel. A refund may be delayed, incur fees, or fail; an email cannot be “unsent.” Reserve or authorize before performing irreversible actions where possible.

**Orchestration** uses an explicit coordinator that tracks steps. **Choreography** lets services react to events. Orchestration often makes complex state transitions easier to inspect; choreography can reduce direct coupling for simple reactions but obscure long workflows.

## Make every step restartable

Persist workflow ID, current state, attempt identity, deadlines, and step results. Retries reuse the same idempotency identity. Validate legal transitions so a delayed “payment failed” event cannot overwrite an already confirmed payment without reconciliation.

A timeout after sending a charge means the outcome is unknown. Query the provider using the stable operation reference before issuing a new charge. Separate retryable failures, terminal business rejections, and unknown states requiring reconciliation.

## Publish state changes reliably

Updating a database and publishing an event are two writes. If the database commits and publication fails, downstream services never learn about the change. Write an outbox row in the same database transaction as the business update. A relay publishes it and marks progress; a crash between publish and progress recording can duplicate the event, so consumers still need idempotency.

**Exercise:** Trace crashes before and after inventory reservation, provider authorization, and order confirmation. For each, state what durable record lets the workflow resume, what can be retried, and what compensation is possible.

Continue with [event-driven architecture](../../event-driven/lessons/outbox-and-events.md) and the [payment case study](../../end-to-end/lessons/payments.md).
