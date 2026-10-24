---
id: ai-retrieval-reranking-budget
kind: question
topicId: ai-retrieval-systems
lessonId: lesson-ai-retrieval-reranking
prompt: Candidate recall improves when the rerank shortlist grows from 50 to 500, but p95 latency becomes unacceptable. How would you make the trade-off explicit?
difficulty: hard
status: published
revision: 1
order: 990
tags: [retrieval, latency, reranking]
conceptIds: [concept-retrieval-reranking]
followUps:
  - How do pair lengths and truncation affect this comparison?
  - What is a coherent fallback if only some candidates are scored before a timeout?
misconception: Candidate depth, rerank shortlist size, and final result count are separate parameters.
---

## Answer

Measure quality and latency across branch depth, fused shortlist size, batching,
and pair-length settings under realistic concurrency. Select an operating point
meeting the latency budget and required coverage. Define a timeout fallback, such
as the fully eligible fused ranking, rather than inventing scores for unprocessed pairs.

### Supporting reasoning

More candidates increase scoring and queueing work; long inputs can lose decisive
evidence through truncation. Record stage-level coverage so a cheaper configuration
does not silently remove essential sources before ranking.

### Evaluation rubric

One point each: independent depth controls; quality/latency measurement; realistic
length/concurrency factors; explicit partial-failure semantics.
