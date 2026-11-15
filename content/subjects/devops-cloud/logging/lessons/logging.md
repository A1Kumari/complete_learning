---
id: lesson-devops-logging
kind: lesson
topicId: devops-logging
title: Centralized structured logging
summary: Collect, search, retain, and protect logs across services and hosts.
status: published
revision: 1
order: 10
tags: [logging, observability]
---

## From event to search

Applications emit events, collectors ship them, and a backend stores and indexes or otherwise organizes them for queries. Structured JSON fields such as timestamp, severity, service, environment, operation, and trace ID make filtering more reliable than parsing arbitrary text. Normalize timestamps and document field names.

Loki commonly indexes labels and stores log content for query; Elasticsearch and OpenSearch support document indexing and search. Their indexing, retention, ingestion, and cost models differ. Avoid high-cardinality Loki labels such as request IDs; keep them in log fields and query appropriately. Backpressure or collector failure can cause delays or loss depending on configuration.

## Operate logs responsibly

Redact secrets, tokens, and unnecessary personal data before emission; access controls and retention are still required. Define sampling and rate limits for noisy logs without losing critical audit or error information. Monitor collector lag, dropped events, storage, and ingestion failures. Logs are evidence, not a substitute for metrics or traces.

## Practice

An error appears on one instance but not in centralized search: check local output, collector configuration, labels, ingestion delay, and time range. Why not use a request ID as a metric label? Its cardinality can grow per request.

## Further reading

- [Grafana Loki documentation](https://grafana.com/docs/loki/latest/)
