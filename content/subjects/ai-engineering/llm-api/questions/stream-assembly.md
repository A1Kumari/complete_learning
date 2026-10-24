---
id: ai-api-stream-assembly
kind: question
topicId: ai-llm-api-integration
lessonId: lesson-ai-api-streaming
prompt: How should streamed text deltas be assembled without duplicating final text or mixing tool arguments?
difficulty: medium
status: published
revision: 1
order: 430
tags: [llm-api, streaming]
followUps:
  - Why might appending a done event yield HelloHello?
  - Why key buffers by output item and content part?
misconception: A typed delta, an SSE event, a network chunk, and a token are not interchangeable boundaries.
---

## Answer

Accumulate text deltas in per-item/content-part buffers. Treat final whole-text
events as completion/verification rather than another delta. Collect function
arguments separately and validate complete calls before execution.

### Supporting reasoning

Network chunks may split UTF-8, JSON, or SSE frames; use the SDK or a correct framed
incremental parser. Multiple items can interleave and need distinct identities.

### Evaluation rubric

One point each: incremental accumulation; no final-text double append; separate
typed buffers; correct transport/event boundary distinction.
