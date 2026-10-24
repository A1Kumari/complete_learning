---
id: ai-context-budget-reservation
kind: question
topicId: ai-context-engineering
lessonId: lesson-ai-context-packing
prompt: How do you calculate a context input budget and handle mandatory-context overflow?
difficulty: medium
status: published
revision: 1
order: 550
tags: [context-engineering, token-budgets]
conceptIds: [concept-context-budgeting]
followUps:
  - What contributes tokens beyond raw document text?
  - Why recount the complete tentative request instead of only adding string counts?
misconception: Silently truncating the task is not an acceptable way to satisfy a capacity check.
---

## Answer

Subtract reserved generation and any justified counting margin from the model's
documented capacity, then count the actual serialized input. If mandatory task
and instructions do not fit, fail explicitly or redesign the request.

### Supporting reasoning

Account for message formatting, tool schemas, evidence labels, and model-specific
reasoning/output rules. Full serialization can differ from summed independent
counts. The packer's synthetic fixture counter is not a real tokenizer.

### Evaluation rubric

One point each: capacity/output accounting; full request count; explicit mandatory
overflow policy; tokenizer/provider-specific overhead qualification.
