---
id: sys-design-tail-latency-diagnosis
kind: question
topicId: system-design-observability
lessonId: lesson-sys-observability
prompt: "Average latency and CPU are stable, but p99 has increased. How would you investigate?"
difficulty: hard
status: published
revision: 1
order: 427
tags: [system-design, observability]
followUps: ["Why can you not average instance p99s into fleet p99?", "Which metric labels create dangerous cardinality?"]
---

## Answer

Inspect request histograms by endpoint and relevant bounded dimensions, then correlate slow traces with dependency spans, pool acquisition, queue waits, hot shards, payload size, and retries. Stable CPU does not exclude I/O saturation, a slow provider, connection limits, or skew affecting a small fraction of requests.

Compare recent deploys and workload changes, including timeout/error handling. Combine compatible histogram distributions rather than averaging per-instance percentiles. Follow the evidence with a falsifiable hypothesis, such as “slow traces share one shard and show storage wait rather than application compute.”

### Evaluation rubric

Require user-visible SLIs and cross-signal diagnosis. Strong answers include queue completion lag for asynchronous work, trace sampling limits, privacy, and avoiding user/event IDs as unbounded metric labels.
