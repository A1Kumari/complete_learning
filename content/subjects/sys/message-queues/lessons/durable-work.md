---
id: lesson-sys-message-queues
kind: lesson
topicId: system-design-message-queues
title: Durable work queues and delivery guarantees
summary: Design producer confirmation, acknowledgements, redelivery, idempotent consumers, dead-letter handling, and bounded backlog recovery.
difficulty: medium
status: published
revision: 1
order: 170
tags: [system-design, messaging, reliability]
prerequisiteIds: [lesson-sys-foundations, lesson-sys-concurrency]
---

## What a queue changes

A queue decouples the arrival of work from its execution. An API can durably accept a report-generation job and return a job ID while workers render the report later. This improves responsiveness and absorbs temporary bursts, but adds delayed results, backlog management, and duplicate handling.

```text
API -> durable acceptance record / outbox -> broker -> worker -> result store
Client -------------------------------------------> GET job status
```

Returning `202 Accepted` should correspond to an actual durable acceptance point, not a task stored only in process memory. Specify how long jobs are retained and what happens if the result is never produced.

## There are two acknowledgement boundaries

**Producer confirmation** tells the producer whether the broker accepted a message according to its configured durability and replication policy. **Consumer acknowledgement** tells the broker that a delivery can be considered complete. These are different contracts.

A worker should normally acknowledge after its promised effect is durably recorded. If it acknowledges before writing the result and crashes, the job can be lost. If it writes the result and crashes before acknowledgement, the broker may redeliver and the worker can perform the effect twice unless processing is idempotent.

## Delivery guarantees and effect guarantees

| Model | Failure behavior | Application obligation |
| --- | --- | --- |
| At-most-once | Some messages may never be processed | Accept loss or reconcile elsewhere |
| At-least-once | Redelivery can occur | Make duplicate handling safe |
| Exactly-once within a defined system | Effect and progress commit together in that boundary | Understand what external effects are excluded |

No messaging slogan makes an arbitrary external email or payment happen exactly once. A database consumer can insert an event receipt and apply its business change in one transaction. A duplicate unique receipt causes the transaction to skip the repeated effect. If the effect is an external API call, use that API's idempotency contract or reconcile its outcome using a stable reference.

## Retries, poison messages, and ordering

Use exponential backoff with jitter and bounded attempts. Separate transient infrastructure failures from invalid payloads that will fail forever. A dead-letter queue preserves exhausted jobs for inspection, correction, and controlled replay; it is not a place to silently discard customer work.

Visibility timeouts or delivery leases must fit job duration, with renewal when supported. Redelivery can overlap with a slow original worker after its lease expires. A lease alone does not prevent both from executing side effects.

Parallel consumers and retries can reorder completion. If one entity requires order, partition by that entity or enforce a sequence/version at the consumer. Global ordering usually reduces throughput and availability unnecessarily.

## A queue is not infinite capacity

When arrival rate is greater than completion rate, backlog grows continuously. Monitor oldest-message age and processing delay, not just queue depth. If 1,000 jobs/s arrive and workers handle 800 jobs/s, the queue adds 12,000 jobs per minute. Scaling, admission control, prioritization, or reduced work is required.

**Exercise:** Trace a worker crash immediately before and after acknowledgement. Explain which durable records prevent duplicate report publication and how an operator safely replays a failed job.
