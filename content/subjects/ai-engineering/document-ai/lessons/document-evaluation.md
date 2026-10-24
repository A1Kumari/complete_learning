---
id: lesson-ai-document-evaluation
kind: lesson
topicId: ai-document-ai
title: Document Extraction Evaluation and Human Review
summary: Evaluate document extraction by field, layout, and document slice while designing safe review and correction loops.
difficulty: medium
status: published
revision: 1
order: 200
tags: [document-ai, evaluation, human-review]
---

## Evaluate fields, not only documents

Document-level accuracy hides important failures. Measure field extraction precision,
recall, and exact match; numeric tolerance where appropriate; table structure;
classification; page or bounding-box grounding; and end-to-end workflow success.

Slice results by document type, scan quality, language, layout, handwriting, page
count, and field difficulty. A system that works on clean invoices may fail on
rotated receipts or multi-page statements.

## Confidence is a routing signal

Model confidence is not automatically calibrated probability. Validate it on a held-
out labeled set and combine it with deterministic checks, disagreement between
extractors, and business impact. A low-confidence address may be recoverable through
review; a low-confidence bank account should block an automatic payment.

Human review should show the source page, highlighted evidence, proposed value, and
reason for escalation. Corrections need audit history and should not silently become
training data without consent, quality checks, and privacy controls.

## Version the pipeline

Record parser, OCR, model, prompt/schema, preprocessing, and policy versions. Keep
golden documents and regression cases for layout changes, OCR upgrades, and schema
migrations. Reprocessing should be repeatable against the immutable original, while
downstream state changes require explicit reconciliation.

## Recall

Why is document-level accuracy insufficient? What should a reviewer see when a field
is escalated? Which versions must be recorded to reproduce an extraction?
