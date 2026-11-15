---
id: lesson-sys-patterns
kind: lesson
topicId: system-design-patterns
title: Apply design patterns to real sources of change
summary: Use strategy, factory, adapter, decorator, observer, and state patterns selectively, with testable contracts and explicit trade-offs.
difficulty: medium
status: published
revision: 1
order: 300
tags: [system-design, lld, design-patterns]
prerequisiteIds: [lesson-sys-lld]
---

## Patterns name recurring design choices

A pattern is useful when it solves an actual variation or coordination problem. Introducing factories, builders, and abstract hierarchies before understanding the use cases can increase complexity without improving changeability. Prefer simple functions and composition until a concrete need appears.

Three broad families are creational patterns, which manage construction; structural patterns, which compose interfaces and objects; and behavioral patterns, which organize responsibilities and interactions.

## Match a pattern to a reason

| Pattern | Concrete problem | Cost to watch |
| --- | --- | --- |
| Strategy | Replace pricing, routing, or scheduling policy | Too many tiny interchangeable types |
| Factory | Select provider-specific implementations | Hidden dependencies or overly magical construction |
| Adapter | Normalize an external API to an internal contract | Losing important provider semantics |
| Decorator | Add tracing or limits around a stable interface | Order-dependent behavior and exception handling |
| Observer | Notify multiple local subscribers of changes | Reentrancy, subscriber failures, unclear ordering |
| State | Different behavior for explicit lifecycle states | Class explosion when a small transition table is enough |

## Strategy example

```python
from math import ceil

def hourly_price(minutes, hourly_rate):
    if minutes < 0 or hourly_rate < 0:
        raise ValueError("Negative duration or rate")
    return ceil(minutes / 60) * hourly_rate

def capped_price(minutes, hourly_rate, cap):
    if cap < 0:
        raise ValueError("Negative cap")
    return min(hourly_price(minutes, hourly_rate), cap)

def quote(minutes, policy):
    return policy(minutes)

assert quote(61, lambda m: hourly_price(m, 200)) == 400
assert quote(61, lambda m: capped_price(m, 200, 300)) == 300
```

The policy is a strategy even without a class hierarchy. The amounts here are integer minor units with a fixed currency assumed by the caller. A production price contract must specify currency, rounding, version, and whether later policy changes can alter an already issued quote.

## Adapter and decorator pitfalls

A payment adapter should normalize provider errors into meaningful categories: rejected, transient failure, and unknown outcome. Converting every exception into “payment failed” loses the information needed to avoid duplicate charges.

A retry decorator is safe only if the wrapped operation has a compatible idempotency contract. A caching decorator needs a correct key and freshness policy. Applying patterns mechanically can hide the very failure semantics the caller needs.

## Observer is not durable messaging

Calling local subscribers after an in-memory event is not equivalent to publishing a durable broker event. If the process crashes, subscribers may never run. If one subscriber raises, decide whether others still receive the event. Use an outbox and durable consumers when the business requires restart-safe delivery.

A global mutable singleton can create hidden state, test interference, and concurrency problems. A single configured dependency instance passed explicitly is often easier to reason about than a globally accessible singleton accessor.

## Refactor around observed change

When three payment providers use different APIs, an adapter plus factory may be justified. When only one exists, a small module can be enough. Preserve behavioral contracts with tests focused on outcomes and boundary cases rather than asserting a particular class structure.

**Exercise:** Design a notification sender supporting email and SMS. Identify what varies, where an adapter belongs, and which retry and deduplication rules must remain visible above the provider abstraction.
