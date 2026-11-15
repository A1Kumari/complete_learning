---
id: lesson-sys-stream-processing
kind: lesson
topicId: system-design-stream-processing
title: Logs, partitions, offsets, and event-time processing
summary: Understand Kafka-style logs, consumer groups, lag, replay, windowing, watermarks, and the scope of transactional processing.
difficulty: hard
status: published
revision: 1
order: 190
tags: [system-design, streaming, kafka]
prerequisiteIds: [lesson-sys-event-driven]
---

## A retained log is different from a work queue

A log appends records to ordered partitions and retains them according to policy, independently of whether a consumer has read them. Consumers track positions called offsets. Multiple applications can read the same history at different rates.

```text
Topic: order-events
  partition 0: offset 0, 1, 2, ...
  partition 1: offset 0, 1, 2, ...
  partition 2: offset 0, 1, 2, ...

Analytics group -> independent progress for every partition
Search group   -> its own independent progress
```

An offset is meaningful within its partition, not a global event sequence. Retention may delete records before a slow consumer reaches them. Compaction can retain the latest value per key while removing older records; it does not preserve every historical transition.

## Partitioning controls order and parallelism

Key records by order ID to keep one order's events in one partition under a stable partitioning scheme. In a conventional Kafka consumer group, each partition is assigned to at most one consumer at a time. More consumers than partitions do not add processing parallelism for that group; other consumption models have different semantics.

A hot key remains a bottleneck even with many partitions. Increasing partition count can change hash-based key placement for future records, so preserving per-key ordering during such changes requires care. Design entity sequencing explicitly if order is critical.

## Commit progress with the right effect boundary

If a consumer commits its offset before applying an effect, a crash can skip work. If it applies the effect before committing, a crash can repeat it. For a database sink, use a transaction that records both a deduplication/progress marker and the data change where possible.

Kafka transactions can atomically coordinate consumed offsets and produced Kafka records within their supported processing boundary, with consumers configured to read committed data. They do not automatically make an unrelated HTTP payment request atomic with those offsets. External sinks need their own transactional or idempotency protocol.

## Event time, processing time, and windows

Processing time is when a worker handles a record. Event time is when the business event occurred. A mobile client can upload yesterday's activity today; a processing-time daily report would place that activity in the wrong day.

A tumbling window divides time into non-overlapping intervals. A sliding window can overlap. A session window groups activity separated by an inactivity gap. Stateful operators keep partial aggregates and need checkpointing, retention, and restoration.

A watermark estimates progress in event time. It is not proof that no earlier record will ever arrive. Define allowed lateness and a policy: revise an aggregate, send a correction, or route late records to a separate path. Idle partitions need handling so they do not indefinitely hold back global progress.

## Capacity and recovery

Monitor lag in records and time, input rate, processing rate, partition skew, checkpoint duration, and state size. Replaying a week of events against a live database may overwhelm it even when the stream platform can deliver the data quickly. Throttle replay, isolate rebuilds, and verify output before switching consumers.

**Exercise:** Design five-minute purchase totals with events arriving up to ten minutes late. State when a result is provisional, when it is finalized, and how corrections reach users.

Reference: [Apache Kafka design and delivery semantics](https://kafka.apache.org/41/design/design/).
