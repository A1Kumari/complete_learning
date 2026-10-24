---
id: lesson-ai-context-packing
kind: lesson
topicId: ai-context-engineering
title: Deterministic Context Packing and Token Budgets
summary: Reserve mandatory context and generation space, pack whole evidence items with a supplied request counter, and explain why greedy selection is a policy rather than an optimum.
difficulty: medium
status: published
revision: 1
order: 270
tags: [context-engineering, token-budgets, python]
conceptIds: [concept-context-budgeting, concept-tokenization]
prerequisiteIds: [lesson-ai-context-selection, lesson-ai-text-tokenization]
---

## Budget the serialized request

A context window is a capacity constraint, not a word-count limit or a promise of
effective recall. Count instructions, messages, role formatting, tool schemas,
evidence labels, history, and reserved generation. Some providers include internal
reasoning in output/context accounting; use the selected model's documented rules.

```text
context capacity
  - reserved output
  - safety margin for counting uncertainty
  = maximum request budget

request = mandatory instructions/task + selected optional context
```

A hypothetical 8,192-token capacity with 1,500 reserved output and a 192-token
margin allows 6,500 input tokens. If mandatory instructions and task already cost
6,600, fail explicitly or redesign the request. Silently truncating the user's
question to force a fit changes the problem.

## A deterministic packing procedure

Keep required messages first. Rank optional evidence by a declared policy, try
whole items, and recount the complete tentative request. Skip an item that does
not fit and continue to smaller ones. Do not assume the sum of independently
tokenized strings exactly equals the final serialized count; boundaries and
formatting can alter it. Preserve tool-call/result relationships and other atomic
groups rather than splitting them into orphaned fragments.

```python
def pack(required, candidates, count_request, capacity, output, margin):
    input_limit = capacity - output - margin
    selected = list(required)
    if input_limit < 0 or count_request(selected) > input_limit:
        raise ValueError('mandatory context exceeds request budget')
    for item in sorted(candidates, key=lambda x: (-x['score'], x['id'])):
        trial = selected + [item]
        if count_request(trial) <= input_limit:
            selected = trial
    assert count_request(selected) + output + margin <= capacity
    return selected

# These are explicit synthetic serialized-request costs, not real tokenization.
costs = {'task': 12, 'policy': 8, 'long-history': 12, 'exception': 5}
def fixture_count(items):
    return sum(costs[item['id']] for item in items)

required = [{'id': 'task'}]
candidates = [
    {'id': 'policy', 'score': .9},
    {'id': 'long-history', 'score': .8},
    {'id': 'exception', 'score': .7},
]
result = pack(required, candidates, fixture_count, 34, 4, 2)
assert [x['id'] for x in result] == ['task', 'policy', 'exception']
assert fixture_count(result) == 25
try:
    pack(required, candidates, fixture_count, 10, 4, 2)
except ValueError:
    pass
else:
    raise AssertionError('mandatory overflow ignored')
print('task + policy + exception: 25 input units; mandatory overflow rejected')
```

The fixture's input limit is 28. Task and policy cost 20; adding long history would
cost 32 and is skipped; adding the exception instead costs 25. In production,
`count_request` must serialize the actual candidate request and apply the real
model's token-count procedure, including framing/tool overhead. The callable
interface separates packing from provider-specific counting. The supplied fixture
tests selection, not a claim that its invented costs are real model tokens.

## Why greedy is not automatically optimal

Ranking by score can waste a budget on a long item while several shorter items
would collectively be more useful. Pure score-per-token ranking has its own
failure: two short fragments may omit the exception needed to interpret a rule.
Multi-hop questions require complementary coverage, not just independently good
scores. Evaluate greedy, category budgets, and more sophisticated selection against
task outcomes rather than calling one heuristic universally best.

Record stable tie-breaking and ordering. The same selected set in a different order
can change a model's evidence use. Deterministic assembly makes these changes
reproducible; it does not make the model output deterministic.

## Truncation and compression choices

Dropping a whole irrelevant old turn is often safer than cutting the end of every
message. Cutting a document can remove a total, negation, expiry date, or exception.
If you extract a passage, retain enough surrounding context and provenance to
interpret it. A summary saves tokens but is a lossy transformation that needs
faithfulness checks. Exact identifiers and operational state often belong in
structured records rather than prose summaries.

## Practical debugging exercise

The packer fits a refund policy but excludes the product-specific exception. The
model answers correctly for generic orders and incorrectly for custom orders.
Increasing the window might help, but first check whether your candidate ranking,
atomic grouping, or category budgets omitted an essential dependency. More tokens
spent on duplicate history would not fix missing evidence.

## Recall

Trace all four selection costs before running code. Why recount a complete request?
What must happen if mandatory inputs exceed budget? Name an atomic group that must
not be split. A strong answer separates counting accuracy, selection policy,
information preservation, and model quality.

## Verified references

- [OpenAI: context-window accounting](https://developers.openai.com/api/docs/guides/conversation-state#managing-the-context-window)
- [Anthropic: context curation and compaction](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
