---
id: lesson-ai-model-api-lifecycle
kind: lesson
topicId: ai-llm-api-integration
title: Model API Request and Response Lifecycle
summary: Build a Responses API adapter, test it offline, and reason about credentials, output items, timeouts, retries, usage, and request correlation.
difficulty: medium
status: published
revision: 1
order: 180
tags: [llm-api, python, responses-api, reliability]
conceptIds: [concept-model-api-lifecycle]
prerequisiteIds: [lesson-ai-llm-inference, lesson-ai-llm-capabilities-limitations]
---

## Treat the model as a remote dependency

A model request crosses a network and provider boundary. The application constructs
instructions and input, authenticates, sends a request, checks lifecycle status,
extracts typed output items, validates results, and records operational metadata.
HTTP success alone does not imply a complete, correct answer.

```text
application → build request → authenticated provider call
                                      ↓
response status + typed items + usage → validation → accepted application result
                                      ↓ failures
                             bounded retry / fallback / explicit error
```

You need Python HTTP/JSON fundamentals. These lessons use OpenAI's Responses API
as a concrete interface, checked against current provider documentation. Other
providers can have different fields and retry guarantees. Choose a model available
to your account and pin the tested SDK version in your own project. There is no
universal model ID that every account can call.

## A request adapter with an offline fixture

`instructions` supplies high-level behavior; `input` supplies this task's content.
The response `output` can contain messages, reasoning items, and tool calls. Do not
assume `output[0].content[0].text` always exists. The SDK's `output_text` is a useful
aggregate for text, not a replacement for status and refusal handling.

```python
from types import SimpleNamespace

def summarize(client, model, document):
    response = client.responses.create(
        model=model,
        instructions='Summarize the supplied document in one sentence. Do not invent facts.',
        input=[{'role': 'user', 'content': document}],
        max_output_tokens=200,
    )
    if response.status != 'completed':
        raise RuntimeError('generation did not complete')
    text = response.output_text
    if not text.strip():
        raise RuntimeError('no usable text; inspect refusal/tool output items')
    return text

calls = []
def fake_create(**kwargs):
    calls.append(kwargs)
    return SimpleNamespace(status='completed', output_text='The store closes at six.')

fake = SimpleNamespace(responses=SimpleNamespace(create=fake_create))
assert summarize(fake, 'fixture-model', 'Closing time is 18:00.') == 'The store closes at six.'
assert calls[0]['max_output_tokens'] == 200
assert calls[0]['input'][0]['role'] == 'user'
for bad_response in [SimpleNamespace(status='incomplete', output_text='Partial'),
                     SimpleNamespace(status='completed', output_text='')]:
    fake.responses.create = lambda **kwargs: bad_response
    try:
        summarize(fake, 'fixture-model', 'document')
    except RuntimeError:
        pass
    else:
        raise AssertionError('unusable response accepted')
print('offline request contract passed')
```

The fixture tests request construction and response handling, not model behavior.
An explicit live variant follows. It is skipped by default; enabling it requires
the separately installed `openai` package, an API key, an available model, and may
incur charges. No key belongs in frontend code, screenshots, or source control.

```python
import os

if os.getenv('RUN_LIVE_LLM') == '1':
    from openai import OpenAI
    with OpenAI(api_key=os.environ['OPENAI_API_KEY'], timeout=20., max_retries=0) as client:
        response = client.responses.create(
            model=os.environ['OPENAI_MODEL'],
            instructions='Reply with a single short greeting.',
            input='Hello',
            max_output_tokens=200,
        )
        if response.status != 'completed':
            raise RuntimeError('incomplete response')
        print(response.output_text)
else:
    print('live request skipped')
```

## Failures, deadlines, and retries

Authentication/permission failures need configuration or access correction, not
blind retry. Invalid-request errors need payload correction. Transient service
failures and rate limits may justify bounded backoff, respecting provider guidance
and the overall request deadline. A timeout can mean the provider completed work
but the client never received it; resending can duplicate cost or downstream actions.

The Python SDK has automatic retries by default for selected failures. The live
example sets `max_retries=0` to make policy explicit. Avoid multiplying SDK retries
by an outer retry loop accidentally. A per-request timeout is not necessarily an
end-to-end deadline across retries, queuing, tools, and serialization. Streaming
requires separate interruption handling, covered later in this topic.

## Usage and observability

Record request correlation, provider request ID when available, model/configuration
version, elapsed time, status, and token usage. Redact credentials and sensitive
input rather than logging full prompts by default. Input/output token counts can
have cached/reasoning breakdowns; billing categories depend on the chosen service.
A lost connection may also lose final usage data. Do not silently report zero cost
for an incomplete record.

For asynchronous backends, use the provider's async client and bounded concurrency;
a synchronous network call inside an event loop blocks unrelated work. Reuse and
close clients deliberately. Retrying a database write triggered by a tool requires
application-level idempotency, not just retrying the model request.

## Recall and debugging

Why can HTTP 200 still produce no usable text? What should happen on a 401 versus
a transient 503? Why can a retry duplicate cost after a timeout? Check that your
answer distinguishes request validity, transport, generation completion, semantic
acceptance, and side effects.

## Verified references

- [OpenAI text generation](https://developers.openai.com/api/docs/guides/text)
- [OpenAI Python SDK: usage, errors, retries, timeouts](https://github.com/openai/openai-python)

Continue to [structured responses](structured-responses.md).
