---
id: ai-prompt-regression-evaluation
kind: question
topicId: ai-prompt-engineering
lessonId: lesson-ai-prompt-evaluation
prompt: How do you establish that a new prompt improves the application rather than just a few examples?
difficulty: medium
status: published
revision: 1
order: 510
tags: [prompting, evaluation, regression-testing]
followUps:
  - Why compare paired errors and important slices?
  - What happens if the held-out dataset is repeatedly used to tune prompts?
misconception: A few successful demonstrations or a format-only score cannot establish general task quality.
---

## Answer

Define acceptance criteria first, compare a frozen baseline and candidate on reviewed
representative held-out cases, inspect paired regressions and slices, and include
latency, cost, failures, and stochastic variability.

### Supporting reasoning

Separate format from semantics and keep failures in the denominator. Repeated tuning
on the test set makes it development data; gather fresh held-out evidence.

### Evaluation rubric

One point each: explicit criteria; representative held-out comparison; paired/slice
regression analysis; variability and end-to-end constraints.
