---
id: lesson-devops-grafana
kind: lesson
topicId: devops-grafana
title: Grafana dashboards and alerting
summary: Build dashboards that connect user outcomes, service health, and supporting telemetry.
status: published
revision: 1
order: 10
tags: [grafana, dashboards]
---

## Design for a question

Grafana queries configured data sources and displays panels in dashboards. Start with a question such as “Are checkout requests succeeding within the latency target?” Show request rate, error ratio, latency distribution, and saturation, then link to dependency and infrastructure views. Include units, time ranges, clear legends, and context such as deployment markers.

Choose aggregations carefully: a fleet p99 is not the average of individual p99s. Dashboard variables can filter service or environment, but queries must handle missing data and avoid excessive cardinality. Store dashboards as versioned configuration where practical and review access to sensitive data sources.

## Alerts and investigation

Grafana can evaluate alerts from supported data sources and route notifications according to configuration. An alert should identify user impact, owner, severity, and next steps. Test no-data and error behavior, alert grouping, and notification routes. A dashboard is not itself an alerting strategy: someone must be notified when a meaningful condition persists.

## Practice

Why might a green average-latency panel hide an incident? A small fraction of requests may be extremely slow. Why test no-data behavior? A broken telemetry pipeline can otherwise make a missing metric look healthy.

## Further reading

- [Grafana dashboards](https://grafana.com/docs/grafana/latest/dashboards/)
