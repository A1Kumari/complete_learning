---
id: ai-prompt-failure-diagnosis
kind: question
topicId: ai-prompt-engineering
lessonId: lesson-ai-prompt-evaluation
prompt: When should you stop adding instructions and change something else in an LLM system?
difficulty: medium
status: published
revision: 1
order: 520
tags: [prompting, evaluation, reliability]
followUps:
  - Which fix addresses missing current evidence?
  - Why is asking the model whether it is correct an insufficient evaluator?
misconception: Prompt iteration cannot by itself manufacture missing facts or repair transport/integration bugs.
---

## Answer

Use a failure taxonomy. Missing evidence needs better data access; exact calculation
may need code; malformed lifecycle handling needs integration fixes; persistent
capability gaps need measured model/adaptation comparisons. Repair prompts for actual
instruction ambiguity or conflicting examples.

### Supporting reasoning

A judge model or self-review can share the original error. Calibrate graders against
reviewed examples and seek independent evidence rather than another confident explanation.

### Evaluation rubric

One point each: concrete diagnosis; appropriate non-prompt intervention;
self-evaluation limitation; independently checked improvement.
