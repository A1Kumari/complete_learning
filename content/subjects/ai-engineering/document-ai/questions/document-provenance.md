---
id: ai-document-provenance
kind: question
topicId: ai-document-ai
lessonId: lesson-ai-document-pipeline
prompt: What provenance should a document extraction system attach to an extracted field?
difficulty: medium
status: published
revision: 1
order: 110
tags: [document-ai, provenance, extraction]
followUps:
  - Why is a value without page identity hard to review?
  - What should happen when evidence is ambiguous?
misconception: The extracted value is sufficient because the model already saw the document.
---

## Answer

Attach the source document ID, page or time location, bounding box or text span when
available, extraction and model versions, confidence, and validation status. Evidence
lets a reviewer verify the value and lets downstream policy route ambiguity instead
of treating an unsupported extraction as fact.

### Evaluation rubric

One point each: source identity; location evidence; version/confidence metadata;
review or validation path.
