---
id: lesson-sys-load-balancing
kind: lesson
topicId: system-design-load-balancing
title: Balance traffic without hiding overload
summary: Compare L4 and L7 routing, balancing algorithms, health checks, connection draining, and failure-aware capacity.
difficulty: medium
status: published
revision: 1
order: 40
tags: [system-design, load-balancing, reliability]
prerequisiteIds: [lesson-sys-client-server]
---

## What a load balancer owns

A load balancer selects a backend from a set of eligible instances. It can improve utilization and tolerate instance loss, but cannot create capacity or repair shared dependencies. If every backend is waiting on the same overloaded database, spreading requests differently does not solve the bottleneck.

An **L4** balancer routes using transport-level information such as IP addresses and ports. It can pass encrypted connections through without inspecting HTTP. An **L7** balancer understands an application protocol and can route by host, path, header, or tenant, often after TLS termination. Choose based on required routing and operational costs rather than assuming one is always faster.

## Choose an algorithm for the workload

| Algorithm | Useful when | Important limitation |
| --- | --- | --- |
| Round robin | Requests have similar cost | Equal request counts do not imply equal work |
| Weighted round robin | Instances have different capacities | Static weights become stale |
| Least connections | Connection count reflects work | One connection can multiplex many expensive requests |
| Least outstanding requests | Requests have variable duration | Needs timely load information |
| Hash-based routing | Locality or affinity matters | Hot keys and membership changes cause skew |

The “power of two choices” approach samples two candidates and chooses the less loaded one, avoiding the cost of a perfectly global load view. No algorithm eliminates the need for backend concurrency limits.

## Health is more than a successful ping

Use separate signals:

- **Liveness:** Is the process stuck and in need of restart?
- **Readiness:** Can this instance safely receive new traffic?
- **Passive observations:** Are real requests producing excessive errors or latency?

Do not make liveness fail merely because a database is briefly unreachable; restarting every application may amplify the outage. Readiness checks should also avoid removing the entire fleet because a shared dependency is slow. Degraded service or targeted traffic rejection may be safer than declaring every instance unusable.

Use thresholds and hysteresis to avoid flapping. Newly started instances may need warm-up before full traffic. During deployment, stop assigning new requests, drain in-flight work within a deadline, then terminate. Long-lived WebSocket connections require an explicit reconnect strategy because draining can otherwise take indefinitely.

## Affinity and retries

Sticky sessions can improve cache locality but should not be the only mechanism preserving a user's cart or authentication state. If the selected server fails, essential state must be recoverable elsewhere. Cookies, source-IP hashing, and consistent hashing provide different affinity properties; source IP can group many users behind a NAT.

A proxy retry can duplicate a write after the first backend committed but lost its response. Restrict automatic retries to operations with a safe contract, preserve idempotency keys, and share a deadline across attempts. Never layer independent retries at every hop without an attempt budget.

## Capacity under failure

Three zones serving 12,000 requests/s evenly each handle 4,000 requests/s. After losing a zone, the remaining two each need 6,000 requests/s, a 50% increase. If that exceeds tested capacity, a health-aware balancer simply redirects overload to healthy machines. Reserve headroom, shed nonessential work, and test this transition.

**Exercise:** A service has low CPU but rising p99 latency and thousands of open connections. Explain why least-connections routing might help—or be misleading—and which queue and dependency metrics you would inspect first.
