---
id: lesson-ai-api-structured-responses
kind: lesson
topicId: ai-llm-api-integration
title: Structured Responses and Semantic Validation
summary: Define a strict output contract, distinguish valid JSON from valid data, and handle refusal, truncation, and evidence checks.
difficulty: medium
status: published
revision: 1
order: 190
tags: [llm-api, json-schema, validation, python]
conceptIds: [concept-structured-model-output]
prerequisiteIds: [lesson-ai-model-api-lifecycle]
---

## Three contracts, not one

An extraction system can fail at three layers: syntactic JSON parsing, structural
schema validation, and semantic correctness. `{"currency":"USD","total":900}`
can parse and satisfy a schema while the invoice actually says EUR 90. A schema
constrains the form of an answer; it cannot independently establish evidence.

```text
model terminal status
     ↓ completed and not refused
JSON parsing → schema/type checks → evidence/business checks → accepted record
     ↘ incomplete or invalid: explicit failure / bounded correction
```

OpenAI Responses uses `text.format` for structured user-facing output. Function
tools use their own argument schemas. Do not paste a Chat Completions
`response_format` field into a Responses request and assume the interfaces match.
Strict structured output supports a subset of JSON Schema; verify model and schema
compatibility. A refusal or an interrupted/limited response can follow a separate
path rather than yielding the requested object.

## Define a small invoice contract

Require `currency` to be USD, EUR, or null, and `total_cents` to be an integer or
null. Null represents insufficient evidence; it is not the same as a missing key
or the numeric value zero. Represent money in integer minor units when appropriate,
with a separately defined currency/rounding policy. Do not infer locale-specific
decimal conventions from ambiguous text without a rule.

```python
import json

schema = {
    'type': 'object',
    'properties': {
        'currency': {'type': ['string', 'null'], 'enum': ['USD', 'EUR', None]},
        'total_cents': {'type': ['integer', 'null']},
    },
    'required': ['currency', 'total_cents'],
    'additionalProperties': False,
}
request_format = {'type': 'json_schema', 'name': 'invoice', 'strict': True, 'schema': schema}

def validate_invoice(text):
    # A focused validator for this contract, not a general JSON Schema engine.
    value = json.loads(text)
    if type(value) is not dict or set(value) != {'currency', 'total_cents'}:
        raise ValueError('unexpected shape')
    if value['currency'] not in ('USD', 'EUR', None):
        raise ValueError('unsupported currency')
    total = value['total_cents']
    if total is not None and (type(total) is not int or total < 0):
        raise ValueError('invalid total')
    return value

record = validate_invoice('{"currency":"EUR","total_cents":1250}')
assert record == {'currency': 'EUR', 'total_cents': 1250}
for bad in ['{"currency":"EUR","total_cents":true}',
            '{"currency":"GBP","total_cents":12}',
            '{"currency":"EUR"}']:
    try:
        validate_invoice(bad)
    except ValueError:
        pass
    else:
        raise AssertionError('invalid fixture accepted')
assert request_format['schema']['additionalProperties'] is False
print('invoice contract passed')
```

Use `client.responses.create(..., text={"format": request_format})` to supply that
format, alongside model, instructions, and input. This line describes the wire
contract; the local validator runs without a provider or SDK. In production, use a
maintained schema/type validator plus domain checks. Python booleans subclass int,
which is why the example uses `type(total) is int` rather than `isinstance`.

## A complete acceptance trace

Input: “Invoice total: EUR 12.50.” Candidate: EUR and 1,250 cents.
First verify terminal completion and absence of refusal. Parse once the text is
complete; validate keys, types, and enums; then verify that EUR and 12.50 are
supported by the source and refer to the final total rather than a subtotal.
Only then accept the business record. For auditability, a richer contract can
include evidence spans and identifiers, whose claims must themselves be checked.

For “Total: 12.50” with no currency, return null for currency under this policy
rather than inventing USD. For a negative credit note, this example's business rule
would reject it; a real credit-note workflow needs a different declared contract.
Schema design reflects product policy, not an inherent universal invoice definition.

## Refusal and truncation are separate outcomes

If generation hits a limit, do not repair partial JSON by adding braces and assume
the values are complete. If a model refuses, handle the refusal explicitly rather
than retrying until it emits the desired object. Bounded corrective retries may
help recover a correctable validation problem, but preserve the original source
and validation reason and prevent unbounded loops. Tool authorization is a later
gate even if the structured object is perfectly valid.

## Recall and misconceptions

Explain why schema-valid is not evidence-backed. What is the distinction between
null, missing, and zero? Why must a JSON prefix not be committed as a record?
Use the ambiguous-currency and subtotal examples to make your answer concrete.

## Verified references

- [OpenAI structured outputs and supported schemas](https://developers.openai.com/api/docs/guides/structured-outputs)
- [OpenAI text generation output items](https://developers.openai.com/api/docs/guides/text)
