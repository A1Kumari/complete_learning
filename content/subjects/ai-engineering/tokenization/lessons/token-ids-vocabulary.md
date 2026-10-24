---
id: lesson-ai-token-ids-vocabulary
kind: lesson
topicId: ai-tokenization-embeddings
title: Token IDs, Vocabulary, Encoding, and Decoding
summary: Trace text through vocabulary lookup and back again, including special tokens, padding, truncation, and lossless round-trip assumptions.
difficulty: easy
status: published
revision: 1
order: 115
tags: [tokenization, token-ids, vocabulary]
prerequisiteIds: [lesson-ai-why-tokenization-exists, lesson-ai-text-tokenization]
---

## Vocabulary and IDs are a contract

A tokenizer vocabulary maps each token string to an integer ID and includes special
items such as beginning-of-sequence, end-of-sequence, padding, or unknown tokens.
Encoding applies the tokenizer's splitting rules and lookup; decoding maps IDs back to
text using the same vocabulary and normalization rules.

```text
text → normalize/split → token pieces → integer IDs → model
model IDs → vocabulary → pieces → decode → text
```

The round trip may not preserve every original byte. Normalization can change spaces,
Unicode forms, or control characters. For application data, test the exact tokenizer
and preserve the original document alongside tokenized storage.

## Padding and truncation change meaning

Batches usually need equal-length arrays, so shorter sequences are padded and their
padding positions are masked. Truncation must be explicit: truncating the beginning may
remove instructions, while truncating the end may remove the question. Reserve space
for the expected output instead of filling the entire context window with input.

## A useful implementation check

For a real tokenizer, inspect token strings, IDs, count, special-token mask, and decoded
text for English, code, a long identifier, and a non-English example. Treat the
tokenizer version as part of the model request contract.

## Recall

Why must padding be masked during training or attention? Why can decoding token IDs be
different from recovering the original input byte-for-byte?

Continue to [token embeddings and contextual representations](token-representations.md).
