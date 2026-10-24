---
id: ai-multimodal-grounding
kind: question
topicId: ai-multimodal
lessonId: lesson-ai-multimodal-output-evaluation
prompt: Why should a multimodal model's extracted field be grounded before it changes application state?
difficulty: hard
status: published
revision: 1
order: 210
tags: [multimodal, grounding, extraction]
followUps:
  - What is the difference between valid JSON and a correct extraction?
  - What evidence could be attached to an OCR result?
misconception: Structured output guarantees that the perceived value is true.
---

## Answer

Structured output only validates shape. The value must be checked against evidence,
such as a page or timestamp reference, deterministic constraints, confidence policy,
or human review. Critical extracted values should not become source-of-truth state
solely because the model returned valid JSON.

### Evaluation rubric

One point each: syntax versus semantics; evidence reference; deterministic or human
verification; safe state transition.
