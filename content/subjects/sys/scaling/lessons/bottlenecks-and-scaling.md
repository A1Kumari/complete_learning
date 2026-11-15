---
id: lesson-sys-scaling
kind: lesson
topicId: system-design-scaling
title: Scale the bottleneck, not the diagram
summary: Compare scale-up and scale-out, model serial bottlenecks, budget database connections, and design stable autoscaling.
difficulty: medium
status: published
revision: 1
order: 50
tags: [system-design, scaling, performance]
prerequisiteIds: [lesson-sys-capacity-estimation, lesson-sys-load-balancing]
---

## Vertical and horizontal scaling

Vertical scaling adds resources to an instance: more CPU, memory, faster disks, or better network capacity. It can be the simplest, cheapest next step when operational simplicity matters. Limits include hardware ceilings, failure blast radius, and whether a resource change requires restart; downtime is deployment-dependent, not inevitable.

Horizontal scaling adds instances. Stateless application replicas are relatively straightforward, while stateful systems need partitioning, replication, routing, and recovery. More machines add coordination costs and can increase pressure on a database or downstream API.

## Find the limiting resource

Look for CPU saturation, memory pressure, disk latency, network limits, lock contention, pool waits, and dependency delays. Distinguish a throughput ceiling from a tail-latency problem. A single hot tenant may saturate one shard while fleet-wide averages look healthy.

```text
Symptom -> measurement -> hypothesis -> controlled change -> new measurement

High API p99 -> pool acquisition wait is high
             -> database concurrency is saturated
             -> optimize query / reduce concurrency / cache eligible reads
             -> compare throughput and p99 under the same workload
```

Adding application replicas in this situation may make the queue at the database longer. Performance work should preserve correctness: caching inventory indefinitely is not an acceptable solution to overselling.

## Serial work bounds the benefit

Amdahl's law gives an idealized upper bound. If 20% of a workload is inherently serial and 80% can be parallelized perfectly, using ten workers gives:

```text
Speedup <= 1 / (0.20 + 0.80 / 10) ≈ 3.57
Infinite-worker limit = 1 / 0.20 = 5
```

Real coordination, network, and storage overhead can make the result worse. This model explains why moving every function to a separate service is not automatically a performance improvement.

## Scale storage in stages

1. Correct query plans, appropriate indexes, and bounded result sets.
2. Suitable hardware and enough memory for the working set.
3. Cache reads that tolerate the chosen freshness contract.
4. Add read replicas for eligible reads and understand replica lag.
5. Partition or shard when measured size or write load requires it.

These are options, not a mandatory sequence. Some distributed databases support horizontal writes directly; a single relational server may serve a large workload well. Choose based on access patterns and operations rather than labels like SQL versus NoSQL.

## Autoscaling is a feedback controller

Choose a signal tied to the bottleneck: CPU for compute-bound work, queue age for workers, or concurrent requests for I/O-bound services. Account for startup time, warm caches, and scale-down draining. Set minimum capacity for known peaks and failure headroom instead of relying entirely on reactive scaling.

Use cooldown or stabilization windows to avoid oscillation. Bound the maximum replica count according to downstream budgets. For example, a database connection limit of 600 cannot safely support 50 instances each independently configured for 30 connections.

**Exercise:** Image processing arrivals are 400 jobs/s and each worker completes 10 jobs/s. Forty workers only match arrivals; they do not drain an existing backlog. Calculate the spare throughput and time to drain 12,000 queued jobs with 60 workers: 200 jobs/s spare, or about 60 seconds if rates remain constant.
