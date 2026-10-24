---
id: ai-api-incomplete-structured-output
kind: question
topicId: ai-llm-api-integration
lessonId: lesson-ai-api-structured-responses
prompt: What should happen when a structured response is refused or truncated?
difficulty: medium
status: published
revision: 1
order: 400
tags: [llm-api, validation, reliability]
followUps:
  - Why is adding closing braces to partial JSON unsafe as a completion strategy?
  - What justifies a bounded corrective retry?
misconception: Structured output contracts do not eliminate separate refusal and incomplete-generation paths.
---

## Answer

Represent refusal or incomplete generation explicitly and do not commit an assumed
record. Inspect lifecycle status and refusal items before parsing. Retry only when
the failure is correctable under a bounded policy and preserve the source and reason.

### Supporting reasoning

Syntactic repair can conceal missing fields, incomplete values, or an unfinished
semantic decision. Repeatedly retrying a refusal until desired output appears is
not a sound acceptance policy.

### Evaluation rubric

One point each: status handling; refusal distinction; no premature record commit;
bounded and justified correction strategy.
