---
id: ai-encoder-decoder-roles
kind: question
topicId: ai-deep-learning
lessonId: lesson-ai-encoder-decoder
prompt: What distinguishes an encoder from a decoder, and must an encoder-decoder use a single fixed-size latent vector?
difficulty: medium
frequent: true
status: published
revision: 1
order: 180
tags: [encoder-decoder, representation-learning]
conceptIds: [concept-encoder-decoder, concept-representation-learning]
followUps:
  - Describe an image classifier and a translation model using these roles.
  - What is different between teacher forcing and autoregressive inference?
misconception: Encoder and decoder are roles; they are not synonyms for a particular CNN, RNN, or Transformer family.
---

## Answer

An encoder maps inputs to representations; a decoder maps representations or context
to outputs. A classifier can use encoder features and a small task head without a
generative decoder. A translator can use a decoder conditioned on encoder states and
the preceding target tokens. A single fixed-size vector is one design, not a
requirement: attention can access an entire sequence of encoder states.

### Supporting reasoning

An encoder output of shape `(source_length, hidden_width)` can remain available at
every target step. Teacher forcing supplies correct previous target tokens during
training; ordinary autoregressive inference consumes generated previous tokens.
The particular masks, heads, and objective determine information flow and use.

### Evaluation rubric

- **1 point:** defines both roles and separates them from model families.
- **1 point:** gives two correct application examples.
- **1 point:** permits source-state sequences and conditional attention.
- **1 point:** distinguishes teacher forcing from inference or explains shapes.

“Encoder compresses; decoder decompresses” alone misses conditional generation.

### Reference

[Bahdanau et al.](https://arxiv.org/abs/1409.0473)
and [encoder/decoder lesson](../lessons/encoder-decoder.md).
