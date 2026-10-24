---
id: ai-document-pdf-strategy
kind: question
topicId: ai-document-ai
lessonId: lesson-ai-document-pipeline
prompt: How should a pipeline decide whether a PDF needs OCR?
difficulty: medium
status: published
revision: 1
order: 210
tags: [document-ai, pdf, ocr]
followUps:
  - Why can a PDF need both text extraction and OCR?
  - Which original should be retained for audit?
misconception: Every PDF should be rasterized and OCRed in the same way.
---

## Answer

Inspect whether the text layer is present, readable, and aligned with the page. Use
direct text extraction when it is reliable, OCR image-only or unusable regions, and
combine both for mixed documents. Preserve the immutable original and record the
rendering, OCR, and parser versions used.

### Evaluation rubric

One point each: inspect text layer; mixed strategy; immutable original; reproducible
processing metadata.
