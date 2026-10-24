---
id: ai-vector-filter-starvation
kind: question
topicId: ai-vector-databases
lessonId: lesson-ai-filtered-vector-search
prompt: Global top-2 contains another tenant's document and an obsolete revision. After filtering, no results remain although two eligible records exist. What query semantics are missing?
difficulty: medium
status: published
revision: 1
order: 900
tags: [vector-databases, filtering]
conceptIds: [concept-filtered-vector-search]
followUps:
  - Can a fixed oversampling multiplier guarantee k eligible results?
  - When might a filtered exact scan be preferable to ANN?
misconception: Post-filtered global top-k is not equivalent to top-k within the eligible subset.
---

## Answer

The system needs nearest neighbors among eligible records, using prefiltering or
a documented integrated filtered-search plan. Filtering only an already limited
global shortlist causes candidate starvation and can miss every eligible result.

### Supporting reasoning

Oversampling may reduce starvation but cannot guarantee k eligible results for
arbitrary selectivity. Measure filtered recall against an eligible exact baseline
and return an explicit short result set rather than relaxing tenant constraints.

### Evaluation rubric

One point each: correct subset semantics; starvation mechanism; meaningful
execution-plan fix; oversampling limit or filtered-baseline check.
