---
id: lesson-ai-llm-capabilities-limitations
kind: lesson
topicId: ai-llm-fundamentals
title: LLM Capabilities, Limitations, and Engineering Choices
summary: Diagnose unsupported answers and context failures, compare models on task evidence, and select prompting, retrieval, tools, or fine-tuning appropriately.
difficulty: medium
status: published
revision: 1
order: 160
tags: [llm, evaluation, hallucination, model-selection]
conceptIds: [concept-llm-reliability]
prerequisiteIds: [lesson-ai-instruction-tuning-alignment, lesson-ai-llm-inference]
---

## A useful capability is a measurable behavior

LLMs can transform text, draft code, classify, extract, summarize, and propose tool
calls. The useful question is whether a specified model and configuration meet the
task's quality, latency, and cost requirements on representative inputs. A general
benchmark score or one impressive demo is not that measurement.

A generated answer can sound confident while being unsupported or false. The
language-model objective rewards predictable sequences, not a mandatory fact-check
against an authoritative database. Post-training improves behavior but can still
reward plausible answers. A fabricated citation can look syntactically valid.

## Diagnose before prescribing

| Failure | Example | First useful intervention |
| --- | --- | --- |
| Ambiguous instruction | “Summarize briefly” gives five paragraphs | Define audience, length, and required fields |
| Missing evidence | Asked for a policy updated yesterday | Retrieve a current authorized source |
| Arithmetic or exact lookup | Incorrect tax multiplication | Use validated deterministic tools |
| Context misuse | Right paragraph supplied, wrong policy cited | Inspect packing, contradictions, and evidence use |
| Unsupported behavior | Model cannot follow a complex extraction contract reliably | Evaluate other model/configuration or adaptation |
| Integration bug | Stream truncated but UI shows success | Fix lifecycle/status handling |

These are hypotheses, not automatic cures. Retrieved text can be stale or malicious;
a tool result can be wrong; a longer prompt can bury relevant information. Do not
solve every failure by appending another instruction.

## Worked product comparison

Suppose two candidates answer 100 reviewed support questions. A succeeds on 92,
including 18 of 20 difficult cases, at 900 ms median and 2,400 ms p95. B succeeds
on 94 but only 15 of those 20, at 1,800 ms median and 4,000 ms p95. B's aggregate
score is higher, but A performs better on the important slice and may meet a
3-second latency requirement that B misses. These are invented comparison data,
not claims about named commercial models.

```python
candidates = {
    'A': {'correct': 92, 'critical_correct': 18, 'p95_ms': 2400},
    'B': {'correct': 94, 'critical_correct': 15, 'p95_ms': 4000},
}
eligible = [name for name, m in candidates.items()
            if m['p95_ms'] <= 3000 and m['critical_correct'] >= 18]
assert eligible == ['A']
print(eligible)
```

The program implements declared constraints, not statistical certainty. With small
datasets, uncertainty can be substantial. Use paired errors, repeat runs when
stochastic variation matters, and increase important-slice coverage before making
strong conclusions. Measure cost per successful task, including retries and tools,
not just advertised price per token.

## Context, knowledge, and confidence

A model's context window is a capacity limit; it is not a guarantee that every
included fact will be used correctly. Position, ambiguity, conflicting evidence,
and distractors can change behavior. A training cutoff is not a complete inventory
of known facts. Current information needs external evidence when freshness matters.
An answer's self-reported confidence is not necessarily calibrated probability.

For a financial policy assistant, require source identifiers and evidence spans,
check that the cited text actually supports the claim, and abstain or escalate when
the evidence does not answer the question. A citation string without support does
not make the answer grounded. Conversely, an answer can be grounded in an obsolete
document and still be wrong for today's question.

## Choose a model configuration as a system version

Record model identifier/snapshot where available, prompt version, decoding settings,
tool definitions, retrieval configuration, and evaluation dataset version. Compare
upgrades against a frozen baseline before rollout. Provider changes, fine-tuning,
and prompt edits can all change performance. Test refusals, no-answer cases,
multilingual inputs, long documents, and invalid tool requests alongside happy paths.

Rules and conventional software remain valuable. Parsing a known fixed code,
enforcing a permission, or summing money may be better handled deterministically.
The model can propose an interpretation; application code decides what is accepted
and what action is permitted.

## Recall

Why might candidate A be preferable despite lower aggregate success? Give one case
each for prompt repair, retrieval, and a deterministic tool. Explain why neither
low temperature nor a long context window guarantees factuality. Use mechanisms
and failure evidence, rather than describing a model as simply “smarter.”

## Verified references

- [OpenAI text generation: versioning and evaluations](https://developers.openai.com/api/docs/guides/text)
- [OpenAI function-calling lifecycle](https://developers.openai.com/api/docs/guides/function-calling)
- [Hugging Face causal-language-model objective](https://huggingface.co/learn/llm-course/chapter7/6)
