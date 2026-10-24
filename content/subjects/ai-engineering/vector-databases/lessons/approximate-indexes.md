---
id: lesson-ai-approximate-indexes
kind: lesson
topicId: ai-vector-databases
title: HNSW, IVF, and the Recall–Latency Trade-off
summary: Explain graph and partition-based approximate search, reproduce an IVF boundary miss, and design a fair index benchmark against exact neighbors.
difficulty: hard
status: published
revision: 1
order: 450
tags: [vector-databases, ann, hnsw, ivf, benchmarking]
conceptIds: [concept-ann-indexes]
prerequisiteIds: [lesson-ai-exact-vector-search]
---

## Search fewer candidates, accept possible misses

Approximate nearest-neighbor search (ANN) trades exhaustive exploration for lower
query work. It can miss an exact nearest neighbor even when every scored candidate
uses an exact distance calculation. Compression adds a different approximation:
distances themselves may be computed from lossy vector codes.

| Index family | Mechanism | Typical controls and costs |
| --- | --- | --- |
| Flat | Compare every eligible vector | Predictable exact baseline; linear scan work |
| HNSW | Navigate a hierarchy of neighbor graphs | More graph links/build exploration cost memory and build time; broader search often improves recall |
| IVF | Assign vectors to coarse cells; probe selected lists | More probed cells cost more distance work; requires representative centroid training |
| IVF with product quantization | Probe cells and score compressed codes | Reduces storage; introduces code-distance error as well as candidate misses |

In common HNSW implementations, `M` controls graph connectivity, `efConstruction`
build exploration, and `efSearch` query exploration. These are not interchangeable
with output k. IVF uses `nlist` cells and searches `nprobe` of them. There is no
universal fastest family or best parameter setting independent of data and hardware.

```text
query → graph navigation OR nearest coarse cells → visited candidates → top-k
                                              unvisited true neighbor → miss
```

## Reproduce an IVF boundary failure and measure work

This executable one-dimensional IVF-style index uses declared centroids rather
than trained k-means. It performs real cell assignment and partial probing, but
does not implement HNSW or reproduce a vendor's optimized index.

```python
from statistics import median
from time import perf_counter

points = {'A': 4.8, 'B': 5.1, 'C': 9.0}
centroids = [0., 10.]
cells = {i: [] for i in range(len(centroids))}
for doc, value in points.items():
    cell = min(cells, key=lambda i: (abs(value-centroids[i]), i))
    cells[cell].append(doc)

def rank(query, candidates, k=1):
    return sorted(candidates, key=lambda doc: (abs(points[doc]-query), doc))[:k]

def probe(query, nprobe):
    selected = sorted(cells, key=lambda i: (abs(centroids[i]-query), i))[:nprobe]
    candidates = [doc for i in selected for doc in cells[i]]
    return rank(query, candidates), len(candidates)

query = 4.99
truth = rank(query, points)
one, work_one = probe(query, 1)
two, work_two = probe(query, 2)
assert truth == ['B'] and one == ['A'] and two == ['B']
recall_one = len(set(one) & set(truth)) / len(truth)
recall_two = len(set(two) & set(truth)) / len(truth)
assert (work_one, work_two) == (1, 3)
def elapsed(operation):
    samples = []
    for _ in range(20):
        start = perf_counter()
        operation()
        samples.append(perf_counter()-start)
    return median(samples)
timings = {'exact': elapsed(lambda: rank(query, points)),
           'probe-1': elapsed(lambda: probe(query, 1)),
           'probe-2': elapsed(lambda: probe(query, 2))}
assert all(value >= 0 for value in timings.values())
print(f'probe-1 recall={recall_one:.1f}, distances={work_one}; '
      f'probe-2 recall={recall_two:.1f}, distances={work_two}')
```

The query is slightly nearer centroid 0, but its true nearest point B belongs to
centroid 10. Exact distances to visited points cannot recover B when its list was
never visited. Probing both cells restores recall here. Inspect `timings` locally;
three points cannot substantiate a speed claim and index overhead may dominate.

## Benchmark the deployed workload

Define `ANN Recall@k = |approximate_top_k ∩ exact_top_k| / k` when at least k
eligible items exist; otherwise declare a denominator such as the exact result count.
This is distinct from Recall@k over human-relevant documents.

Use the same corpus, queries, eligibility, metric, and tie policy for both systems.
Sweep search effort and measure recall alongside p50/p95 latency, throughput under
target concurrency, index memory, build duration, and update cost. Separate query
encoding time from index time, while also recording end-to-end latency. Warm-up,
cache state, filters, batch size, and hardware must be recorded, not silently changed.

Do not tune on the final held-out queries. Slice by tenant size, filter selectivity,
language, and input type; an average can hide severe misses on a small segment.
Rebenchmark after corpus drift or rebuilds. HNSW deletion support, concurrency,
and persistence are implementation-specific; a database using HNSW may offer
tombstones even when a particular standalone HNSW library cannot remove graph nodes.

## Recall

Why can exact reranking of ANN candidates still miss the exact nearest neighbor?
Which IVF parameter changes query exploration? What extra data would make the
tiny example a credible capacity benchmark?

## References

- [Faiss: flat, IVF, HNSW, and compression](https://github.com/facebookresearch/faiss/wiki/Faiss-indexes)
- [HNSW original paper](https://arxiv.org/abs/1603.09320)
