---
id: lesson-devops-capacity
kind: lesson
topicId: devops-capacity
title: Performance and capacity planning
summary: Measure workload demand, identify bottlenecks, and plan headroom for growth and failures.
status: published
revision: 1
order: 10
tags: [capacity, performance]
---

## Measure demand and constraints

Track request rate, latency percentiles, error rate, queue depth or age, and utilization and saturation of CPU, memory, storage, network, and downstream pools. Average utilization can hide a hot shard or short peak. Establish normal seasonal patterns and business growth assumptions, including retries and batch workloads.

Capacity is constrained by the bottleneck, not the sum of every server's theoretical capacity. For example, scaling API replicas cannot improve throughput once the database connection limit or write throughput is saturated. Reserve headroom for node failures, maintenance, deployments, and recovery, not just normal traffic.

## Test and forecast

Use representative load tests to establish throughput and latency under normal, peak, and failure conditions. Increase load gradually and observe the knee where latency or errors rise sharply. Test in an environment and dataset representative enough for the question; avoid assuming results transfer unchanged to production. Forecast demand, account for lead time and quotas, and revise after measurement. Load testing must be coordinated with dependent systems and provider limits.

## Practice

Why can more workers worsen latency? They may increase contention on a saturated database or downstream API. Why test a node failure? Normal capacity may not leave enough headroom for the remaining nodes.

## Further reading

- [Google SRE handling overload](https://sre.google/sre-book/handling-overload/)
