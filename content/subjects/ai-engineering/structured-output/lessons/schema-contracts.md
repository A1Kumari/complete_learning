---
id: lesson-ai-output-schema-contracts
kind: lesson
topicId: ai-structured-output
title: JSON Schema Contracts and Constrained Generation
summary: Design required, nullable, closed output contracts; distinguish JSON mode, schema-constrained generation, and application-owned semantic checks.
difficulty: medium
status: published
revision: 1
order: 300
tags: [structured-output, json-schema, validation, python]
conceptIds: [concept-output-contracts, concept-structured-model-output]
prerequisiteIds: [lesson-ai-api-structured-responses]
---

## Specify the consumer's actual contract

The [API introduction](../../llm-api/lessons/structured-responses.md) separates
syntax, structure, and meaning. This topic develops those layers into a releaseable
data contract and an acceptance workflow. The consumer might be a database writer,
UI renderer, or tool executor; each needs declared behavior for missing evidence,
unknown versions, refusals, and incomplete output.

JSON syntax alone does not constrain keys or field types. JSON Schema can declare
objects, arrays, enums, numeric/string constraints, nested structures, and required
fields. Provider-constrained generation supports a provider/model-specific subset,
not necessarily every keyword or dialect your local validator supports.

```text
task + supported schema → constrained candidate generation
                                      ↓ lifecycle check
                         local schema/type validation
                                      ↓ evidence + business checks
                              accepted application object
```

## Required is independent of nullable

Defining a field inside `properties` does not make it required in general JSON
Schema. A required field must be present. A nullable field can contain JSON null
only when its schema allows it. Thus required-and-nullable means “the key is always
present, but the value can explicitly represent missing information.” Missing,
null, empty string, and zero are distinct states unless your contract deliberately
normalizes them.

`additionalProperties: false` rejects unspecified keys in that object. It does
not automatically close every nested object. When combining schemas, scope rules
matter; do not assume `allOf` extends a closed object without considering where
properties were declared. Keep the provider wire schema simple unless the consumer
really needs complex unions.

## Work through a policy lookup object

Use a versioned record with an explicit outcome and nullable answer. The source
reference remains a claim that the application must verify.

```python
schema = {
    'type': 'object',
    'properties': {
        'schema_version': {'type': 'string', 'enum': ['policy-v1']},
        'outcome': {'type': 'string', 'enum': ['answered', 'insufficient_evidence']},
        'days': {'type': ['integer', 'null']},
        'source_id': {'type': ['string', 'null']},
    },
    'required': ['schema_version', 'outcome', 'days', 'source_id'],
    'additionalProperties': False,
}
wire_format = {'type': 'json_schema', 'name': 'policy_answer',
               'strict': True, 'schema': schema}
assert set(schema['required']) == set(schema['properties'])
assert schema['properties']['days']['type'] == ['integer', 'null']
assert wire_format['strict'] is True
print('policy-v1: four required keys; days and source_id allow null')
```

This block builds and inspects the schema; it does not implement a general schema
validator. Later lessons execute real Pydantic validation. For a current Responses
request the format goes in `text={"format": wire_format}`; tool arguments use
their tool schema instead. Check current compatibility before sending. Provider
strict mode and local Pydantic strict mode are different mechanisms.

## What constrained decoding can and cannot do

Conceptually, a constrained decoder restricts which next outputs can form an
allowed structure. Merely instructing “output JSON” does not enforce that same
mechanism. JSON mode targets syntactic JSON; a supported strict schema targets
schema adherence on successful structured output. Neither ensures the extracted
number is the correct policy period or that the named source is authorized.

Cross-field conditions such as “answered implies non-null days and source” still
need enforcement if absent from, or unsupported by, the wire contract. Business
rules can change without changing types. Keep them explicit and versioned.

## Schema evolution is a consumer migration

If v2 changes `days` to business days or allows more outcome values, an old consumer
may parse it and still act incorrectly. Dispatch on a known version and adapt
deliberately; do not silently ignore new fields or reinterpret units. Record the
schema version with accepted objects and re-run compatibility fixtures before
deployment. A narrower enum can be a breaking change too.

## Recall and common errors

Which combinations allow an omitted `days` key? Which allow `days: null`? Why
does a closed outer object not close a nested one? A strong answer distinguishes
presence, type, unknown-key policy, dialect support, and semantic acceptance.
“Valid JSON means correct data” is the central misconception to reject.

## Verified references

- [JSON Schema: object properties, required, and additional properties](https://json-schema.org/understanding-json-schema/reference/object)
- [OpenAI: structured outputs and supported schemas](https://developers.openai.com/api/docs/guides/structured-outputs)
