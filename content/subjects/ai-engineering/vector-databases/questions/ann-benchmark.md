---
id: ai-vector-ann-benchmark
kind: question
topicId: ai-vector-databases
lessonId: lesson-ai-approximate-indexes
prompt: How would you compare HNSW and IVF fairly rather than selecting whichever reports the fastest single query?
difficulty: hard
frequent: true
status: published
revision: 1
order: 890
tags: [vector-databases, benchmarking, recall]
conceptIds: [concept-ann-indexes]
followUps:
  - What is the denominator for ANN recall when fewer than k items are eligible?
  - Which settings affect build cost versus query exploration?
misconception: Lower latency at unmatched recall is not a fair index-quality comparison.
---

## Answer

Freeze corpus, held-out queries, metric, filters, and exact top-k references. Sweep
each index's search effort and compare recall–latency curves at matched conditions,
including p95 under target concurrency, memory, build time, and update cost.

### Supporting reasoning

Record hardware, batch size, warm-up, and cache state. HNSW connectivity/build
exploration differ from query efSearch; IVF nprobe controls searched lists.
Measure filtered slices and distinguish exact-neighbor agreement from human relevance.

### Evaluation rubric

One point each: shared exact baseline; parameter sweep/matched recall; realistic
latency and resource measures; filtering or relevance distinction.
