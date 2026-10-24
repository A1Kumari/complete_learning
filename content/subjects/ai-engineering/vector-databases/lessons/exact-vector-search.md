---
id: lesson-ai-exact-vector-search
kind: lesson
topicId: ai-vector-databases
title: Vector Storage Contracts and Exact Nearest Neighbors
summary: Define a compatible vector collection, implement exact cosine search, and use exhaustive results as a baseline for approximate indexing.
difficulty: medium
status: published
revision: 1
order: 440
tags: [vector-databases, knn, cosine, storage]
conceptIds: [concept-exact-vector-search]
prerequisiteIds: [lesson-ai-embedding-metrics]
---

## A vector index is one part of a database

An embedding encoder maps inputs into a vector space. A vector index organizes
those vectors for search. A vector database adds operational facilities such as
record identities, metadata, persistence, filtering, updates, replication, or
backups; exact capabilities depend on the product. A database does not necessarily
generate embeddings, and a nearest-neighbor library alone is not a complete
multi-user storage service.

```text
source + stable ID + version → embedding encoder → vector + metadata → index
query → compatible query encoder → eligibility + nearest neighbors → IDs + scores
```

Keep source text or a retrievable source reference alongside provenance. A bare
vector does not provide a citation, a document revision, or a permission policy.

## Declare compatibility before ingestion

Record dimension, numeric type, model/checkpoint, query/document preprocessing,
normalization, similarity metric, and score direction. Also record chunk identity,
source version, tenant/ACL metadata, and deletion state. Equal dimensions do not
mean two different encoders share a comparable space. Reject incompatible writes
instead of silently padding, truncating, or mixing vectors.

For unit vectors, cosine equals dot product. This lesson normalizes both query
and documents and sorts larger scores first. Real systems should follow the
encoder's contract rather than always normalizing by habit.

## Implement exhaustive top-k with stable ties

```python
from math import isfinite, sqrt

def unit(vector, dimension):
    if len(vector) != dimension or not all(isfinite(x) for x in vector):
        raise ValueError('wrong dimension or nonfinite vector')
    norm = sqrt(sum(x*x for x in vector))
    if norm == 0:
        raise ValueError('zero vector')
    return tuple(x / norm for x in vector)

def search(query, records, k):
    if type(k) is not int or k < 1:
        raise ValueError('positive integer k required')
    q = unit(query, 2)
    scored = [(record_id, sum(a*b for a, b in zip(q, unit(v, 2))))
              for record_id, v in records.items()]
    return sorted(scored, key=lambda pair: (-pair[1], pair[0]))[:k]

records = {'policy': (1., 0.), 'guide': (.8, .6), 'billing': (0., 1.)}
assert [i for i, _ in search((1., 0.), records, 2)] == ['policy', 'guide']
assert search((1., 0.), {}, 2) == []
for invalid in [(0., 0.), (1.,), (float('nan'), 0.)]:
    try:
        search(invalid, records, 2)
    except ValueError:
        pass
    else:
        raise AssertionError('invalid query accepted')
print('exact cosine top-2: policy, guide; invalid vectors rejected')
```

Policy scores 1, guide scores 0.8, billing scores 0. With fewer than k records,
return fewer results. Here document IDs break equal-score ties deterministically.
An actual store should validate and normalize documents once on ingestion; this
small baseline recomputes them to keep the example self-contained.

## Cost and appropriate use

Scanning N vectors of width D uses roughly `O(ND)` score work. Sorting all scores
costs `O(N log N)`; a bounded heap or partial selection can reduce top-k overhead.
Raw float32 vector storage is `4*N*D` bytes before IDs, indexes, metadata, and copies.
One million 768-dimensional vectors occupy about 3.07 GB of raw decimal-byte
storage. A graph index can add substantial overhead.

Exact search is often a useful choice for small collections, restrictive filters,
batched accelerator workloads, and ground-truth measurement. “Exact” means exact
under the specified vector metric and numerical representation, not exact semantic
truth. Poor embeddings can produce perfectly computed but irrelevant neighbors.

## Build the baseline first

Freeze a corpus snapshot, query set, metric, and eligibility rule. Save exact top-k
IDs as the reference when testing approximate search. Use a consistent tie policy
or tie-aware comparison if many neighbors have identical boundary scores. Keep
human relevance labels separate: agreement with a vector metric measures indexing
accuracy, not the quality of that metric for the user's task.

## Recall

Why is a model name part of the collection contract? What does exact search prove
when the nearest vector refers to the wrong policy? When might exhaustive search
over filtered records beat maintaining a large approximate index?

## References

- [Faiss index types and flat-search storage](https://github.com/facebookresearch/faiss/wiki/Faiss-indexes)
- [Faiss metric conventions and normalized cosine](https://github.com/facebookresearch/faiss/wiki/MetricType-and-distances)
