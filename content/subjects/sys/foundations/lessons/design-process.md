---
id: lesson-sys-foundations
kind: lesson
topicId: system-design-foundations
title: From ambiguous requirements to a defensible architecture
summary: Turn a product prompt into requirements, invariants, APIs, data models, and an architecture you can evaluate under load and failure.
difficulty: easy
status: published
revision: 1
order: 10
tags: [system-design, requirements, hld]
---

## What system design actually solves

System design is the process of choosing components and contracts that meet a workload's requirements under realistic constraints. A diagram becomes a design only when you can explain why its components exist, what they own, and what happens when they are slow or unavailable. Start with the simplest system that satisfies the requirements, then evolve it using evidence.

**High-level design (HLD)** describes service boundaries, data flows, storage, deployment, scaling, and failure behavior. **Low-level design (LLD)** describes interfaces, objects, state transitions, algorithms, and transaction boundaries inside those services. They should agree: a high-level requirement to prevent duplicate charges needs a concrete low-level idempotency contract.

## Clarify the product before choosing technology

For a URL shortener, ask whether users need custom aliases, expiration, analytics, authentication, or link editing. Explicitly exclude features that are not needed in the first version.

Separate three types of requirements:

| Type | Example | Architectural consequence |
| --- | --- | --- |
| Functional | Create a link and follow it | Write API and redirect API |
| Quality attribute | Redirect p99 below 100 ms in the serving region | Small critical path, regional cache |
| Correctness invariant | One active alias maps to one destination | Unique constraint and conflict handling |

State availability and durability separately. A service can be temporarily unreachable without losing data; a fast response is not proof that data was durably committed. Ask what acknowledged data loss is acceptable, what retention applies, and whether reads must reflect a user's latest write.

## A repeatable design sequence

1. Define users, core operations, and the most important success criteria.
2. Estimate traffic, storage growth, hot objects, and peak concurrency.
3. Write APIs and a logical data model before picking databases.
4. Draw one successful write and one successful read end to end.
5. Identify the first bottleneck and justify a targeted change.
6. Walk through retries, timeouts, overload, node loss, and regional failure.
7. Add operational signals, recovery procedures, and cost considerations.

An initial architecture can be deliberately small:

```text
Browser -> load balancer -> application -> relational database
                                  |
                                  +-> outbox -> worker -> analytics
```

The database owns link mappings. The worker processes analytics asynchronously so a slow analytics sink cannot block redirects. A cache belongs on the read path only after the traffic or latency target justifies it.

## Define contracts, not just boxes

For each arrow specify protocol, timeout, authentication, request identity, and retry ownership. For each store specify authoritative versus derived state, key, indexes, retention, and consistency. For each queue specify what an acknowledgement means and when a consumer records progress.

A decision record can be four sentences: “Redirects dominate writes. We choose cache-aside for mappings to reduce database reads. A database miss remains authoritative, and deleted links must stop redirecting within 30 seconds. We accept bounded cache staleness and measure hit ratio and invalidation delay.” This is more useful than “Use Redis because it is fast.”

## Interview walkthrough and practice

For a 45-minute interview, a reasonable starting allocation is 5 minutes for scope, 5 for estimates and contracts, 10 for the baseline architecture, 20 for two important deep dives, and 5 for failure review. Adapt to the interviewer rather than treating this as a script.

**Exercise:** Design an appointment booking service. Write three invariants before drawing anything. A good answer includes no double booking, explicit hold expiration, and a defined response to a payment timeout. Explain which invariant requires a database transaction and which workflow can be asynchronous.

Continue with [capacity estimation](../../capacity-estimation/lessons/workload-estimation.md) and the [worked URL shortener](../../end-to-end/lessons/url-shortener.md).
