---
id: lesson-ai-why-tokenization-exists
kind: lesson
topicId: ai-tokenization-embeddings
title: Why Tokenization Exists
summary: Learn why language models operate on token sequences rather than raw characters or words, and how token boundaries affect cost and behavior.
difficulty: easy
status: published
revision: 1
order: 100
tags: [tokenization, llm, context-windows]
prerequisiteIds: []
---

## Text is not the model's input

Neural networks consume numbers with fixed shapes. Tokenization converts text into a
sequence of vocabulary items that can be mapped to integers. For example, a tokenizer
might represent `unhappy` as `[un, happy]` rather than requiring every possible word
to be in its vocabulary.

## Why not use whole words?

Word vocabularies are large, struggle with spelling and new names, and waste separate
entries on related forms. Character vocabularies are compact but create long sequences
and make learning long-range meaning harder. Subword tokenization is a compromise:
common pieces are short, reusable, and usually preserve enough structure for efficient
processing.

Tokenization also affects context limits, billing, latency, and prompt truncation. Two
visually similar strings can use very different token counts, especially across
languages, source code, emoji, and unusual identifiers.

## A small mental model

```text
"reusable API" → ["re", "usable", " API"] → [421, 9182, 734]
```

The exact pieces and IDs belong to one tokenizer vocabulary. Never count words when an
API or context budget is defined in tokens. Token IDs also have no semantic order: ID
9182 is not inherently closer in meaning to 9183 than to 42.

## Recall

Why can a subword vocabulary handle a new product name better than a word vocabulary?
What product behavior is affected by token count even before model quality is considered?

Continue to [tokenization algorithms](text-tokenization.md).
