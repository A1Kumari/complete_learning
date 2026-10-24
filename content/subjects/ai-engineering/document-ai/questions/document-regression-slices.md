---
id: ai-document-regression-slices
kind: question
topicId: ai-document-ai
lessonId: lesson-ai-document-evaluation
prompt: Which slices belong in a regression set for a document extraction system?
difficulty: medium
status: published
revision: 1
order: 410
tags: [document-ai, evaluation, regression]
followUps:
  - Why should clean documents not be the only test set?
  - Which metrics expose table extraction failures?
misconception: A single aggregate field accuracy captures document quality.
---

## Answer

Include document types, languages, scan quality, rotation, handwriting, layouts,
page counts, tables, rare fields, and ambiguous examples. Track field precision and
recall, exact or numeric accuracy, structural table quality, evidence grounding,
latency, and review rate by slice rather than only one aggregate.

### Evaluation rubric

One point each: diverse document slices; field-level metrics; structure/grounding;
operational review and latency metrics.
