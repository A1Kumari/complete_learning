---
id: ai-retrieval-score-fusion
kind: question
topicId: ai-retrieval-systems
lessonId: lesson-ai-hybrid-retrieval
prompt: Why can adding raw BM25 and cosine scores be misleading, and what does rank fusion gain and lose?
difficulty: medium
frequent: true
status: published
revision: 1
order: 970
tags: [retrieval, fusion, calibration]
conceptIds: [concept-hybrid-retrieval]
followUps:
  - Why can per-query min-max normalization be unstable?
  - How would you evaluate whether hybrid retrieval actually improves the application?
misconception: Different retrieval scores are not automatically calibrated on a common relevance scale.
---

## Answer

BM25 and cosine differ in scale and distribution, so raw addition can let one
branch dominate arbitrarily. RRF uses within-list positions and is insensitive to
score rescaling, but discards score margins. Calibrated or justified normalized
score fusion is another approach that must be evaluated on representative data.

### Supporting reasoning

Multiplying BM25 scores by 100 preserves lexical ordering while changing raw sums.
RRF avoids that scale dependence but cannot distinguish decisive margins from
near ties at the same ranks. Tune fusion settings on development queries and
evaluate held-out exact-ID and paraphrase slices separately.

### Evaluation rubric

One point each: scale mismatch; RRF scale invariance; loss of margins;
calibration/evaluation qualification.
