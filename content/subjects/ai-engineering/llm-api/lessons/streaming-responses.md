---
id: lesson-ai-api-streaming
kind: lesson
topicId: ai-llm-api-integration
title: Streaming Responses and Partial Failure
summary: Assemble typed output deltas, distinguish framing from token boundaries, and handle completion, cancellation, and interrupted streams without false success.
difficulty: medium
status: published
revision: 1
order: 210
tags: [llm-api, streaming, sse, python]
conceptIds: [concept-model-streaming]
prerequisiteIds: [lesson-ai-model-api-lifecycle, lesson-ai-api-tool-calling]
---

## Streaming changes the lifecycle

Without streaming, the client receives output after generation completes. With
streaming, the client can display portions earlier, improving perceived time to
first content. This does not guarantee lower total generation time. It also creates
a partial-result state that the application must represent honestly.

```text
created → deltas → more deltas → completed
                   ↘ failed / incomplete / disconnected / cancelled
```

Responses streams use typed semantic events over SSE. HTTP byte chunks are not
tokens and not necessarily complete SSE frames, JSON values, or UTF-8 characters.
An SDK normally handles transport decoding/framing and yields typed events.
Writing a raw parser requires buffering, UTF-8 incremental decoding, blank-line
event boundaries, comments, and multi-line data fields. Do not call `json.loads`
on each arbitrary network chunk.

## Assemble text without double-counting

Text delta events carry incremental text. A later done/final event can contain the
whole text; appending that whole value after accumulating deltas duplicates output.
Multiple output items or content parts can interleave, so keep a key such as
`(output_index, content_index)` rather than one global string for every event type.
Tool argument deltas belong in a separate argument buffer, not the displayed text.

```python
def collect(events):
    buffers = {}
    completed = False
    for event in events:
        kind = event['type']
        if kind == 'response.output_text.delta':
            key = (event['output_index'], event['content_index'])
            buffers[key] = buffers.get(key, '') + event['delta']
        elif kind in ('error', 'response.failed', 'response.incomplete'):
            raise RuntimeError('generation failed or incomplete')
        elif kind == 'response.completed':
            completed = True
    if not completed:
        raise RuntimeError('stream ended before completion')
    return [buffers[key] for key in sorted(buffers)]

events = [
    {'type': 'response.output_text.delta', 'output_index': 0, 'content_index': 0, 'delta': 'Hel'},
    {'type': 'response.output_text.delta', 'output_index': 0, 'content_index': 0, 'delta': 'lo'},
    {'type': 'response.output_text.done', 'text': 'Hello'},
    {'type': 'response.completed'},
]
assert collect(events) == ['Hello']
for broken in [events[:2], events[:2] + [{'type': 'response.failed'}]]:
    try:
        collect(broken)
    except RuntimeError:
        pass
    else:
        raise AssertionError('broken stream accepted')
print('Hello; interrupted streams rejected')
```

This fixture demonstrates lifecycle assembly of already decoded events, not an SSE
transport parser. Real integrations must also handle refusals, nontext outputs,
event-specific fields, and response metadata. A completed event is not permission
to accept an unvalidated business result.

## Connect the event model to the SDK

With the Python SDK, `client.responses.create(..., stream=True)` returns a stream;
iterate events and branch on `event.type`. Text events expose `event.delta` and
indices. Close the stream in `finally` or a context manager so disconnected clients
do not leave work/resources running. In an async backend, use the async stream and
propagate cancellation through its lifecycle. Respect bounded queues: an unbounded
buffer for a slow browser can exhaust server memory.

If the client disconnects after receiving “Invoice total:”, mark the displayed
prefix incomplete. Do not append a fresh generation's beginning to it as if it
were a seamless continuation. Automatic request retry and stream-resumption
semantics are different; use a documented resume mechanism if available, otherwise
start a separately identified attempt.

## Structured data and tool execution

Progress text may be shown provisionally, but do not commit partial JSON or execute
partial tool arguments. Wait for a complete item and validate it, then enforce
authorization. A closing brace appearing in a chunk is not sufficient evidence
that the entire response succeeded. Complete text can still be followed by failure
elsewhere in a multi-item response.

Track time to first content, total completion time, interruption rate, and final
usage when available. A visibly responsive stream can still have poor total latency
or high cost. Error UX should distinguish incomplete drafts from accepted results.

## Recall and failure exercise

Given `Hel`, `lo`, then a final `Hello`, why would a naive collector show
`HelloHello`? What happens if the connection closes before the completed event?
Which buffer receives function arguments? Explain why chunk boundaries cannot be
used as JSON or Unicode boundaries.

## Verified references

- [OpenAI streaming Responses guide](https://developers.openai.com/api/docs/guides/streaming-responses)
- [OpenAI streaming function calls](https://developers.openai.com/api/docs/guides/function-calling#streaming)
- [OpenAI Python SDK: stream lifecycle and errors](https://github.com/openai/openai-python)
