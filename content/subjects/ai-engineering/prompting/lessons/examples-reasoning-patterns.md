---
id: lesson-ai-prompt-examples-patterns
kind: lesson
topicId: ai-prompt-engineering
title: Examples, Reasoning Strategies, and Prompt Patterns
summary: Choose zero-shot or few-shot instructions, construct representative demonstrations, and use decomposition and verification without treating explanations as proof.
difficulty: medium
status: published
revision: 1
order: 230
tags: [prompting, few-shot, decomposition, python]
conceptIds: [concept-prompt-examples]
prerequisiteIds: [lesson-ai-prompt-instruction-design]
---

## Examples are part of the specification

Zero-shot prompting provides instructions without demonstrations. Few-shot prompting
adds examples of inputs and desired outputs. Demonstrations can communicate label
boundaries, formatting, exceptions, and style more concretely than prose alone.
They also consume tokens, can bias label frequencies, and can contradict the stated
rules. More examples are not automatically better, especially across model families.

For support routing, define `billing`, `access`, and `other`. “Charged twice” is
billing; “Cannot sign in” is access. But “My card was charged and now I cannot sign
in” needs an explicit multi-intent or tie-breaking policy. Two easy demonstrations
do not define that boundary by themselves.

## Work through a few-shot classifier prompt

Choose examples by their diagnostic value. Include a clear positive for each label,
a boundary case, and a missing-information case if the task permits abstention.
Keep examples disjoint from held-out evaluation fixtures. In-context examples change
activations within the request; they normally do not update model weights.

```python
import json

examples = [
    ('Charged twice for one order.', 'billing'),
    ('Cannot sign in after password reset.', 'access'),
    ('Where can I find product dimensions?', 'other'),
]
allowed = {'billing', 'access', 'other'}
assert all(label in allowed for _, label in examples)
messages = []
for text, label in examples:
    messages += [{'role': 'user', 'content': text},
                 {'role': 'assistant', 'content': json.dumps({'label': label})}]
messages.append({'role': 'user', 'content': 'I was billed for a cancelled order.'})
assert len(messages) == 7 and messages[-1]['role'] == 'user'
assert len({label for _, label in examples}) == 3
print('3 demonstrations; 1 unlabelled task')
```

This builds the request input; it does not run a model or imply measured accuracy.
Add developer instructions defining labels and a structured output schema before
making an evaluated API call. If demonstrations use `payments` while the schema
requires `billing`, fix the inconsistency rather than adding another warning.

## Decompose work at useful boundaries

For invoice processing, separate extraction, deterministic validation/calculation,
and response presentation. A model may locate line items; code can sum integer
amounts and compare against the final total. If a record is uncertain, return it
for review rather than passing a guessed value into a later calculation.

```text
source → extract candidate fields → schema/evidence validation
                                         ↓
                              deterministic calculation
                                         ↓
                              final checked presentation
```

Multiple calls add cost, latency, and error-propagation opportunities. Decompose
only where the intermediate result can be checked or the task genuinely benefits.
Asking the same model to “verify itself” is a useful candidate-generation tactic,
not an independent correctness guarantee. A repeated wrong assumption can survive
every stage.

## Reasoning-oriented requests

Ask for the deliverables that help the task: a concise justification, evidence
spans, explicit assumptions, or a calculation that can be independently checked.
Do not require a transcript of hidden internal reasoning or assume a lengthy
step-by-step explanation is faithful proof. Reasoning models may perform better
with direct objectives and tool access than with prescriptive reasoning rituals.
Evaluate on the chosen model and task instead of copying a universal phrase.

For a policy answer, “state the answer, cite the supporting paragraph, and flag
missing information” gives inspectable artifacts. For arithmetic, a calculator
result is stronger than an eloquent explanation. Self-consistency across several
samples can improve some tasks but can also repeat a shared error and increase cost.

## Failure exercise

A few-shot prompt routes every test case to billing. Inspect label balance,
ambiguous examples, example ordering, conflicting instructions, and whether the
test population differs from the demonstrations. Change one factor at a time and
evaluate on cases not used to design the examples.

## Active recall

When does few-shot help communicate a boundary that a schema cannot? Why is it
not the same as fine-tuning? Give one useful decomposition and one wasteful one.
A strong answer names feedback/evaluation, token cost, and independently checkable
intermediate artifacts rather than claiming a particular phrase forces correctness.

## Verified references

- [OpenAI text generation and model-dependent prompting](https://developers.openai.com/api/docs/guides/text)
- [OpenAI function-calling guidance on examples and application logic](https://developers.openai.com/api/docs/guides/function-calling)
