---
id: ai-multimodal-input-contract
kind: question
topicId: ai-multimodal
lessonId: lesson-ai-multimodal-inputs
prompt: What should an application validate before sending an image, audio file, or video to a model?
difficulty: medium
status: published
revision: 1
order: 110
tags: [multimodal, input-validation]
followUps:
  - Why should video evidence include timestamps?
  - How can preprocessing change evaluation results?
misconception: A model will normalize every uploaded media file safely and consistently.
---

## Answer

Validate type, size, dimensions, duration, and other modality-specific limits; decode
and normalize to supported formats; enforce content policy; and preserve stable
identity and ordering. Sample video deliberately and record preprocessing decisions
so the model receives bounded, reproducible evidence.

### Evaluation rubric

One point each: generic limits; modality-specific validation; ordering/identity;
bounded reproducible preprocessing.
