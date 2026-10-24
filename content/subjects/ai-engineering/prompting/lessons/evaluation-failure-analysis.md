---
id: lesson-ai-prompt-evaluation
kind: lesson
topicId: ai-prompt-engineering
title: Prompt Evaluation and Failure Analysis
summary: Compare prompt versions on reviewed fixtures, separate structural and semantic errors, and decide whether prompting is the right intervention.
difficulty: medium
status: published
revision: 1
order: 250
tags: [prompting, evaluation, regression-testing, python]
conceptIds: [concept-prompt-evaluation]
prerequisiteIds: [lesson-ai-prompt-templates, lesson-ai-llm-capabilities-limitations]
---

## Define success before comparing prompts

“The answer looks better” is not a stable acceptance rule. Define task correctness,
format compliance, evidence support, latency, and cost separately. For invoice
extraction, correctness could require exact currency and total in minor units,
including null when the source lacks evidence. For summarization, a reviewed rubric
may be more appropriate than exact wording.

```text
reviewed dataset → baseline and candidate → independent acceptance checks
                                              ↓
                       paired errors → failure categories → targeted change
```

Keep development examples distinct from the held-out set used for final comparison.
If every failure becomes a prompt example and the same test set is repeatedly
optimized, the apparent improvement can overfit those fixtures. Refresh evaluation
data and include production-like slices, not only hand-picked easy cases.

## Worked comparison with deterministic fixtures

The following are explicitly **recorded fictional candidate outputs**, not model
results. They demonstrate evaluator logic without network calls. In a real run,
save actual outputs with the model and configuration metadata.

```python
import json

gold = {
    'explicit': {'currency': 'EUR', 'total_cents': 1200},
    'missing-currency': {'currency': None, 'total_cents': 1200},
    'subtotal-trap': {'currency': 'USD', 'total_cents': 1500},
}
baseline = {
    'explicit': '{"currency":"EUR","total_cents":1200}',
    'missing-currency': '{"currency":"USD","total_cents":1200}',
    'subtotal-trap': '{"currency":"USD","total_cents":1000}',
}
candidate = {key: json.dumps(value) for key, value in gold.items()}

def evaluate(outputs):
    result = {}
    for key, expected in gold.items():
        try:
            value = json.loads(outputs[key])
        except (ValueError, KeyError):
            result[key] = {'valid': False, 'correct': False}
            continue
        valid = (type(value) is dict and set(value) == {'currency', 'total_cents'}
                 and value['currency'] in ('USD', 'EUR', None)
                 and (value['total_cents'] is None or type(value['total_cents']) is int))
        result[key] = {'valid': valid, 'correct': valid and value == expected}
    return result

a, b = evaluate(baseline), evaluate(candidate)
assert sum(x['valid'] for x in a.values()) == 3
assert sum(x['correct'] for x in a.values()) == 1
assert sum(x['correct'] for x in b.values()) == 3
assert not evaluate({**candidate, 'explicit': '{broken'})['explicit']['valid']
print('baseline 1/3; candidate 3/3; all baseline outputs were structurally valid')
```

The baseline's perfect format score hides two semantic failures: invented currency
and choosing a subtotal. The candidate's 3/3 demonstrates how scoring works, not
proof of general superiority. Three fixtures are far too few for a production
quality claim, and the example candidate intentionally equals the expected records.

## Analyze paired errors and trade-offs

For each case, record whether the candidate fixes an error or introduces a regression.
Report slices such as missing fields, conflicting totals, multilingual formats,
long documents, and adversarial instructions. Measure task success including refusals,
parse failures, timeouts, and schema failures; do not quietly remove failed requests
from the denominator.

For stochastic models, rerun enough samples to understand variability. A fixed seed
can help some experiments but does not universally ensure provider reproducibility.
Measure latency distributions and total tokens/cost, including retries. A longer
few-shot prompt might improve accuracy while failing the product's latency budget.

## Use a failure taxonomy

- **Instruction ambiguity:** repair field definitions and missing-value rules.
- **Conflicting examples:** correct demonstrations and precedence.
- **Missing evidence:** change data access/retrieval rather than demanding certainty.
- **Evidence ignored or contradicted:** inspect context selection and model behavior.
- **Calculation failure:** use checked deterministic computation.
- **Malformed integration:** fix parsing, request fields, or streaming status.
- **Persistent capability gap:** compare models or task adaptation on held-out data.

An LLM judge can help score open-ended outputs, but judge prompts, position/length
biases, and correlated errors require calibration against human-reviewed cases.
Do not ask the same model “are you correct?” and equate agreement with independent
validation. Exact-match metrics also need normalization rules that do not erase
important differences, such as negation or currency.

## Release a prompt as a tested change

Freeze baseline settings, run the candidate on the same evaluation population,
inspect paired failures, check cost/latency, and record a decision threshold. Stage
the rollout and monitor real outcomes. Keep the previous version available for
rollback, but investigate data or provider changes if neither version works.

## Active recall

Why is the baseline's JSON score misleading? What would count as a regression?
Name a failure prompting cannot solve without new evidence. Explain how repeated
optimization on a held-out set turns it into development data.

## Verified references

- [OpenAI text generation: evaluations and versioned behavior](https://developers.openai.com/api/docs/guides/text)
- [OpenAI structured outputs: format versus task correctness](https://developers.openai.com/api/docs/guides/structured-outputs)
