---
id: lesson-sys-reliability
kind: lesson
topicId: system-design-reliability
title: Timeouts, retries, circuit breakers, and bulkheads
summary: Keep partial failures bounded with propagated deadlines, retry budgets, idempotency, circuit breakers, concurrency isolation, and graceful degradation.
difficulty: hard
status: published
revision: 1
order: 210
tags: [system-design, reliability, resilience]
prerequisiteIds: [lesson-sys-load-balancing, lesson-sys-message-queues]
---

## A dependency can fail without stopping

The most damaging dependency is often slow rather than completely down. Requests retain memory, connections, and worker slots while waiting. The caller then becomes slow, causing its callers to accumulate work. Reliability patterns aim to bound this amplification.

Start with an end-to-end deadline. If a user request has 800 ms remaining, a downstream call cannot independently spend three seconds. Include connection establishment, pool acquisition, response reading, and any retries in the budget. Propagate cancellation where supported; abandoning a response does not guarantee the server stopped doing work.

## Retry only when another attempt can help

Transient connection resets, throttling with retry guidance, and some server failures may justify retry. Invalid input and authorization denial usually do not. An uncertain write requires an idempotency identity, not a new operation every time.

Use exponential backoff with full jitter:

```text
maximum_delay(attempt) = min(cap, base * 2^attempt)
actual_delay = random value between 0 and maximum_delay
retry only if attempts, deadline, and shared retry budget permit
```

If three layers each allow three total attempts, the deepest dependency can see up to 27 attempts for one user request. Assign retry ownership to the layer with enough context and limit fleet-wide retry amplification. Hedged requests can reduce tail latency for safe reads, but duplicate backend load and require their own budget.

## Circuit breakers reduce futile calls

```text
CLOSED -> failures exceed threshold -> OPEN
OPEN -> cooldown expires -> HALF-OPEN
HALF-OPEN -> bounded probes succeed -> CLOSED
HALF-OPEN -> probes fail -> OPEN
```

A breaker needs a measurement window, minimum sample size, error classification, probe limit, and recovery policy. Half-open does not have to mean exactly one probe; implementations differ. Breakers are often local to callers, so a large fleet can still produce many probes. They complement, rather than replace, timeouts and admission control.

## Bulkheads contain resource exhaustion

Give critical and noncritical dependencies separate concurrency limits or worker pools. If recommendation calls stall, checkout should retain capacity. Bound every queue, including executor queues and pool waiters. Reject early when the system cannot meet the deadline instead of consuming resources for work that will expire.

Fallbacks need a correctness contract. A stale recommendation list is usually acceptable; inventing a successful payment is not. A fallback that hits the same failed database can worsen the incident. Track when degradation is active so “successful” HTTP responses do not hide a broken experience.

## Test a failure matrix

Inject slow responses, dropped acknowledgements, partial dependency errors, DNS failures, and zone loss. Observe request success, p99 latency, retry ratio, queue age, open breakers, and exhausted pools. A resilient service should remain within its intended resource envelope rather than crash from unlimited pending work.

**Exercise:** Design a product page that calls inventory, pricing, and recommendations. Set deadlines, retry ownership, concurrency budgets, and fallback behavior for each. Explain why pricing and recommendations may need different failure policies.

Reference: [Google SRE on handling overload](https://sre.google/sre-book/handling-overload/).
