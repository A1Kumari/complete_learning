---
id: lesson-python-performance
kind: lesson
topicId: python-performance
title: Measure and Improve Performance
summary: Profile representative workloads and optimize algorithms, allocations, and I/O.
difficulty: hard
status: published
revision: 1
order: 180
tags: [python, performance]
prerequisiteIds: [lesson-python-data-structures]
---

## Measure first

Start with a representative workload and a correctness test. Use `cProfile` to find expensive call paths, `timeit` for small isolated operations, and `tracemalloc` to investigate Python allocations. Profiling adds overhead; compare results under the same conditions and confirm improvements end to end.

```python
from timeit import timeit

values = list(range(1000))
print(timeit(lambda: sum(values), number=1000))
```

## Choose the right optimization

Algorithmic complexity and data structure choice often dominate micro-optimizations. Replacing repeated list membership tests with a set may help when its construction cost is amortized. Stream data when materializing it uses too much memory; batch I/O when calls are expensive.

`functools.lru_cache` trades memory for repeated computation and needs hashable arguments. Cache only when results are valid for the input and define an invalidation policy. Vectorized libraries can move numerical work into optimized native code, but conversion, memory, and library overhead matter.

## Benchmark responsibly

Warm up when appropriate, repeat measurements, report variation, and consider realistic data sizes. Latency, throughput, memory, and readability are different constraints. Avoid assuming that threads speed up CPU-bound Python on every interpreter.

## Practice

Profile a word-count program, change one bottleneck, and compare both runtime and memory without changing its output.
