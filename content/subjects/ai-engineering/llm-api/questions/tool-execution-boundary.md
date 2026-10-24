---
id: ai-api-tool-execution-boundary
kind: question
topicId: ai-llm-api-integration
lessonId: lesson-ai-api-tool-calling
prompt: Does a model function call mean the function executed, and what must the application do next?
difficulty: medium
status: published
revision: 1
order: 410
tags: [llm-api, tool-calling, authorization]
followUps:
  - Which identity must come from authenticated server context?
  - How is the function result correlated with its proposal?
misconception: Model-proposed arguments do not authorize access or execute application-defined functions.
---

## Answer

An application-defined tool call is a proposal. Validate the name and arguments,
authorize the operation using authenticated server context, execute the service,
and return a result correlated by call_id for model continuation.

### Supporting reasoning

Handle zero or multiple calls, bound turns/time, preserve required continuation
items, and treat tool output as data. Provider-hosted tools have a different
execution boundary that must be understood separately.

### Evaluation rubric

One point each: proposal/execution distinction; validation; independent authorization;
correlated results and controlled continuation.
