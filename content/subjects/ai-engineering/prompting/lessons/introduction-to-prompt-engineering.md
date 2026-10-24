---
id: lesson-ai-prompting-introduction
kind: lesson
topicId: ai-prompt-engineering
title: Introduction to Prompt Engineering
summary: Treat a prompt as an interface contract and improve a simple task by making its goal, inputs, output, and failure behavior explicit.
difficulty: easy
status: published
revision: 1
order: 215
tags: [prompting, contracts, llm-applications]
prerequisiteIds: [lesson-ai-model-api-lifecycle, lesson-ai-llm-capabilities-limitations]
---

## Prompts are part of the program

A prompt combines instructions, data, examples, and output constraints. It is not a
magic spell: changing wording changes an input to a probabilistic system. A reliable
prompt states the task, defines ambiguous terms, marks untrusted data, requests a
known format, and tells the application what to do when evidence is missing.

```text
role and policy → task → trusted inputs → untrusted evidence → output contract
```

Compare “summarize this” with “return three factual bullets, each supported by a
source span; return `insufficient_evidence` if none is present.” The second gives the
model and the validator a testable contract, though the validator still matters.

## Improve with evidence

Change one variable at a time, keep representative test cases, and inspect failures by
category. Prompt quality is task-specific; an instruction that helps extraction may
hurt creative drafting. Do not claim a prompting trick is universal without a test set.

## Recall

Why is a prompt contract not a substitute for output validation? What makes a prompt
change measurable rather than anecdotal?

Continue to [prompt structure and instruction design](instruction-design.md).
