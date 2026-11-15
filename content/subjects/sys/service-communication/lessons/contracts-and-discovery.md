---
id: lesson-sys-service-communication
kind: lesson
topicId: system-design-service-communication
title: Service protocols, gateways, and discovery
summary: Choose REST, gRPC, or asynchronous messaging, design compatible APIs, and manage discovery, authentication, deadlines, and connection reuse.
difficulty: medium
status: published
revision: 1
order: 240
tags: [system-design, api, communication]
prerequisiteIds: [lesson-sys-client-server, lesson-sys-reliability]
---

## Choose by interaction semantics

Synchronous calls are appropriate when a caller needs an immediate result. Asynchronous messaging is appropriate when delayed completion is acceptable, work must survive caller disconnection, or consumers need independent processing. A message bus does not make an operation instantaneous; it moves waiting into a durable workflow.

| Option | Benefits | Costs |
| --- | --- | --- |
| HTTP/JSON REST-style API | Broad tooling, browser compatibility, debuggability | Schema discipline and payload overhead |
| gRPC with Protocol Buffers | Typed contracts, code generation, streaming | Tooling, proxy, and client compatibility requirements |
| Brokered messages | Buffering, replay or routing, independent consumers | Duplicate handling, lag, operational complexity |

gRPC is not automatically faster for every workload, and REST does not imply the absence of schemas. Measure realistic payloads and consider organizational usability.

## Design a contract callers can recover with

```http
POST /v1/orders
Idempotency-Key: tenant-7-checkout-391
Content-Type: application/json

{"items":[{"product_id":"p42","quantity":2}]}
```

Define validation errors, authentication, authorization, rate limits, operation identity, and whether the response confirms a durable order or a completed purchase. Bind an idempotency key to the authenticated caller and request fingerprint so the same key cannot silently authorize a different payload.

Use cursor pagination for large collections with a deterministic unique sort order. Evolve schemas compatibly: add optional fields, define defaults, reserve removed protobuf field numbers, and avoid changing units without a version transition. Clients should not assume response field ordering in JSON.

## Discovery and routing

Service instances change as deployments and autoscaling run. Discovery maps a logical service name to eligible destinations through DNS, a registry, platform networking, or a proxy layer.

Client-side discovery lets libraries choose a backend but requires consistent behavior across languages. Server-side discovery centralizes selection in a proxy or service layer but adds another operational component. Cache discovery results with bounded staleness and handle removed endpoints; DNS TTL is not a complete guarantee that every client immediately reconnects.

Connection reuse improves latency but can pin requests to old instances. Drain connections during deployment, refresh destinations, and use bounded connection lifetimes where appropriate. An HTTP/2 connection can carry many streams, so balancing only connection counts may miss load skew.

## Gateway and service responsibilities

An API gateway can terminate TLS, authenticate clients, apply coarse limits, and route requests. Services still enforce resource-level authorization and business invariants. Internal network location is not sufficient proof of trust; authenticate service identities and authorize their actions.

A service mesh can standardize transport security, telemetry, and some policies. It cannot infer whether retrying a payment is semantically safe or whether a user owns an order. Those contracts remain application responsibilities.

## Avoid chatty and cyclic call graphs

Five sequential calls each adding 40 ms already contribute 200 ms before other work. Parallel calls reduce some latency but increase concurrency and fan-out. Combine appropriate operations, use read models for expensive aggregations, and avoid synchronous dependency cycles.

**Exercise:** Design a mobile dashboard that needs orders, recommendations, and account status. Decide what an aggregation endpoint returns if recommendations exceed their deadline without hiding an account authorization failure.
