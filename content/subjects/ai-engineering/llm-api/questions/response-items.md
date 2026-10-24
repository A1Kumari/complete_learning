---
id: ai-api-response-items
kind: question
topicId: ai-llm-api-integration
lessonId: lesson-ai-model-api-lifecycle
prompt: Why is reading output[0].content[0].text unsafe in a model API integration?
difficulty: medium
status: published
revision: 1
order: 370
tags: [llm-api, responses-api]
followUps:
  - What checks should precede accepting output_text?
  - What request metadata is useful without logging full prompts?
misconception: HTTP success and the presence of an output item do not guarantee completed usable text.
---

## Answer

Output can include multiple typed items such as tool calls, messages, and reasoning
items. Inspect item types or use the documented text aggregator, while checking
completion status, refusal, empty output, and task acceptance.

### Supporting reasoning

Record request/provider IDs, model/configuration, latency, status, and available usage.
Do not log credentials or sensitive prompt bodies merely for debugging convenience.

### Evaluation rubric

One point each: heterogeneous output; correct extraction method; lifecycle/refusal
handling; useful redacted operational metadata.
