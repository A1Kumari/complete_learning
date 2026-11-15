---
id: lesson-sys-capacity-estimation
kind: lesson
topicId: system-design-capacity-estimation
title: Estimate traffic, storage, bandwidth, and concurrency
summary: Calculate a workload budget with explicit units, peak assumptions, cache effects, Little's law, and failure headroom.
difficulty: medium
status: published
revision: 1
order: 20
tags: [system-design, capacity, performance]
prerequisiteIds: [lesson-sys-foundations]
---

## Start with a workload model

Suppose a service has 10 million daily active users. Each user makes 20 reads and 2 writes per day. Assume a 5x peak-to-average factor; this is a planning assumption to replace with measurements, not a universal constant.

```text
Read requests/day = 10,000,000 * 20 = 200,000,000
Write requests/day = 10,000,000 * 2 = 20,000,000
Seconds/day = 86,400
Average read QPS = 200,000,000 / 86,400 ≈ 2,315
Peak read QPS ≈ 11,575
Average write QPS ≈ 231.5; peak ≈ 1,158
```

Separate reads, writes, background jobs, and large uploads. Ten thousand cached lookups and ten thousand expensive joins are not equivalent loads. Include fan-out: one API call that makes six database queries can create six times as many backend operations.

## Storage is more than record size

At 500 bytes of logical data per write, daily raw growth is 10 GB using decimal units. One year is about 3.65 TB before retention deletions. Three full replicas require roughly 10.95 TB of raw replicated data. Add indexes, row overhead, free space, write-ahead logs, compaction overhead, and backups separately; a guessed single multiplier hides important assumptions.

For media, put large objects in object storage and metadata in the database. Estimate thumbnail variants and transcoding outputs rather than counting only the original upload. Deletion and retention policies can matter more than compression.

## Bandwidth and cache effects

If each read response is 20 KB, peak payload egress is approximately:

```text
11,575 reads/s * 20,000 bytes/read = 231,500,000 bytes/s
231.5 MB/s * 8 ≈ 1.852 Gbit/s
```

This excludes headers, TLS, retransmissions, and replication traffic. A CDN can reduce origin egress; it does not remove client-facing egress costs.

With a 95% cache hit ratio, average database reads become about 116/s rather than 2,315/s. However, size the fallback deliberately: a cold cache or outage can raise database read load toward the uncached rate. A hit ratio measured across all keys may also hide a costly query class with poor caching.

## Latency, throughput, and in-flight work

Latency is time per request; throughput is completed work per unit time. For a stable system, Little's law relates averages:

```text
Average in-flight requests = arrival rate * average time in system
10,000 requests/s * 0.2 seconds = 2,000 requests
```

Use matching boundaries: if time includes queueing, the in-flight count includes queued work. Do not substitute p99 latency into this equation and call the result average concurrency. As utilization approaches saturation, queueing can grow sharply even when throughput barely changes.

## Convert estimates into resource decisions

If a load test shows one instance meets its latency target at 1,000 requests/s, a 10,000 requests/s peak needs at least ten instances under those test conditions. Twelve instances give some headroom, but losing one of three equal zones leaves eight—insufficient for that peak. Failure capacity must be calculated explicitly.

Measure CPU time, memory per request, connection counts, disk operations, and network bandwidth. For an I/O-bound application, CPU-based autoscaling can miss a connection-pool bottleneck. Validate using realistic payload distributions and hot keys, not only uniform synthetic traffic.

**Exercise:** Recalculate the model with a 10x peak factor and a cache hit ratio falling from 95% to 80%. Database read traffic quadruples at the same frontend rate, and doubles again from the larger peak assumption.

Reference: [Google SRE on overload and the limits of QPS as a capacity measure](https://sre.google/sre-book/handling-overload/).
