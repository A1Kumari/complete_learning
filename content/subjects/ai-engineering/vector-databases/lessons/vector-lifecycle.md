---
id: lesson-ai-vector-lifecycle
kind: lesson
topicId: ai-vector-databases
title: Upserts, Deletes, Consistency, and Index Rebuilds
summary: Preserve source-version ordering, prevent deleted records from reappearing, and plan compatible collection rebuilds with explicit visibility semantics.
difficulty: hard
status: published
revision: 1
order: 470
tags: [vector-databases, lifecycle, consistency, deletion]
conceptIds: [concept-vector-lifecycle]
prerequisiteIds: [lesson-ai-filtered-vector-search]
---

## A correct index can become stale

Source documents change while parsing, embedding, and indexing happen asynchronously.
A delayed embedding job can overwrite a newer vector. A delete may remove source
text while an older index or cache still serves a chunk. Search correctness includes
version and visibility semantics, not just the nearest-neighbor algorithm.

```text
source change → durable versioned event → embed matching revision → conditional upsert
delete event → tombstone + serving exclusion → index/cache cleanup → compaction
```

Use stable record identities and explicit source revisions. If chunk boundaries
change, track a manifest of chunk IDs per document version so obsolete chunks are
removed; an upsert of new IDs does not delete old ones automatically.

## Prevent delayed updates from resurrecting deleted records

```python
state = {}

def apply(record_id, revision, payload):
    # None is a deletion tombstone; revisions are monotonic per record.
    current = state.get(record_id)
    if current is not None and revision <= current['revision']:
        return False
    state[record_id] = {'revision': revision, 'payload': payload}
    return True

assert apply('policy', 2, {'vector': [1., 0.], 'text': 'new'})
assert not apply('policy', 1, {'vector': [0., 1.], 'text': 'old'})
assert apply('policy', 3, None)
assert not apply('policy', 2, {'vector': [1., 0.], 'text': 'late retry'})
assert not apply('policy', 3, None)
visible = [i for i, row in state.items() if row['payload'] is not None]
assert visible == [] and state['policy']['revision'] == 3
print('stale update rejected; delete retained; late retry cannot resurrect policy')
```

This is an in-memory, single-writer state machine, not a distributed transaction.
Equal revisions are assumed to describe the same immutable event; production
systems should detect conflicting duplicate payloads. A real implementation needs
atomic conditional writes or serialized event handling to make the comparison and
update indivisible. Removing tombstones too early loses protection against replay.

## Ask what “write succeeded” means

Distinguish accepted, durably stored, replicated, and searchable. Acknowledgment
may precede index visibility. Read-after-write behavior depends on the engine's
consistency, refresh, and query settings. Define a freshness target and expose
processing state when an uploaded document is not searchable yet.

Deletion may first become a serving exclusion and only later physical removal
during compaction. Track replicas, caches, source stores, and backup retention
separately. A library's inability to remove HNSW nodes does not imply a database
cannot implement logical deletion; it does mean physical reclamation and graph
maintenance need a declared strategy.

## Rebuild without mixing spaces

For a new encoder or incompatible preprocessing contract:

1. Create a new collection with the complete new contract and index settings.
2. Backfill from a source snapshot and record its event watermark.
3. Replay subsequent changes, including deletes, until caught up; use version
   checks so a late backfill cannot overwrite a newer event.
4. Compare exact/ANN recall, human relevance, tenant predicates, freshness, memory,
   and latency on held-out requests. Shadow queries must use the matching encoder.
5. Switch routing to the new encoder and collection as a coordinated versioned
   configuration. Keep a rollback path with a defined update/retention policy.

An atomic collection alias helps routing, but changing it alone does not coordinate
the application's query encoder. Do not compare old query vectors against new
document vectors merely because dimensions happen to match. Index-only rebuilds
under an unchanged vector contract may reuse vectors, but still need change capture
and serving checks.

## Recall and application

Trace source revision 7, deletion 8, and delayed embedding job 7. What stops
resurrection? How would you discover orphan chunks after rechunking? Which
acknowledgment is sufficient to promise that the next user query can find an upload?

## References

- [Qdrant: points, updates, and operation semantics](https://qdrant.tech/documentation/concepts/points/)
- [Qdrant: distributed consistency controls](https://qdrant.tech/documentation/scaling/distributed_deployment/)
- [Faiss: supported operations differ by index family](https://github.com/facebookresearch/faiss/wiki/Faiss-indexes)
