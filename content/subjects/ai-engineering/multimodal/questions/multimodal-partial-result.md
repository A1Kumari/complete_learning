---
id: ai-multimodal-partial-result
kind: question
topicId: ai-multimodal
lessonId: lesson-ai-multimodal-output-evaluation
prompt: How should a multimodal pipeline represent a successful text result when audio generation fails?
difficulty: medium
status: published
revision: 1
order: 410
tags: [multimodal, reliability, partial-failure]
followUps:
  - Why should missing media not be silently treated as completion?
  - Which metadata should accompany generated media?
misconception: Any failed modality means the entire response must be discarded.
---

## Answer

Return an explicit partial status with the valid text result and a typed audio
failure, such as `complete_text_audio_failed` or a structured per-part status. Keep
the failed part visible to the caller, attach media type and retention metadata to
successful outputs, and let downstream policy decide whether review or retry is
needed.

### Evaluation rubric

One point each: preserve valid output; typed partial status; visible failure;
downstream retry or review policy.
