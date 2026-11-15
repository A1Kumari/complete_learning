---
id: lesson-devops-observability
kind: lesson
topicId: devops-observability
title: Metrics, logs, and traces
summary: Instrument services to connect user-facing symptoms with internal causes.
status: published
revision: 1
order: 10
tags: [observability, telemetry]
---

## Three complementary signals

Metrics summarize measurements over time: request rate, error ratio, latency, saturation, and queue age. Logs record individual events and contextual details. Traces connect spans across a request's execution path, helping locate latency and failures across services. No one signal explains every problem; correlate them using timestamps, service identity, and trace or request IDs.

Instrument at meaningful boundaries: incoming requests, downstream dependencies, background queue processing, and user-visible completion. A successful HTTP response may merely accept work that later fails. Use histograms for latency distributions and compute fleet-wide percentiles from compatible aggregated histogram data, not by averaging instance p99 values.

## Control cost and quality

Use bounded metric labels; a user ID or request ID as a label can create excessive time series. Put high-cardinality identifiers in appropriately protected logs or traces instead. Define retention, sampling, access control, and redaction for sensitive data. Missing telemetry can itself hide failures, so monitor the telemetry pipeline.

## Practice

Latency increased: use metrics to determine when and which operation, traces to identify the slow hop, and logs for specific error context. Why not record every request body? Cost and sensitive-data exposure can outweigh diagnostic value.

## Further reading

- [OpenTelemetry observability primer](https://opentelemetry.io/docs/concepts/observability-primer/)
