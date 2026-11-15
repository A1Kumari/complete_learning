---
id: lesson-sys-event-driven
kind: lesson
topicId: system-design-event-driven
title: Event contracts, transactional outboxes, and projections
summary: Build reliable pub/sub flows with durable publication, consumer deduplication, schema evolution, replay, and aggregate ordering.
difficulty: hard
status: published
revision: 1
order: 180
tags: [system-design, events, outbox]
prerequisiteIds: [lesson-sys-message-queues, lesson-sys-transactions]
---

## Commands request; events report

A command asks a specific owner to do something: `ReserveInventory`. It can be rejected. An event records a fact already accepted by its owner: `InventoryReserved`. Pub/sub lets billing, analytics, and notifications each maintain independent subscriptions to that fact.

Do not use an ambiguous event like `OrderChanged` without enough information for consumers to interpret it. Define event identity, aggregate identity, schema version, occurrence time, sequence/version, and relevant business fields. Avoid leaking unnecessary personal information into long-lived logs.

```json
{
  "event_id": "evt-482",
  "type": "OrderConfirmed",
  "schema_version": 1,
  "order_id": "ord-91",
  "aggregate_version": 4,
  "occurred_at": "2026-01-15T10:00:00Z"
}
```

The timestamp is useful for observation, but not sufficient to impose a total order across unsynchronized machines.

## Eliminate the database-plus-broker dual-write gap

Suppose an order commits, then publishing `OrderConfirmed` fails. Retrying only the request may duplicate the order; ignoring the error loses downstream work. Instead:

```text
One local database transaction:
  update order state
  insert outbox event with stable event_id
commit

Independent relay:
  read committed outbox rows
  publish with broker confirmation
  record relay progress
```

A crash after publication but before progress recording causes publication again. The outbox provides a recoverable publication path, not duplicate-free delivery. CDC can stream committed changes or outbox records; initial snapshots, log retention, connector recovery, and schema changes still need planning.

## Consumers own their correctness

A projection consumer can atomically insert an inbox receipt and update its own database. If the event ID already exists, it skips the repeated effect. Retain receipts for at least the possible redelivery/replay interval or use a stronger aggregate version protocol.

For order-local events, partition by order ID and carry an aggregate version. Reject stale transitions and detect gaps. Partition ordering is not a substitute for business validation: late events, replays, and a producer bug can still violate an assumed sequence.

## Evolve schemas without breaking old consumers

Prefer compatible additions with defined defaults. Do not silently change a field's meaning or units. For incompatible changes, version the event and plan a transition during which old and new consumers coexist. Validate compatibility using representative historical events.

Replay is useful for rebuilding a search index or read model. It must not resend every historical payment capture or welcome email. Separate projection handlers from external-effect handlers, or record durable effect receipts with a defined replay policy.

## Coupling moves rather than disappears

Events reduce synchronous runtime coupling, but introduce contract, ordering, and operational coupling. A chain of ten invisible consumers can be harder to reason about than a short orchestrated workflow. Use trace links, correlation IDs, event lag dashboards, and a durable workflow state machine for long-running business processes.

**Exercise:** An order event is delivered three times, then version 6 arrives before version 5. Specify deduplication, gap handling, monitoring, and when an operator should intervene rather than endlessly retrying.
