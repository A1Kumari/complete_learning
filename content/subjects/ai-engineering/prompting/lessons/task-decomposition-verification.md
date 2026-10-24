---
id: lesson-ai-prompt-task-decomposition
kind: lesson
topicId: ai-prompt-engineering
title: Task Decomposition and Verification Strategies
summary: Break complex model tasks into bounded steps and verify intermediate results without assuming that more reasoning text means more correctness.
difficulty: medium
status: published
revision: 1
order: 235
tags: [prompting, decomposition, verification]
prerequisiteIds: [lesson-ai-prompt-instruction-design, lesson-ai-prompt-examples-patterns]
---

## Decompose when the boundary helps

A single request that must classify, retrieve, calculate, and write may fail silently.
Separate steps when each has a clear input and acceptance rule:

```text
extract fields → validate fields → retrieve policy → draft answer → check claims
```

Use ordinary code for deterministic arithmetic and permission checks. Ask the model
for an intermediate representation only when it helps the next step, and do not expose
private chain-of-thought as if it were a reliable audit trail. Store concise decisions,
inputs, and validator results instead.

## Verification is a second contract

Check schema validity, allowed labels, source support, arithmetic with code, and required
fields. A second model judge can be useful for triage, but it is itself fallible and
needs calibration against human labels.

## Recall

When is decomposition unnecessary overhead? Why can a syntactically valid intermediate
step still require semantic verification?
