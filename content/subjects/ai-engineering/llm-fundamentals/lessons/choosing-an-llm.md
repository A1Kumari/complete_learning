---
id: lesson-ai-choosing-an-llm
kind: lesson
topicId: ai-llm-fundamentals
title: Choosing an LLM with Evaluation Evidence
summary: Compare model quality, latency, cost, context, tool support, and operational constraints instead of choosing by reputation alone.
difficulty: medium
status: published
revision: 1
order: 170
tags: [llm, evaluation, model-selection, production]
prerequisiteIds: [lesson-ai-llm-inference, lesson-ai-llm-capabilities-limitations]
---

## Start with the task contract

Write down representative inputs, acceptable outputs, maximum latency, privacy
requirements, budget, and failure behavior before comparing models. A model that wins a
public benchmark can lose on your domain's identifiers, languages, or structured-output
requirements.

## A practical comparison matrix

Measure task quality, structured-output validity, tool-call correctness, refusal and
safety behavior, time to first token, total latency, throughput, input/output price,
context capacity, rate limits, and data-retention terms. Include open-weight models
when hosting control or predictable cost matters, and proprietary models when managed
quality or capabilities justify the dependency.

## Benchmark the system, not just the model

Use a fixed golden set with easy cases, boundary cases, adversarial inputs, long
contexts, and real user language. Record the model version, prompt, tools, retrieval
configuration, and decoding settings. Compare confidence intervals or slice-level
results when the set is small; one average score hides important regressions.

```text
candidate → same test set → quality + latency + cost + failure review
```

Do not compare a deterministic temperature-zero run with a highly sampled run and call
the difference a model capability. Re-run after provider or model-version changes.

## The decision is reversible when the boundary is clean

Put provider-specific code behind a small model gateway. Normalize request and response
telemetry, but do not pretend that every provider has identical tool schemas, token
accounting, or cancellation semantics. Keep a fallback only when its quality and
failure behavior have been tested.

## Recall

Why should tool-call correctness be measured separately from prose quality? Name two
model-selection constraints that are not captured by a benchmark score.

See also [LLM limitations](llm-capabilities-limitations.md).
