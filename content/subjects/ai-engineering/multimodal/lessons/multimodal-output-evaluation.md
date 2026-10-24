---
id: lesson-ai-multimodal-output-evaluation
kind: lesson
topicId: ai-multimodal
title: Multimodal Outputs, Grounding, and Evaluation
summary: Design structured multimodal responses, manage generated media, and evaluate quality by modality and task.
difficulty: medium
status: published
revision: 1
order: 200
tags: [multimodal, evaluation, grounding, structured-output]
---

## Outputs need contracts too

A multimodal response may contain text, a structured extraction, an audio reply, an
image, or several parts. Define which parts are optional, how they are correlated,
and when the response is complete. Store generated media separately from the model
message and attach content type, size, retention, and provenance metadata.

```json
{
  "document_id": "doc-17",
  "fields": [{"name": "total", "value": "42.00", "evidence": "page-2"}],
  "needs_review": false,
  "media": []
}
```

Parse syntax, validate types, and then apply semantic checks. A JSON object can be
well formed while its extracted total conflicts with the source image. Require
evidence references or confidence thresholds for workflows that can cause side
effects.

## Evaluate the task, not just the modality

Image caption quality, OCR field accuracy, speech transcription error rate, temporal
event recall, and response latency measure different properties. Build a fixture
set sliced by lighting, accents, layouts, languages, duration, and ambiguity. For a
multimodal assistant, evaluate both perception and final task success: a correct
transcription followed by a wrong action is still a failed workflow.

Generated audio and images need their own safety and provenance rules. Limit output
format and size, scan or moderate where required, and tell users when content is
synthetic. Do not expose an internal file URL as if it were a durable public asset.

## Failure handling

Make partial results explicit. A failed audio generation should not erase a valid
text answer; a missing video segment should not silently become a complete timeline.
Use typed statuses such as `complete`, `partial`, `needs_review`, and `failed`, and
make downstream consumers handle them.

## Recall

Why are syntax validation and semantic validation separate? Name three evaluation
slices for a speech system. How should a pipeline represent a valid partial result?
