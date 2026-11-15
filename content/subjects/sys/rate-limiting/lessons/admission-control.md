---
id: lesson-sys-rate-limiting
kind: lesson
topicId: system-design-rate-limiting
title: Design rate limits that match the resource budget
summary: Compare token buckets, leaky buckets, fixed and sliding windows, distributed counters, and explicit fail-open versus fail-closed behavior.
difficulty: hard
status: published
revision: 1
order: 200
tags: [system-design, rate-limiting, algorithms]
prerequisiteIds: [lesson-sys-capacity-estimation, lesson-sys-concurrency]
---

## Define what you are limiting

A policy needs an identity, resource, cost, interval, and burst allowance. “100 requests per minute” is incomplete: per IP, authenticated user, API key, tenant, or entire service? Large exports may cost more than metadata lookups. IP limits can group unrelated users behind NAT; user limits require trusted authentication.

Rate limits control arrivals. Concurrency limits bound in-flight work. Both may be needed: 100 very slow requests/s can exhaust a connection pool even when the arrival rate is within policy.

## Compare algorithms

| Algorithm | State | Behavior |
| --- | --- | --- |
| Fixed window | Count and window ID | Cheap; bursts can straddle boundaries |
| Sliding log | Timestamp per accepted request | Precise rolling window; memory grows with volume |
| Sliding counter | Counts for adjacent windows | Approximate rolling usage with small state |
| Token bucket | Tokens and last refill time | Allows bounded bursts and sustained refill rate |
| Leaky bucket | Queue/level and drain rate | Smooths output; queue must have finite capacity |

A fixed limit of 100/minute can admit 100 just before a boundary and another 100 just after it. Decide whether this is acceptable before choosing a cheaper implementation.

## Trace a token bucket

With capacity B=10 and refill r=2 tokens/s, a full bucket admits ten unit-cost requests immediately. One second later it admits two more. Tokens never exceed capacity:

```text
tokens = min(B, tokens + max(0, now - last_refill) * r)
if tokens >= cost:
    tokens -= cost
    allow
else:
    reject
```

The read, refill, test, and decrement must be atomic for concurrent requests. The following executable model is deliberately single-process and uses caller-supplied monotonic time:

```python
class TokenBucket:
    def __init__(self, capacity, rate, now=0.0):
        assert capacity > 0 and rate > 0
        self.capacity, self.rate = capacity, rate
        self.tokens, self.last = float(capacity), now

    def allow(self, now, cost=1):
        assert now >= self.last and cost > 0
        self.tokens = min(self.capacity, self.tokens + (now - self.last) * self.rate)
        self.last = now
        if self.tokens < cost:
            return False
        self.tokens -= cost
        return True

bucket = TokenBucket(3, 2)
assert [bucket.allow(0) for _ in range(4)] == [True, True, True, False]
assert bucket.allow(0.5)
assert not bucket.allow(0.5)
```

## Distributed enforcement

Per-instance buckets multiply the allowed global rate unless capacity is allocated among instances. A centralized atomic store provides shared decisions but adds latency and availability dependence. Regional token leases reduce coordination by distributing a global budget, with bounded overshoot determined by outstanding leases.

In Redis, separate `INCR` and expiry operations can leave an immortal counter after a crash. Use an appropriate atomic script or transaction and define expiry behavior. A strict global limiter must also address replication failover, key sharding, and time source behavior; a single atomic command alone is not a complete design.

## Rejection and failure policy

Return `429` with a useful retry hint for caller quota exhaustion. Use bounded local protection if the limiter is unavailable. Fail-open favors request availability but can violate cost or protection limits; fail-closed protects the resource but can block legitimate traffic. Choose per endpoint and retain a local emergency concurrency cap.

**Exercise:** Design tenant limits of 100 requests/s with a burst of 200 across three regions. State whether the limit is exact or approximate, its maximum overshoot, and how one noisy tenant is isolated.
