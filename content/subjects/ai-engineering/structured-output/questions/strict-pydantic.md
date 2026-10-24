---
id: ai-output-strict-pydantic
kind: question
topicId: ai-structured-output
lessonId: lesson-ai-output-typed-validation
prompt: Why use strict Pydantic validation and extra='forbid' for model outputs?
difficulty: medium
status: published
revision: 1
order: 630
tags: [structured-output, pydantic]
conceptIds: [concept-output-validation]
followUps:
  - Why might accepting the string 30 conceal a contract failure?
  - Does model_construct validate an untrusted result?
misconception: A type annotation alone is not an assurance that untrusted values were validated without coercion.
---

## Answer

Strict validation rejects unwanted coercion such as a string or boolean accepted
as an integer under a loose policy. Forbidding extra fields detects unexpected
shape changes instead of silently discarding them. Use actual validation entry points.

### Supporting reasoning

Required nullable fields need no default if presence matters. model_construct
bypasses validation. Python and JSON strict behavior can differ for some types,
so test the path used by the integration.

### Evaluation rubric

One point each: coercion policy; unexpected-field handling; correct validation
entry point; Python/JSON or nullable-presence qualification.
