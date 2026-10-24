---
id: ai-output-required-nullable
kind: question
topicId: ai-structured-output
lessonId: lesson-ai-output-schema-contracts
prompt: How do required, nullable, and additionalProperties affect a structured-output contract?
difficulty: medium
status: published
revision: 1
order: 610
tags: [structured-output, json-schema]
conceptIds: [concept-output-contracts]
followUps:
  - Does defining a field in properties make it required?
  - Does closing the outer object also close nested objects?
misconception: Missing, null, empty string, and zero are distinct states unless explicitly normalized.
---

## Answer

Required controls key presence; nullable controls whether its value can be null.
Properties alone do not require a field. additionalProperties=false rejects
unspecified keys in its own object scope, not automatically all nested objects.

### Supporting reasoning

A required nullable field must appear but may explicitly carry unknown information.
Design and version those meanings for consumers, and check the provider's supported
schema subset rather than assuming every local keyword is supported.

### Evaluation rubric

One point each: presence; nullability; unknown-key scope; concrete missing-value
or nested-schema example.
