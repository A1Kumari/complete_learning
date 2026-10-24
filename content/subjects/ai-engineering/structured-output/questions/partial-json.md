---
id: ai-output-partial-json-acceptance
kind: question
topicId: ai-structured-output
lessonId: lesson-ai-output-stream-acceptance
prompt: Can a parseable JSON object from a stream be committed before response completion?
difficulty: medium
status: published
revision: 1
order: 670
tags: [structured-output, streaming]
conceptIds: [concept-output-stream-acceptance]
followUps:
  - Why is a closing brace not proof of success?
  - What additional checks follow successful item and response completion?
misconception: Provisional display, parseable candidate, and accepted business record are different states.
---

## Answer

No. Under the lesson's acceptance policy, require both the expected item completion
and successful response completion, then parse/validate the full candidate and
check semantics. Authorization and idempotent commit remain separate later gates.

### Supporting reasoning

A completed object can be followed by response failure or other incomplete items.
Partial preview parsers may infer defaults; those inferred values must not trigger
actions. Network closure is not a successful terminal state.

### Evaluation rubric

One point each: lifecycle gating; candidate/accepted distinction; full validation
and evidence; separate authorization/commit decision.
