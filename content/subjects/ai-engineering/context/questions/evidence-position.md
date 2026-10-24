---
id: ai-context-position-experiment
kind: question
topicId: ai-context-engineering
lessonId: lesson-ai-context-evaluation
prompt: How would you test whether evidence position changes a model's use of long context?
difficulty: medium
status: published
revision: 1
order: 590
tags: [context-engineering, evaluation]
conceptIds: [concept-context-evaluation]
followUps:
  - Which variables should remain controlled?
  - Does a historical lost-in-the-middle result prove every current model behaves identically?
misconception: Context-window capacity is not a guarantee of position-independent evidence use.
---

## Answer

Move the same reviewed evidence among beginning/middle/end positions while keeping
question, distractors, model configuration, and context budget comparable. Score
supported answers and repeat when stochastic variability matters.

### Supporting reasoning

Measure actual counts and verify the complete evidence was packed. Historical
findings motivate tests, not a universal placement law or a cure of always putting
the answer last. Add multi-evidence cases beyond single-fact retrieval.

### Evaluation rubric

One point each: controlled position change; fixed configuration/context;
supported-outcome scoring and repeats; qualified interpretation of results.
