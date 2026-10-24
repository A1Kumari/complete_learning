---
id: lesson-ai-language-model-introduction
kind: lesson
topicId: ai-llm-fundamentals
title: Introduction to Language Models
summary: Understand what language models predict, how modern LLMs differ from conventional software, and where they are useful.
difficulty: easy
status: published
revision: 1
order: 110
tags: [llm, language-models, foundations]
conceptIds: [concept-language-modeling]
prerequisiteIds: []
---

## The practical problem

A normal program follows rules written by a developer. A language model learns a
statistical relationship from examples and uses that relationship to predict what
could come next. Given `The package arrived`, it may assign high probability to
`today`, `safely`, or a punctuation mark. It does not look up one guaranteed answer
unless an application gives it a tool or a source to consult.

## What a language model does

A language model estimates a distribution over the next token:

```text
text so far:  The package arrived
possible next tokens: today (0.42), safely (0.18), late (0.07), ...
```

The model repeats this prediction after appending the chosen token. This makes it
generative: it can produce new sequences. A classifier instead chooses among known
labels, such as `refund` or `shipping`, although a language model can also be used to
generate a label in a constrained application.

## Traditional models and modern LLMs

Older n-gram models counted short windows and quickly ran out of context. Neural
language models learned distributed representations, and Transformer-based LLMs can
process long token sequences in parallel during training. Scale improves capability,
but it does not remove the need for data quality, evaluation, authorization, or
application validation.

## A model is not a database or a program

Parameters encode patterns, not a browsable source of truth. The model can produce
fluent but unsupported text, and a request changes its output rather than its stored
weights. Your application owns the contract around the model: input validation,
retrieval, tool permissions, output acceptance, retries, and observability.

## Where language models fit

Useful applications include drafting, extraction, classification, code assistance,
search interfaces, and tool-mediated workflows. Choose a smaller deterministic
classifier or a normal function when the task has a fixed rule and failure is costly.
The best first design is often a narrow model call surrounded by ordinary software.

## Recall

Explain why next-token prediction can generate a paragraph but does not guarantee
that the paragraph is true. Name one responsibility that belongs to the application
rather than the model provider.

Continue to [how language models learn](language-model-pretraining.md).
