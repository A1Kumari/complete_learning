---
id: lesson-ai-sentence-embeddings
kind: lesson
topicId: ai-tokenization-embeddings
title: Sentence Embeddings and Semantic Similarity
summary: Implement masked pooling and cosine ranking, distinguish similarity from correctness, and design a small retrieval evaluation.
difficulty: medium
status: published
revision: 1
order: 130
tags: [embeddings, retrieval, cosine-similarity, python]
conceptIds: [concept-text-similarity, concept-token-representations]
prerequisiteIds: [lesson-ai-token-representations]
---

## From a token sequence to one text vector

A text embedding represents a span such as a sentence, paragraph, or document in
a vector space. A common single-vector encoder tokenizes the input, computes
contextual states, pools them, and optionally normalizes the result. Some models
use a classification token, some masked mean pooling, and some other heads or
last-token pooling. Use the released model's prescribed procedure rather than
selecting a pooling strategy by convenience.

```text
text → model tokenizer → contextual states
                           ↓ pooling with valid-token mask
                   text vector → normalization → comparison
```

For contextual states `H` with shape `(L,D)` and binary mask `m` of length `L`,
masked mean pooling is:

```text
v[j] = sum_i(m[i] * H[i,j]) / sum_i(m[i])
```

An all-zero mask is an error, not a useful embedding. Whether special tokens are
included is model-specific. This basic introduction covers representation and
similarity; indexing and vector-database design belong to their dedicated topics.

## Work through cosine similarity

Cosine similarity is `dot(a,b)/(norm(a)*norm(b))` for nonzero vectors. It measures
direction rather than raw length and lies between -1 and 1 in exact arithmetic.
With unit-normalized vectors it equals the dot product. Raw dot products also depend
on vector magnitude, so replacing cosine with raw dot product can change rankings.

Take query `[1,0]` and candidates `[3,1]`, `[0,2]`, and `[-1,0]`. Their cosine
scores are `3/sqrt(10) ≈ 0.9487`, `0`, and `-1`. These are deliberately chosen
teaching vectors—not claims about real model embeddings for particular sentences.

```python
from math import sqrt, isclose

def cosine(a, b):
    if len(a) != len(b):
        raise ValueError('dimension mismatch')
    denominator = sqrt(sum(x*x for x in a) * sum(y*y for y in b))
    if denominator == 0:
        raise ValueError('zero vector')
    return sum(x*y for x, y in zip(a, b)) / denominator

query = [1., 0.]
candidates = {'A': [3., 1.], 'B': [0., 2.], 'C': [-1., 0.]}
ranking = sorted(((key, cosine(query, v)) for key, v in candidates.items()),
                 key=lambda item: item[1], reverse=True)
assert [key for key, _ in ranking] == ['A', 'B', 'C']
assert isclose(ranking[0][1], 3 / sqrt(10))
try:
    cosine(query, [0., 0.])
except ValueError:
    pass
else:
    raise AssertionError('zero vector accepted')
print([(key, round(score, 4)) for key, score in ranking])
```

Output: `[('A',0.9487),('B',0.0),('C',-1.0)]`, with normal Python spacing.
For normalized vectors, squared Euclidean distance is `2-2*cosine`, so nearest
Euclidean and greatest cosine rankings agree under those assumptions.

## What makes an embedding useful?

Training can encourage relevant query/document pairs to be close and irrelevant
pairs to be farther apart. A query such as “reset forgotten password” might match
“account access recovery” despite limited word overlap. Exact identifiers, numbers,
negations, and domain jargon can still cause errors. “Refunds are allowed” and
“refunds are not allowed” may be close in topic while contradicting one another.
Similarity is neither entailment nor factual correctness.

Symmetric similarity (two paraphrases) differs from asymmetric retrieval (a short
question and a long answer passage). Some embedding models prescribe different
prefixes or encoders for queries and documents. Use those conventions, keep model
versions compatible, and verify multilingual/domain behavior with real examples.

## A small but meaningful retrieval experiment

Create ten representative queries with reviewed relevant document IDs. Include
exact codes, short ambiguous queries, multilingual queries, negations, and a query
with no answer. Compare an embedding baseline with keyword search on the same
corpus. Inspect whether relevant passages appear in the first few results and
whether truncation cut the answer from a long document. A high average similarity
between documents says little about query relevance.

Choose any abstention threshold on validation examples; a fixed cosine threshold
such as 0.8 does not transfer universally across models. Add corpus permissions
before delivering results: the vector score does not authorize a user to read a
document. Re-embed when changing the model or its required preprocessing.

## Active recall

Calculate the three scores above before running code. Why does `[30,10]` have the
same cosine as `[3,1]`? Why can a topical match contain the opposite policy? What
would you test before migrating to a new model of the same dimensionality?

Check: positive scalar scaling leaves direction unchanged; cosine does not encode
truth guarantees; compare actual relevance with regenerated compatible embeddings,
model-specific preprocessing, and held-out queries.

## Verified references

- [Sentence Transformers: semantic textual similarity](https://www.sbert.net/docs/sentence_transformer/usage/semantic_textual_similarity.html)
- [Sentence-BERT paper](https://arxiv.org/abs/1908.10084)
