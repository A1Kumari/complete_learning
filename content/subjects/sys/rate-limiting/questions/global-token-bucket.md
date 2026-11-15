---
id: sys-design-global-token-bucket
kind: question
topicId: system-design-rate-limiting
lessonId: lesson-sys-rate-limiting
prompt: "Why do three independent per-instance 100 requests/s token buckets fail to enforce a global 100 requests/s limit?"
difficulty: hard
frequent: true
status: published
revision: 1
order: 419
tags: [system-design, rate-limiting]
followUps: ["How can token leases reduce coordination?", "What happens if the shared limiter is unavailable?"]
---

## Answer

Each instance independently admits up to its own rate and burst capacity, so traffic spread across three instances can consume approximately three times the intended global sustained budget. A global policy requires coordinated state or explicit allocation of the total budget among instances or regions.

An atomic central bucket offers shared decisions at the cost of latency and dependency availability. Allocated token leases reduce coordination but permit bounded outstanding allocation and possible uneven utilization; quantify the maximum overshoot. Read-refill-check-decrement must be atomic for concurrent access.

### Evaluation rubric

Require identity scope, burst semantics, concurrency limits, and a fail-open/fail-closed decision. Strong answers mention local emergency protection and that `INCR` plus a separate expiry command can leave a faulty counter after a crash.
