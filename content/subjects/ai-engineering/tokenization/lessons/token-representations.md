---
id: lesson-ai-token-representations
kind: lesson
topicId: ai-tokenization-embeddings
title: Token Embeddings and Contextual Representations
summary: Calculate embedding lookup shapes, distinguish learned parameters from activations, and show how context and position change token representations.
difficulty: medium
status: published
revision: 1
order: 125
tags: [embeddings, tokenization, numpy]
conceptIds: [concept-tokenization, concept-token-representations]
prerequisiteIds: [lesson-ai-text-tokenization]
---

## An ID selects a row

A model with vocabulary size `V` and hidden width `D` can store a learned embedding
matrix `E` with shape `(V,D)`. Token ID `i` retrieves `E[i]`, a vector of `D`
numbers. For a sequence of `L` IDs, lookup returns `(L,D)`; for a batch of `B`
equal-length sequences it returns `(B,L,D)`. Padding creates equal lengths, but an
attention mask must identify positions that should not contribute.

An embedding table is a parameter array learned during training. A lookup result
is an activation used for this input. During normal inference the activation changes
with the IDs while the table remains fixed. Repeated occurrences of one ID initially
retrieve the same row; their final contextual states need not match.

```text
IDs [bank, river, bank]
         ↓ same table row for each bank ID
initial token vectors + positional information
         ↓ contextual network with its attention mask
one hidden state per occurrence, conditioned on permitted context
```

## A worked lookup and shape trace

Use a tiny hand-chosen table. These numbers demonstrate mechanics, not actual
semantic distances. ID 0 is padding; IDs 1 and 2 are two vocabulary entries.

```python
import numpy as np

table = np.array([[0., 0.], [1., 2.], [3., 4.]])
ids = np.array([1, 2, 1, 0])
vectors = table[ids]
assert table.shape == (3, 2) and vectors.shape == (4, 2)
np.testing.assert_allclose(vectors[0], vectors[2])
mask = (ids != 0).astype(float)
pooled = (vectors * mask[:, None]).sum(axis=0) / mask.sum()
np.testing.assert_allclose(pooled, [5/3, 8/3])
print(vectors.tolist())
print(pooled.round(4).tolist())
```

Output is `[[1.0,2.0],[3.0,4.0],[1.0,2.0],[0.0,0.0]]` and pooled vector
`[1.6667,2.6667]`. Including the padding row would divide by four rather than
three, changing the representation. In a trained network padding states need not
be zero after processing, so masking matters even beyond this simple example.

For `V=50,000` and `D=768`, the table contains 38,400,000 scalar parameters.
With two bytes per scalar, raw storage is 76,800,000 bytes, about 73.24 MiB, excluding
training optimizer state and runtime overhead. More vocabulary entries reduce some
sequence lengths but increase table size and often output-projection work.

## Contextual states are not merely table rows

The word “bank” in “river bank” and “bank account” may start with the same token
embedding if the tokenizer assigns the same ID. A contextual network transforms
each occurrence using nearby or distant permitted information. A bidirectional
encoder may see tokens on both sides; a causal model cannot use future tokens at
that position. Even within the same sentence, position and mask change access.

A simplified Transformer block mixes token information through attention and
applies feed-forward transformations, residual connections, and normalization.
This lesson does not require deriving attention, but it is important that lookup
alone does **not** perform those contextual operations.

Positional information can be added to token vectors, learned separately, or applied
inside attention, as with rotary mechanisms. Not every model computes “token vector
plus position vector” in the same way. Without appropriate order information, plain
unmasked self-attention treats rearrangements equivariantly rather than automatically
understanding sequence order.

## Choose the right representation for the job

Do not average arbitrary table rows and call the result a production sentence
embedding. Pooling contextual states is one ingredient, but training objective,
model-specific pooling, normalization, query/document prefixes, and maximum length
determine whether the resulting vectors work for retrieval. A last-token state
from a generation model is not automatically compatible with a separately trained
embedding service—even when both have the same vector dimension.

If upgrading an embedding model, regenerate document vectors or maintain explicitly
separated indexes. Equal dimensionality does not imply a shared coordinate system.
Evaluation should include actual query/document relevance, not only whether the
array has the expected shape.

## Recall and practical application

For `B=2,L=7,D=4`, predict the lookup shape: `(2,7,4)`. Explain which values are
learned parameters and which are per-request activations. Then explain why the
two occurrences of “bank” can diverge after contextual processing.

**Misconceptions:** IDs are not vectors; table lookup is not contextualization;
larger vectors do not guarantee better semantic search. To debug an embedding API,
check tokenizer/model alignment, masks, truncation, pooling, and model version before
changing the nearest-neighbor algorithm.

## Verified references

- [Vaswani et al., model and embedding components](https://arxiv.org/html/1706.03762v7)
- [Hugging Face tokenizer algorithms](https://huggingface.co/learn/llm-course/chapter6/5)

Continue to [sentence embeddings](sentence-embeddings.md).
