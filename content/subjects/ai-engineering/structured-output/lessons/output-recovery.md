---
id: lesson-ai-output-recovery
kind: lesson
topicId: ai-structured-output
title: Bounded Repair and Output Recovery State Machines
summary: Classify structural, semantic, transport, refusal, and incomplete outcomes; implement bounded validation repair without converting every failure into another generation.
difficulty: medium
status: published
revision: 1
order: 320
tags: [structured-output, reliability, retries, pydantic]
conceptIds: [concept-output-recovery, concept-output-validation]
prerequisiteIds: [lesson-ai-output-typed-validation, lesson-ai-model-api-lifecycle]
---

## Recovery needs a state model

A malformed object, a valid but unsupported claim, and a provider refusal are
different failures. They should not all trigger “try again until valid.” Define
terminal outcomes and retryable transitions before adding retries. This lesson
uses the request-lifecycle concepts from the API topic and runs entirely offline.

```text
attempt → refused / incomplete / transport failure → explicit outcome
    ↓ completed
parse + type-check → structural error → retry if budget remains
    ↓ valid
evidence/business checks → mismatch → review
    ↓ supported
accepted object → separate authorized commit
```

Retries consume time and money and can change the answer. Set both an attempt cap
and an overall deadline in a real integration; do not multiply application retries
by SDK defaults accidentally. A retry to fix formatting cannot supply missing
evidence. An intentionally null result can be correct and should not be retried
just because the application hoped for a number.

## Work through a bounded recovery loop

The callback returns fixture response envelopes. `completed`, `refused`, and
`incomplete` are normalized application states here; a real adapter derives them
from the provider's documented status and typed items. Only structural/type
validation errors are retried in this policy.

```python
from pydantic import BaseModel, ConfigDict, ValidationError

class Count(BaseModel):
    model_config = ConfigDict(strict=True, extra='forbid')
    count: int

def recover(generate, supported_count, max_attempts=2):
    if type(max_attempts) is not int or max_attempts < 1:
        raise ValueError('positive attempt budget required')
    feedback = None
    for attempt in range(1, max_attempts + 1):
        response = generate(feedback)
        if response['state'] != 'completed':
            return {'state': response['state'], 'attempts': attempt}
        try:
            result = Count.model_validate_json(response['text'])
        except ValidationError:
            feedback = 'Return exactly one object with an integer count, no extra keys.'
            continue
        if result.count != supported_count:
            return {'state': 'review', 'attempts': attempt}
        return {'state': 'accepted', 'attempts': attempt, 'value': result.count}
    return {'state': 'exhausted', 'attempts': max_attempts}

def fixture(responses):
    iterator = iter(responses)
    return lambda feedback: next(iterator)

bad = {'state': 'completed', 'text': '{"count":"3"}'}
good = {'state': 'completed', 'text': '{"count":3}'}
assert recover(fixture([bad, good]), 3) == {'state': 'accepted', 'attempts': 2, 'value': 3}
assert recover(fixture([bad, bad]), 3)['state'] == 'exhausted'
assert recover(fixture([good]), 4)['state'] == 'review'
assert recover(fixture([{'state': 'refused'}]), 3)['attempts'] == 1
assert recover(fixture([{'state': 'incomplete'}]), 3)['state'] == 'incomplete'
print('repair accepted at attempt 2; exhaustion, mismatch, refusal, incomplete handled')
```

The example stops before any database write. `supported_count` is trusted supplied
fixture evidence, not a hidden model answer. Transport exceptions are deliberately
not caught as validation errors; the surrounding adapter needs its own classified
timeout/backoff policy. Do not catch every exception and silently retry.

## Correction should not rewrite evidence

When retrying, retain the original task and authorized source, explain the contract
error briefly, and preserve correlation to the attempt. Do not change a source's
currency to match the model's guess or coerce an ambiguous date without an explicit
locale policy. Re-prompting can generate a different plausible object; the complete
validation and evidence checks must run again.

For unsupported semantics, better retrieval or human review may be appropriate.
For an incomplete response caused by an output budget, you might deliberately retry
with a revised budget if the service permits and the cost/deadline allows it. That
is a separate policy decision, not automatic structural repair.

## Idempotency and acceptance are different gates

Even an accepted object must pass authorization and idempotency at a side-effect
boundary. If writing an accepted order succeeds and the response is lost, repeating
the whole generation must not create a duplicate order. Store a durable business
operation key and reconcile commit state. A model request ID only identifies one
generation; it does not automatically deduplicate business effects.

## Recall

Trace the fixture with two invalid counts, then a refused response. Which failures
consume another attempt under this policy? Why is semantic mismatch routed to
review rather than accepted after type validation? Name a case where increasing
the retry count would make the system worse.

## Verified references

- [Pydantic validation errors and model entry points](https://docs.pydantic.dev/latest/concepts/models/)
- [OpenAI structured outputs: refusal and incomplete handling](https://developers.openai.com/api/docs/guides/structured-outputs)
- [OpenAI Python SDK: retry and timeout policy](https://github.com/openai/openai-python)
