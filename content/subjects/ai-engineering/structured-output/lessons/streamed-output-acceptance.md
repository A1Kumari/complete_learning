---
id: lesson-ai-output-stream-acceptance
kind: lesson
topicId: ai-structured-output
title: Partial JSON, Streaming, and the Commit Boundary
summary: Keep streamed candidates separate from accepted records, enforce complete-item and response lifecycle checks, and test syntactically complete but failed outputs.
difficulty: medium
status: published
revision: 1
order: 330
tags: [structured-output, streaming, validation, python]
conceptIds: [concept-output-stream-acceptance, concept-model-streaming]
prerequisiteIds: [lesson-ai-output-recovery, lesson-ai-api-streaming]
---

## Displayed is not committed

Streaming structured output creates at least three objects: the bytes/events
received so far, a candidate that may be parseable, and a validated accepted record.
Do not collapse them into one database object. Partial parsers can help render a
provisional UI, but inferred missing values must not become authorized actions.

```text
decoded deltas → provisional buffer / preview
                       ↓ complete item + successful response
              exact parse → typed validation → semantic checks
                                                   ↓ authorization
                                        idempotent business commit
```

This lesson assumes the SDK or transport layer already decodes UTF-8 and SSE
frames. Arbitrary network chunks are not JSON boundaries. With multiple output
items, keep separate buffers keyed by item/content identity. The [streaming API
lesson](../../llm-api/lessons/streaming-responses.md) covers that assembly layer.

## A closing brace is not enough

A JSON object can finish before the overall response later fails. A text-done
event can complete one part while other parts remain pending. Conversely, a
socket closing does not prove a successful terminal status. Normalize provider
events into application states and require the declared success conditions.

The following deliberately restricted fixture handles one JSON text item. It
rejects deltas after item completion and refuses to accept a parseable object
when the response did not complete successfully.

```python
from pydantic import BaseModel, ConfigDict

class Result(BaseModel):
    model_config = ConfigDict(strict=True, extra='forbid')
    total_cents: int

def accept_stream(events, expected_total):
    text = ''
    item_done = False
    response_done = False
    for event in events:
        if response_done:
            raise ValueError('event after terminal completion')
        kind = event['type']
        if kind == 'delta':
            if item_done:
                raise ValueError('delta after item completion')
            text += event['text']
        elif kind == 'item_done':
            if item_done:
                raise ValueError('duplicate item completion')
            item_done = True
        elif kind == 'response_completed':
            response_done = True
        else:
            raise ValueError('refused, failed, or unknown event')
    if not item_done or not response_done:
        raise ValueError('incomplete stream')
    result = Result.model_validate_json(text)
    if result.total_cents != expected_total:
        raise ValueError('unsupported total')
    return result

events = [
    {'type': 'delta', 'text': '{"total_cents":'},
    {'type': 'delta', 'text': '1200}'},
    {'type': 'item_done'},
    {'type': 'response_completed'},
]
assert accept_stream(events, 1200).total_cents == 1200
for broken in [events[:2], events[:3], events[:3] + [{'type': 'failed'}]]:
    try:
        accept_stream(broken, 1200)
    except ValueError:
        pass
    else:
        raise AssertionError('premature result accepted')
print('accepted only after item and response completion; failed prefixes rejected')
```

Event names in this example are normalized fixture names, not raw OpenAI SSE
names. A real adapter maps events such as output-text deltas and terminal response
states, handles refusals/nontext items, and checks final metadata. This validator
contains no side effect; commit occurs only after later application gates.

## Partial execution creates irreversible mistakes

Suppose a streamed tool argument prefix looks like `{"amount_cents":100` and later
becomes 10,000. Executing before completion is clearly wrong. Even a complete
argument object can name an unauthorized account, so schema and stream completion
are still insufficient authorization. Keep provisional content visibly provisional
and disable actions until the accepted record is ready.

## Cancellation and recovery

On cancellation, close the upstream stream, mark the draft incomplete, and avoid
committing partially received values. Retry with a new attempt identity unless a
documented resume mechanism provides stronger semantics. Never append the new
attempt's JSON to the old prefix. Usage accounting may be incomplete after a lost
connection; do not label unknown usage as zero.

For large outputs, apply byte/token/item limits and bounded buffers. A parser
accepting a giant nested object can still exhaust resources. Record failure stage,
schema version, request identity, and commit status without leaking raw sensitive
payloads in diagnostics.

## Recall and acceptance exercise

The fixture has a complete `{"total_cents":1200}` but no response-completed event.
Should it be committed? No. Now assume both completion events exist but the source
supports 1,000. It still fails semantic acceptance. Finally assume all checks pass:
what additional gate decides whether a refund may actually be issued?

## Verified references

- [OpenAI streaming Responses](https://developers.openai.com/api/docs/guides/streaming-responses)
- [OpenAI structured-output lifecycle and streaming](https://developers.openai.com/api/docs/guides/structured-outputs)
- [Pydantic model validation](https://docs.pydantic.dev/latest/concepts/models/)
