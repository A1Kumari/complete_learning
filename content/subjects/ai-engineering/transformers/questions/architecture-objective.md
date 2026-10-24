---
id: ai-transformer-architecture-objective
kind: question
topicId: ai-transformers
lessonId: lesson-ai-transformer-variants
prompt: Why is an ordinary bidirectional encoder not a drop-in causal next-token predictor, and how can a causal decoder train on many positions in parallel?
difficulty: hard
status: published
revision: 1
order: 830
tags: [transformers, training, objectives]
conceptIds: [concept-transformer-variants]
followUps:
  - What input and label arrays would you form from BOS, hello, world?
  - Why can low teacher-forced loss coexist with poor generation?
misconception: Parallel training computation does not imply parallel generation of unknown autoregressive tokens.
---

## Answer

A bidirectional encoder ordinarily lets each position read future input positions,
which violates causal prediction if they include the target information. A causal
decoder trains with shifted labels and masks future keys, allowing known input
positions to be computed together without future-token access.

### Supporting reasoning

Inputs `[BOS,hello]` predict labels `[hello,world]`. At inference the next token
must first be selected before it becomes a subsequent input. Check both masking
and label alignment when investigating leakage.

### Evaluation rubric

One point each: visibility distinction; shifted labels; causal parallel training;
sequential inference or leakage diagnosis.
