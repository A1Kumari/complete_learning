---
id: ai-api-schema-versus-semantics
kind: question
topicId: ai-llm-api-integration
lessonId: lesson-ai-api-structured-responses
prompt: What is the difference between valid JSON, schema-valid output, and a correct extracted answer?
difficulty: medium
status: published
revision: 1
order: 390
tags: [llm-api, json-schema, validation]
followUps:
  - Why should absent currency be null rather than invented USD?
  - Can a schema-valid total refer to the wrong subtotal?
misconception: Constrained formatting does not establish that fields are supported by the source.
---

## Answer

Valid JSON satisfies syntax. Schema-valid output satisfies declared structure, types,
and constraints. Correct extraction also satisfies source evidence and business
meaning, such as selecting the final total and the correct currency.

### Supporting reasoning

Null, missing, and zero mean different things under a contract. A completed/refusal
check precedes parsing; semantic checks follow structural validation.

### Evaluation rubric

One point each: syntax; structure; evidence/business semantics; concrete failure
example or correctly defined missing-value handling.
