---
id: lesson-ai-output-typed-validation
kind: lesson
topicId: ai-structured-output
title: Strict Typed Validation and Evidence Checks
summary: Validate nested output with Pydantic, reject unwanted coercion and extra fields, and enforce source provenance and cross-field semantics separately.
difficulty: medium
status: published
revision: 1
order: 310
tags: [structured-output, pydantic, validation, python]
conceptIds: [concept-output-validation, concept-output-contracts]
prerequisiteIds: [lesson-ai-output-schema-contracts]
---

## Parsing into a type is an explicit decision

Pydantic v2 normally coerces some values: a string such as `"30"` may become an
integer. Sometimes that is intentional input normalization; sometimes it hides a
broken model contract. Enable strictness when the consumer requires the original
type, and forbid unexpected fields instead of silently discarding them. Strict
JSON and strict Python validation can differ for types such as dates; test the
actual entry point you use.

These examples require Python 3 and Pydantic v2, tested with 2.13.4. This is a
local teaching dependency, not a new dependency of the React application.

```text
complete JSON text → Pydantic structure/types → allowed source lookup
                                                     ↓
                                      compare claim to source meaning
                                                     ↓
                                            accept or review
```

## Validate a policy extraction

The generated result states an outcome, days, and source. We use strict types,
closed fields, a version literal, and a local evidence map. Real provenance also
needs source revision, authorization, effective date, and faithful passage support.

```python
from typing import Literal
from pydantic import BaseModel, ConfigDict, Field, ValidationError

class PolicyAnswer(BaseModel):
    model_config = ConfigDict(strict=True, extra='forbid')
    schema_version: Literal['policy-v1']
    outcome: Literal['answered', 'insufficient_evidence']
    days: int | None = Field(ge=0)
    source_id: str | None

def evidence_check(answer, allowed_sources):
    if answer.outcome == 'insufficient_evidence':
        return answer.days is None and answer.source_id is None
    source = allowed_sources.get(answer.source_id)
    return (answer.days is not None and source is not None
            and answer.days == source['days'])

raw = '{"schema_version":"policy-v1","outcome":"answered","days":30,"source_id":"p3"}'
answer = PolicyAnswer.model_validate_json(raw)
assert evidence_check(answer, {'p3': {'days': 30}})
assert not evidence_check(answer, {'p3': {'days': 14}})
assert not evidence_check(answer, {})
for changes in [{'days': '30'}, {'days': True}, {'days': -1},
                {'extra': 'unexpected'}, {'schema_version': 'policy-v2'}]:
    try:
        PolicyAnswer.model_validate({**answer.model_dump(), **changes})
    except ValidationError:
        pass
    else:
        raise AssertionError('bad contract accepted')
print('strict types and version checked; unsupported policy claim rejected')
```

All four keys are required because nullable fields have no defaults. The source
map is trusted fixture data, not a second model's opinion. An object can pass
Pydantic and fail the evidence check, as the 30-versus-14 case demonstrates.
Do not treat `model_construct()` as validation; it bypasses it. Avoid mutating
an accepted model into invalid state later, or revalidate at the commit boundary.

## Nested objects and cross-field constraints

For line-item extraction, define child models explicitly and configure their extra
field policy too. A sum of line items, tax, and discount is a cross-field business
check; a valid integer in every field does not establish the equation. Keep money
in declared units and use exact arithmetic/decimal policies rather than comparing
arbitrary floating-point totals for equality.

An evidence quote being a substring is only a weak check. “30 days for standard
orders; custom orders excluded” contains 30, but does not support a 30-day claim
for a custom order. Semantic acceptance must match the question, scope, and
exceptions. When automatic checks cannot establish that, route to review or a
declared insufficient-evidence result rather than pretending types proved meaning.

## Parsing edge cases and diagnostics

Decide what to do with duplicate JSON keys, nonstandard numeric constants, trailing
text, and oversized inputs. Different parsers can accept different extensions or
choose one duplicate value. If your boundary requires rejection, configure or
precheck it explicitly rather than assuming every validator rejects duplicates.
Bound size/depth and validate exactly one declared payload.

Validation errors can contain original rejected values. Log field paths and error
categories without automatically exposing sensitive raw fields to logs or a retry
prompt. A corrective request should receive the smallest necessary error summary
and original authorized evidence, not a leaked full exception dump.

## Recall

Why reject boolean true for `days` despite Python's bool/int relationship? What
does strict validation establish, and what does the allowed-source lookup establish?
Give an example where a present quote does not support the scoped answer. Explain
why validation bypass APIs are inappropriate for untrusted model output.

## Verified references

- [Pydantic: strict mode and Python/JSON differences](https://docs.pydantic.dev/latest/concepts/strict_mode/)
- [Pydantic: models, extra fields, validation, and model_construct](https://docs.pydantic.dev/latest/concepts/models/)
- [JSON Schema object semantics](https://json-schema.org/understanding-json-schema/reference/object)
