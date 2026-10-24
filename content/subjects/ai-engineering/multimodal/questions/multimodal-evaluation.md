---
id: ai-multimodal-evaluation
kind: question
topicId: ai-multimodal
lessonId: lesson-ai-multimodal-output-evaluation
prompt: How would you evaluate a multimodal assistant that transcribes a call and creates a support ticket?
difficulty: hard
status: published
revision: 1
order: 310
tags: [multimodal, evaluation, speech]
followUps:
  - Why is transcription word error rate not enough?
  - Which slices expose accent or audio-quality regressions?
misconception: High transcription accuracy proves the end-to-end assistant works.
---

## Answer

Measure transcription quality and downstream task success separately. Use slices for
accent, language, noise, speakers, duration, and domain vocabulary; then measure
field extraction, correct ticket routing, unsupported-claim rate, latency, and review
rate. A good transcript can still produce a wrong or unauthorized ticket.

### Evaluation rubric

One point each: component and end-to-end metrics; representative slices; error
analysis; operational and safety outcomes.
