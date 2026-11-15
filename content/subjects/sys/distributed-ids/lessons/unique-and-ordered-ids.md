---
id: lesson-sys-distributed-ids
kind: lesson
topicId: system-design-distributed-ids
title: Generate unique IDs without confusing them with event order
summary: Compare sequences, range allocation, UUIDs, and Snowflake-style IDs, including clock rollback, worker identity, collision, and public exposure.
difficulty: medium
status: published
revision: 1
order: 320
tags: [system-design, identifiers, distributed-systems]
prerequisiteIds: [lesson-sys-coordination]
---

## Requirements are not interchangeable

An ID may need uniqueness, compactness, sortability, low coordination cost, unpredictability, or locality in an index. State which are required. A unique identifier is not necessarily a trustworthy timestamp, an authorization credential, or a global ordering of completed transactions.

## Compare generation strategies

| Strategy | Benefits | Trade-offs |
| --- | --- | --- |
| Database sequence | Compact and simple | Central allocation, gaps, possible throughput or availability dependence |
| Allocated ranges | Amortizes central coordination | Unused gaps after failure, ranges do not imply commit order |
| Random UUID | Independent generation, low collision probability | Larger keys, random index locality, no inherent chronological order |
| Time-ordered UUID | Better time locality with distributed generation | Clock and implementation details; not a strict global ordering |
| Snowflake-style | Compact timestamp, worker, and sequence fields | Worker assignment and clock handling are correctness concerns |

Uniqueness constraints still belong at the storage boundary when collisions must be detected. Randomness lowers collision probability; it does not remove the need to handle a conflict safely.

## Snowflake-style bit budgeting

A common illustrative layout uses 41 timestamp bits, 10 worker bits, and 12 sequence bits, leaving one bit unused or reserved in a signed 64-bit value:

```text
ID = (milliseconds_since_epoch << 22) | (worker_id << 12) | sequence

41 timestamp bits -> about 69.7 years of milliseconds
10 worker bits -> 1,024 worker identities
12 sequence bits -> 4,096 IDs per worker per millisecond
```

These are layout limits, not measured throughput guarantees. Serialization, storage, clock precision, and workload affect actual performance. When the per-millisecond sequence space is exhausted, wait for a later timestamp or use another explicitly designed policy; silently wrapping the counter creates duplicates.

## Clocks and worker identity are part of the protocol

If time moves backward, generating IDs with an earlier timestamp and reused sequence can collide. Options include rejecting generation until the clock catches up, maintaining a logical high-water mark, or using a different ID scheme. Persist or otherwise safely recover the necessary state after restart.

Two live generators must not share the same worker identity and timestamp/sequence space. Lease expiration alone is insufficient if the previous generator can resume; design fencing or allocation that prevents overlapping use. Clock synchronization reduces drift but is not a correctness proof against rollback or pauses.

## Ordering and exposure

Time-sortable IDs offer approximate creation-time order across workers. A slower request can receive an earlier ID and commit later. For conversation order, ledger order, or causal dependencies, use an appropriate sequence or transaction protocol rather than sorting by ID and assuming causality.

Sequential or timestamp-bearing IDs can reveal volume and timing and make enumeration easier. Opaque public IDs can reduce exposure but are not authorization: every object access still checks permissions. JavaScript numbers cannot exactly represent every 64-bit integer, so APIs often serialize such IDs as strings.

**Exercise:** Select IDs for internal orders, public short links, and chat message ordering. Explain why one format may not satisfy all three requirements.

Reference: [UUID formats, RFC 9562](https://www.rfc-editor.org/rfc/rfc9562).
