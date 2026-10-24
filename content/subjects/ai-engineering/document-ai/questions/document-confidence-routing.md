---
id: ai-document-confidence-routing
kind: question
topicId: ai-document-ai
lessonId: lesson-ai-document-evaluation
prompt: How should confidence influence automatic document extraction versus human review?
difficulty: hard
status: published
revision: 1
order: 310
tags: [document-ai, confidence, human-review]
followUps:
  - Why is raw model confidence not enough?
  - How should business impact affect the review threshold?
misconception: A high model confidence score proves the field is correct.
---

## Answer

Calibrate confidence on labeled data and combine it with deterministic validation,
evidence quality, extractor disagreement, and the cost of an error. Auto-accept low-
risk validated fields, but escalate ambiguous or high-impact fields with the source
evidence and proposed value visible to a reviewer.

### Evaluation rubric

One point each: calibration; independent validation; risk-sensitive threshold;
evidence-based review.
