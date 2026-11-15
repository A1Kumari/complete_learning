---
id: lesson-sys-oop-problems
kind: lesson
topicId: system-design-oop-problems
title: Work through parking, elevator, and library designs
summary: Practice object-oriented modeling with resource allocation, lifecycle transitions, policy interfaces, concurrency, and failure cases.
difficulty: medium
status: published
revision: 1
order: 310
tags: [system-design, lld, oop]
prerequisiteIds: [lesson-sys-lld, lesson-sys-patterns]
---

## Parking lot: allocate a resource safely

Clarify vehicle categories, spot compatibility, entrances, exits, reservations, pricing, and payment methods. Model `ParkingLot`, `Floor`, `Spot`, `Vehicle`, `Ticket`, and `PaymentAttempt`, but give each a specific responsibility.

- `Spot` owns compatibility and occupancy state, not billing.
- `AllocationPolicy` chooses among eligible free spots.
- `Ticket` records entry time, vehicle, spot, and lifecycle.
- `PricingPolicy` computes a quote from defined facts.
- `ParkingService` coordinates allocation and persistence.

```text
allocate(vehicle):
  find compatible candidate using allocation policy
  atomically claim candidate if still free
  create ticket in the same transaction
  if conflict: choose another candidate or report full
```

Two entrances must not both issue a ticket for the same spot. A database uniqueness or conditional-update protocol is required across processes. On exit, bind payment to a stable ticket operation, record its outcome, and release the spot through an explicit transition. A retry must not charge again.

## Elevator: separate requests from scheduling

Distinguish **hall calls** (floor and desired direction) from **car requests** (destination inside a selected elevator). Model an elevator's position, direction, door state, capacity, service status, and ordered stops.

A controller assigns requests; a scheduling strategy chooses service order. A simple SCAN-style policy continues in one direction serving eligible stops, then reverses. Nearest-car selection alone can starve distant callers during continuous local traffic. Add aging or maximum-wait considerations.

```text
IDLE -> MOVING_UP / MOVING_DOWN -> STOPPED -> DOOR_OPEN -> DOOR_CLOSED
Any operational state -> OUT_OF_SERVICE through a defined safety protocol
```

State invariants include not moving with doors open and not accepting dispatches while out of service. Keep physical safety enforcement independent of a high-level scheduling algorithm; the classroom model does not replace a real certified control system.

Test simultaneous requests, direction changes, full cars, maintenance transitions, and request reassignment after a car fails.

## Library: distinguish title from physical copy

`BookTitle` stores bibliographic information. `BookCopy` is one borrowable item with its own barcode and state. `Loan` links a member and copy with issue and due dates. `Reservation` records waiting intent; `LoanPolicy` decides eligibility, limits, and duration.

```text
Copy states: AVAILABLE -> ON_LOAN -> AVAILABLE
                        |-> LOST
Reservation states: WAITING -> READY_FOR_PICKUP -> FULFILLED / EXPIRED
```

A unique active-loan constraint or locked transition prevents two members borrowing the same copy. Returning a book closes the correct loan idempotently and may move a waiting reservation into a time-bounded pickup hold.

Search by title or author uses a catalog/index; availability is checked against authoritative copy state at checkout. A stale search index should not authorize an invalid loan. Fines need explicit currency, rounding, waived-fee policy, and audit history.

## Evaluate the design rather than the noun list

For each problem, produce a short sequence for the main use case, a state transition table, and one concurrent failure trace. Ask which object enforces each rule and which storage operation makes that rule durable.

**Exercise:** Extend the parking design with prebooked reservations, then explain why an expired reservation cannot release a spot that has already been occupied by another ticket. Identify the version or ownership check that prevents this race.
