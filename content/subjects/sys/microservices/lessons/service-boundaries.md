---
id: lesson-sys-microservices
kind: lesson
topicId: system-design-microservices
title: Monoliths, modularity, and deliberate service extraction
summary: Choose service boundaries from business ownership and change patterns, and account for data ownership, deployment, and distributed failure costs.
difficulty: medium
status: published
revision: 1
order: 260
tags: [system-design, microservices, architecture]
prerequisiteIds: [lesson-sys-service-communication, lesson-sys-transactions]
---

## A deployment boundary is not a quality guarantee

A monolith deploys as one application. It can still have strong modules, clear interfaces, and independently testable domain logic. Microservices deploy independently and communicate over network contracts. They can improve team autonomy and targeted scaling, but make calls slower and failure-prone and distribute data consistency work.

A poorly structured monolith can become difficult to change. A poorly structured service fleet can become a distributed monolith: every change requires coordinated releases and every request traverses a tightly coupled chain. Count the coupling, not the processes.

## Use business boundaries

Good boundaries group behavior and data that change together and enforce related invariants. A marketplace might separate catalog, ordering, payments, and fulfillment. Splitting every database table into a service usually creates chatty calls and moves joins into the network without establishing meaningful ownership.

Ask these questions:

- Which team owns the capability and its on-call response?
- Can it deploy without coordinating many other releases?
- Does it need a distinct scaling or availability profile?
- Which invariants stay local, and which become workflows?
- Can consumers use a stable contract instead of reading its tables?

## Data ownership is the hard boundary

Two services writing the same shared tables are still coupled to one schema and transaction model. Prefer one owner per business fact with APIs or events for other consumers. A reporting projection may copy facts, but should not become a second competing source of truth.

Do not distribute a transaction solely to satisfy an architectural fashion. Keeping inventory reservation and order creation together may be simpler initially. If payments must be separate, model the order's pending states and reconciliation path explicitly.

## Compare operational costs

| Concern | Modular monolith | Microservices |
| --- | --- | --- |
| Calls | Local interfaces | Network, deadlines, partial failure |
| Transactions | Often local | Cross-service workflow or coordination |
| Scaling | Usually whole deployment | Per capability, with dependency limits |
| Releases | One artifact | Version compatibility and many artifacts |
| Debugging | Fewer process boundaries | Tracing and correlation are essential |

Independent deployability is an organizational capability, not merely separate repositories. Build automation, contract testing, telemetry, and incident ownership must support it.

## Extract incrementally

A strangler migration routes one capability to a new implementation while the old application continues serving the rest. Establish an interface, identify data ownership, backfill the new store, synchronize changes, compare behavior, and cut over gradually.

Avoid uncoordinated dual writes from old and new applications. Use an outbox or CDC path with verification and a defined rollback boundary. Retiring the old code and data ownership is part of the migration, not optional cleanup.

**Exercise:** A small team runs a successful monolith with one CPU-heavy PDF feature. Compare adding dedicated workers, extracting PDF generation, and splitting the entire application. Explain the smallest change that addresses the measured bottleneck.
