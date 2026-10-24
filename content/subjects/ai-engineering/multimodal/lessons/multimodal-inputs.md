---
id: lesson-ai-multimodal-inputs
kind: lesson
topicId: ai-multimodal
title: Multimodal Inputs, Representation, and Data Contracts
summary: Build a mental model for image, audio, and video inputs and design explicit contracts before sending them to a model.
difficulty: medium
status: published
revision: 1
order: 100
tags: [multimodal, vision, audio, video]
---

## One request, multiple evidence types

Multimodal systems accept more than text: an image, audio recording, video, or a
mixture of these with instructions. The model does not receive a magical universal
object. Each modality is decoded, normalized, represented, and inserted into a
model-specific context format.

```text
upload → type/size validation → decode/normalize → modality representation
                                                   ↓
                                  text instruction + ordered evidence → model
```

Preserve the order and identity of evidence. “Image 1” and “image 2” should map to
stable application IDs, not an assumption that the model will infer which database
record they represent.

## Input contracts matter

Validate MIME type, byte size, dimensions, duration, frame rate, channels, and
content policy before model invocation. Re-encode images and audio when needed so
the model sees predictable formats. For video, sample frames deliberately and pass
timestamps if temporal order matters. A large raw file can exceed a request budget
even when its textual description is short.

Do not confuse model perception with ground truth. Ask the model for uncertainty or
structured observations, then verify critical fields with deterministic checks or a
human review path. OCR text, image captions, and transcriptions are evidence with
known error modes, not authoritative records.

## Token and cost budgets

Images can consume a resolution-dependent visual budget; audio and video can expand
through duration or frame sampling. Set per-request limits and degrade intentionally:
resize an image, reduce frame density, transcribe audio, or ask for a targeted crop.
Record the chosen preprocessing so evaluation compares like with like.

## Recall

Why should a video request carry timestamps? Which properties should be validated
before decoding? Give two reasons a multimodal model's observation should not be
written directly into a source-of-truth database.
