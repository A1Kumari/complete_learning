---
id: ai-api-stream-interruption
kind: question
topicId: ai-llm-api-integration
lessonId: lesson-ai-api-streaming
prompt: What should happen when a stream disconnects after showing a partial answer?
difficulty: medium
status: published
revision: 1
order: 440
tags: [llm-api, streaming, cancellation]
followUps:
  - Can a fresh generation simply be appended to the old prefix?
  - How do slow consumers affect server resource use?
misconception: End-of-transport is not the same as successful generation completion.
---

## Answer

Mark the draft incomplete, close/cancel resources, and do not commit partial business
data or execute partial tool arguments. Resume only through documented semantics;
otherwise represent a new attempt separately.

### Supporting reasoning

Appending a new generation can duplicate or contradict displayed content. Bound
buffers and propagate cancellation so slow/disconnected clients do not leave
unlimited generation or queued data behind.

### Evaluation rubric

One point each: explicit incomplete state; no premature commit; safe attempt/resume
semantics; cleanup and bounded backpressure handling.
