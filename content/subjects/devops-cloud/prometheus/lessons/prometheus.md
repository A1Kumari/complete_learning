---
id: lesson-devops-prometheus
kind: lesson
topicId: devops-prometheus
title: Prometheus metrics and PromQL
summary: Understand scraping, metric types, labels, rates, and recording rules.
status: published
revision: 1
order: 10
tags: [prometheus, metrics]
---

## Collection and metric types

Prometheus typically scrapes HTTP endpoints exposed by applications or exporters. Each time series is identified by a metric name and labels. A counter increases except for resets, a gauge can go up or down, and histogram buckets support estimating a distribution. Scrape failures and target discovery failures need their own monitoring.

Use labels such as service and bounded status class, not unbounded user IDs or full URLs. Too many distinct label combinations increase storage and query cost. A scrape interval affects resolution and load; retention and high availability require deliberate design.

## Query a rate

```promql
sum by (service) (rate(http_requests_total[5m]))
```

`rate` estimates per-second counter increase over the window and accounts for counter resets. Apply `rate` before aggregation so resets are handled per series. Divide a similarly aggregated error rate by the total rate for an error ratio, and account for absent or zero traffic. Histogram quantiles require correctly aggregated buckets and are estimates.

Recording rules precompute frequently used expressions; alerting rules evaluate conditions. Check metric names and labels in your instrumentation rather than assuming this example exists.

## Practice

Why not graph the raw counter as request rate? It accumulates over time and resets on restart. Why is `user_id` a dangerous label? It can create a large, unbounded set of time series.

## Further reading

- [Prometheus querying basics](https://prometheus.io/docs/prometheus/latest/querying/basics/)
