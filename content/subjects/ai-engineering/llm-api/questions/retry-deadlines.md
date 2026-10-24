---
id: ai-api-retries-and-deadlines
kind: question
topicId: ai-llm-api-integration
lessonId: lesson-ai-model-api-lifecycle
prompt: How should retries and timeouts be designed for a model API call?
difficulty: medium
status: published
revision: 1
order: 380
tags: [llm-api, reliability, retries]
followUps:
  - Why can an SDK retry loop plus an application retry loop exceed the intended budget?
  - Does a timeout prove the remote work never happened?
misconception: Retrying a generation does not automatically make costs or downstream effects idempotent.
---

## Answer

Classify failures, use bounded retries only when appropriate, respect provider backoff
guidance, and enforce an overall deadline. Correct authentication or invalid payloads
instead of blindly retrying them. Account for automatic SDK retries.

### Supporting reasoning

A lost response can follow completed provider work, so retry can duplicate generation
cost. Side effects need durable business-operation deduplication. Per-attempt timeout
does not bound total queuing, retry, and tool time.

### Evaluation rubric

One point each: failure classification; bounded/backoff policy; end-to-end deadline;
ambiguous completion and side-effect deduplication.
