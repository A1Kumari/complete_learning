---
id: ai-output-stream-cancellation
kind: question
topicId: ai-structured-output
lessonId: lesson-ai-output-stream-acceptance
prompt: How should interrupted structured streams and partial tool arguments be handled?
difficulty: medium
status: published
revision: 1
order: 680
tags: [structured-output, streaming, cancellation]
conceptIds: [concept-output-stream-acceptance]
followUps:
  - Can a new attempt's JSON be appended to the old prefix?
  - Why keep buffers separate for multiple output items?
misconception: Partial arguments must not execute just because a prefix looks plausible.
---

## Answer

Mark incomplete, close/cancel upstream resources, retain only provisional display,
and do not execute or commit partial values. Use distinct item buffers and attempt
identities; resume only through documented semantics, never arbitrary concatenation.

### Supporting reasoning

A partial amount of 100 can later become 10000. Even a complete argument needs
type, evidence, and authorization checks. Bound buffers and payload size to avoid
uncontrolled resource use during long or failed streams.

### Evaluation rubric

One point each: incomplete-state handling; no premature execution; per-item/attempt
isolation; resource cleanup and bounded buffering.
