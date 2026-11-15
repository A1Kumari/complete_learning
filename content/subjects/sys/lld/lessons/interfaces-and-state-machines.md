---
id: lesson-sys-lld
kind: lesson
topicId: system-design-lld
title: Translate requirements into interfaces and state machines
summary: Model entities, value objects, interfaces, invariants, and legal transitions while keeping infrastructure separate from domain behavior.
difficulty: medium
status: published
revision: 1
order: 290
tags: [system-design, lld, oop]
prerequisiteIds: [lesson-sys-foundations, lesson-sys-concurrency]
---

## Start with behavior and invariants

Low-level design is not a contest to draw the most classes. Identify use cases and rules, then assign responsibilities. For booking, rules might include one confirmed reservation per seat, an expired hold cannot be confirmed, and cancellation cannot silently refund twice.

An **entity** has identity over time, such as an order. A **value object** is defined by its values, such as money with currency. An **aggregate** groups state whose invariants are enforced together. A **repository** abstracts retrieval and persistence; an **application service** coordinates a use case and transaction boundary.

## Model transitions explicitly

```text
AVAILABLE -> HELD -> CONFIRMED
                |-> EXPIRED
                +-> RELEASED
```

Who may transition the object? What preconditions apply? What does a repeated command return? Can an expiration worker race with confirmation? These questions matter more than whether the diagram uses a particular UML arrow style.

```python
from dataclasses import dataclass
from enum import Enum

class State(Enum):
    HELD = "held"
    CONFIRMED = "confirmed"
    EXPIRED = "expired"

@dataclass
class SeatHold:
    holder: str
    expires_at: int
    state: State = State.HELD

    def confirm(self, actor, now):
        if actor != self.holder:
            raise PermissionError("Hold belongs to another user")
        if self.state is State.CONFIRMED:
            return False  # repeated confirmation: no new transition
        if self.state is not State.HELD or now >= self.expires_at:
            raise ValueError("Hold is not confirmable")
        self.state = State.CONFIRMED
        return True

hold = SeatHold("user-7", expires_at=100)
assert hold.confirm("user-7", now=90)
assert not hold.confirm("user-7", now=95)
```

This is an executable domain model, not a concurrent reservation service. Production persistence must conditionally commit the transition with a version check, lock, or suitable transaction. An in-memory state assignment does not protect against another process confirming the same seat.

## Interfaces define replaceable boundaries

Depend on narrow contracts such as `PaymentGateway.authorize(operation_id, amount)` or `OrderRepository.load(id)`, not directly on provider-specific request objects throughout the domain. A fake implementation can test orchestration, while integration tests verify the real adapter's contract.

Inject a clock for expiration behavior and an ID generator for identities. This makes tests deterministic and surfaces assumptions about time. Keep network retries out of pure domain methods; the application layer can coordinate deadlines and recovery without obscuring business transitions.

## UML as communication

A class diagram can show composition, dependencies, and interfaces. A sequence diagram can reveal transaction boundaries and failure paths. A state diagram can expose missing transitions. Use the smallest diagram that explains a decision, and pair it with concrete method contracts.

**Exercise:** Add cancellation to the hold model. Define behavior before and after confirmation, which transitions require compensation, and which database constraint protects seat uniqueness. Explain how the object model and persistence protocol work together rather than treating either as sufficient alone.
