---
id: lesson-sys-cqrs-event-sourcing
kind: lesson
topicId: system-design-cqrs-event-sourcing
title: CQRS and event sourcing are separate decisions
summary: Separate command and query models, design event-sourced aggregates, and manage projection lag, snapshots, replay, and event evolution.
difficulty: hard
status: published
revision: 1
order: 270
tags: [system-design, cqrs, event-sourcing]
prerequisiteIds: [lesson-sys-event-driven, lesson-sys-consistency]
---

## Separate the two concepts

**CQRS** separates the models or interfaces used for commands from those used for queries. It does not require separate databases, asynchronous replication, or event sourcing. A service can expose different read and write models backed by the same relational store.

**Event sourcing** stores accepted domain events as the authoritative history from which state is derived. Traditional CRUD stores current state, potentially with a separate audit history. CQRS and event sourcing can be combined, but either can exist without the other.

## Why separate read models?

An order write model enforces valid transitions and transaction boundaries. A dashboard may need a denormalized view joining order status, item summaries, and fulfillment progress. A projection lets the query avoid expensive runtime joins and scale independently.

```text
Command -> validate aggregate -> authoritative store + outbox
                                      |
                                      v
                                  projector -> dashboard read model
Query ----------------------------------------------------^
```

If projection updates are asynchronous, define the lag users can observe. Return a command version or operation ID so the UI can show pending state, wait for the read model to reach that version, or temporarily read from the authoritative path.

## Event-sourced state and concurrency

An account stream might contain `AccountOpened`, `FundsDeposited`, and `FundsWithdrawn`. To accept a command, load the current state, validate the command, and append resulting events conditional on the expected stream version. If another writer appended first, reload and re-evaluate rather than blindly appending an invalid withdrawal.

```text
Stream version 3, balance 100
Command: withdraw 80
Append FundsWithdrawn(80), expecting version 3
If version changed -> conflict -> reload and revalidate
```

The store must enforce that conditional append atomically. Event sourcing does not by itself enforce business invariants.

## Snapshots and replay

A snapshot records derived state at a specific stream version. Load it, then replay later events. The event log remains authoritative; snapshots can be invalid or need rebuilding after code changes. Version the snapshot format and validate that replay logic remains compatible.

Replay should rebuild projections without repeating external side effects such as charging cards or sending welcome emails. Separate pure state application from effectful handlers and maintain durable effect receipts where effects can be retriggered.

## History is useful but not magically perfect

An event log gives a valuable business history only if events capture the necessary facts and remain interpretable. Bugs can append incorrect events; privacy deletion may require careful data separation, redaction, or cryptographic lifecycle policies. “Immutable” does not remove governance or correction requirements.

Evolve schemas through compatible versions or upcasters. Never silently reinterpret an old amount from dollars to cents. Store historical facts rather than querying today's product price when replaying yesterday's order.

**Exercise:** Design a shopping-cart projection from an event stream. Explain how duplicates, out-of-order versions, a new event schema, and a projection rebuild are handled. Then justify whether ordinary CRUD plus an outbox would be sufficient instead.
