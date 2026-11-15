---
id: lesson-devops-tracing
kind: lesson
topicId: devops-tracing
title: Distributed tracing and context propagation
summary: Follow requests using spans, trace context, OpenTelemetry, and sampling.
status: published
revision: 1
order: 10
tags: [tracing, opentelemetry]
---

## Trace a request

A trace describes a distributed operation through spans. A span records an operation's timing, attributes, status, and relationships. Instrument the API, database client, outgoing requests, and asynchronous consumers where useful. OpenTelemetry provides APIs, SDKs, instrumentation, and a collector; systems such as Jaeger can store and visualize traces.

Propagate trace context across HTTP and message boundaries using compatible formats such as W3C Trace Context. A consumer processing a batch may link to multiple producer spans rather than inventing a single parent. A trace ID in logs makes it easier to move between an error and its execution path.

## Sampling and interpretation

Sampling reduces overhead and cost but can omit rare errors. Head sampling decides early; tail sampling can retain traces based on completed behavior but requires buffering and infrastructure. Missing spans can reflect dropped data, missing propagation, or instrumentation gaps rather than missing work. Redact sensitive attributes and set retention policies.

## Practice

An API span lasts two seconds but its database child lasts 20 ms. Investigate other child spans and uninstrumented time before blaming the database. Does a single trace establish fleet-wide latency? No; use metrics for aggregate distributions.

## Further reading

- [OpenTelemetry traces](https://opentelemetry.io/docs/concepts/signals/traces/)
