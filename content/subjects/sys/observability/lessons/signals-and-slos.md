---
id: lesson-sys-observability
kind: lesson
topicId: system-design-observability
title: Observe distributed systems through user outcomes
summary: Connect metrics, structured logs, and traces to SLIs, error budgets, queue lag, cardinality budgets, and incident diagnosis.
difficulty: medium
status: published
revision: 1
order: 280
tags: [system-design, observability, sre]
prerequisiteIds: [lesson-sys-service-communication, lesson-sys-ha-dr]
---

## Begin with a user-visible question

“CPU is 60%” does not say whether checkout works. Define service-level indicators such as the fraction of valid orders accepted within one second, successful redirects within 100 ms, or notifications delivered within their promised window. Instrument both the synchronous request and eventual business completion.

An HTTP `202` can be healthy while a worker queue is stuck for hours. Measure acceptance and completion separately. An HTTP `200` carrying an unusable fallback should not silently count as full success if it violates the product contract.

## Three complementary signals

| Signal | Answers well | Design considerations |
| --- | --- | --- |
| Metrics | How often, how much, how fast? | Aggregation, histograms, label cardinality |
| Logs | What happened in this specific execution? | Structured fields, privacy, retention, cost |
| Traces | Where did time go across services? | Context propagation, sampling, span coverage |

Use a consistent correlation scheme: request ID, trace ID, operation ID, and relevant resource IDs. They serve different purposes. One payment operation may span several retries and traces; the stable operation ID is necessary for reconciliation.

## Instrument the boundaries

For requests, track rate, errors, and duration. For resources, track utilization, saturation, and errors. Add pool acquisition time, queue age, retry count, cache hit ratio, replication lag, and projection freshness where applicable.

Latency histograms support percentile estimation and aggregation. Do not average p99 values from separate instances and call that the fleet p99. Combine compatible histogram data or calculate from the underlying distribution. Include errors and timeouts deliberately so a service does not appear faster when its slowest requests fail.

## Distributed tracing

A trace contains spans for operations and their relationships. Propagate context through HTTP headers and message metadata. Background processing may use span links when a batch relates to many producer traces rather than forcing an artificial single parent.

```text
API request span
  |-> database transaction span
  |-> external payment span
  +-> outbox publication context
          -> worker processing span -> provider span
```

Sampling reduces cost but can miss rare failures. Tail-based sampling can retain interesting completed traces, with its own buffering and infrastructure costs. Protect sensitive payloads; a trace should not record raw credentials or payment data merely to make debugging easier.

## Alert on symptoms and actionable causes

Use SLO burn-rate alerts to detect excessive budget consumption over short and long windows. For example, if the allowed error fraction is 0.1% and the observed fraction is 1%, the budget is burning at 10x the sustainable rate. Pair urgent alerts with runbooks and an owner.

Avoid unbounded metric labels such as user ID, URL with arbitrary query strings, or event ID. Those values belong in appropriately controlled logs or traces, not in millions of new time series. Telemetry itself needs availability and spending limits.

**Exercise:** p99 rises while average latency and CPU remain stable. Use a trace, dependency histogram, and pool-wait metric to distinguish a hot shard from a slow third-party provider. Explain what evidence would falsify each hypothesis.

Reference: [OpenTelemetry signals](https://opentelemetry.io/docs/signals/).
