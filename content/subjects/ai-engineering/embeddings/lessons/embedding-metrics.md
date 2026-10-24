---
id: lesson-ai-embedding-metrics
kind: lesson
topicId: ai-embeddings
title: Cosine, Dot Product, and Euclidean Ranking
summary: Compute vectorized rankings, prove normalized metric equivalence, and diagnose ranking changes caused by magnitude, invalid vectors, or score direction.
difficulty: medium
status: published
revision: 1
order: 350
tags: [embeddings, numpy, similarity, vector-metrics]
conceptIds: [concept-embedding-metrics, concept-text-similarity]
prerequisiteIds: [lesson-ai-embedding-objectives]
---

## Define score direction before ranking

For real vectors `q` and `d`, dot product is `sum_j q[j]*d[j]`. Cosine divides
by both vector lengths. Euclidean distance is the square root of the sum of squared
coordinate differences. Larger dot/cosine is typically better; smaller distance
is nearer. Some libraries expose negative distance as a similarity, reversing the
direction. Verify the API rather than sorting every number descending.

```text
query vector + document matrix
               ↓ finite/shape/zero checks
        raw or normalized representation
               ↓ metric + declared direction
             stable ranking
```

Normalization maps a nonzero vector `v` to `v/norm(v)`. It removes positive scale
but not task ambiguity. Zero vectors have no direction; dividing by zero or quietly
pretending they are useful embeddings hides a data/encoder problem. Reject or
handle them under a declared policy.

## Work through three different winners

Take query `[1,0]` and documents A `[2,0]`, B `[8,6]`, C `[0.8,0.2]`.

| Metric | A | B | C | Best |
| --- | --- | --- | --- | --- |
| Raw dot, larger wins | 2 | 8 | 0.8 | B |
| Cosine, larger wins | 1 | 0.8 | about 0.9701 | A |
| Squared L2, smaller wins | 1 | 85 | 0.08 | C |

The coordinate scale and lengths affect raw metrics. None of these invented
vectors demonstrates that a particular text is genuinely relevant. The example
shows why changing a distance setting can change results without changing any data.

## Implement vectorized comparisons

```python
import numpy as np

def unit_rows(matrix):
    matrix = np.asarray(matrix, dtype=float)
    if matrix.ndim != 2 or matrix.shape[1] == 0 or not np.isfinite(matrix).all():
        raise ValueError('finite nonempty-width matrix required')
    norms = np.linalg.norm(matrix, axis=1, keepdims=True)
    if np.any(norms == 0):
        raise ValueError('zero vector')
    return matrix / norms

q = np.array([1., 0.])
docs = np.array([[2., 0.], [8., 6.], [.8, .2]])
q_unit = unit_rows(q[None, :])[0]
docs_unit = unit_rows(docs)
dot = docs @ q
cosine = docs_unit @ q_unit
l2_squared = ((docs - q) ** 2).sum(axis=1)
assert int(dot.argmax()) == 1
assert int(cosine.argmax()) == 0
assert int(l2_squared.argmin()) == 2
np.testing.assert_allclose(((docs_unit - q_unit) ** 2).sum(axis=1), 2 - 2*cosine)
for invalid in [[[0., 0.]], [[float('nan'), 1.]]]:
    try:
        unit_rows(invalid)
    except ValueError:
        pass
    else:
        raise AssertionError('invalid vector accepted')
print('raw dot: B; cosine: A; raw L2: C; unit-vector equivalence checked')
```

The calculations run on float64 NumPy arrays. Real encoders may emit lower precision
and tiny rounding deviations. Inspect norm ranges and nonfinite outputs; set a
near-zero-vector policy suitable for your data instead of adding an arbitrary
epsilon that silently changes the intended geometry.

## Prove the normalized relationship

For unit `q` and `d`:

```text
||q-d||² = q·q + d·d - 2(q·d)
         = 2 - 2*cosine(q,d)
```

Thus cosine descending, normalized dot descending, and normalized L2 ascending
have identical exact rankings, aside from ties and finite-precision differences.
That equivalence does not apply to raw vectors with varying norms. Normalize both
sides consistently and use a metric appropriate to the encoder's trained/released
configuration; magnitude may be meaningful for some models.

## Scores are not calibrated probabilities

A cosine of 0.85 is not “85% likely relevant.” Different models, objectives, and
domains can produce different score distributions. Validate thresholds with
reviewed relevant/nonrelevant examples. A model upgrade can preserve rankings yet
move score distributions, breaking an old cutoff. Temperature inside training
can influence geometry without giving a universal score interpretation.

For a shortlist used by a later reranker, high recall may matter more than a
similarity cutoff. For duplicate detection, false merges may be costly, so tune
with that asymmetric error cost. Similarity alone cannot establish factual support,
currentness, or access permission.

## Recall

Predict all three winners before running the code. Derive the unit-vector identity
without looking at it. Why can negative-distance APIs be confusing? Explain one
failure caused by changing normalization on only query vectors or only documents.

## Verified references

- [Sentence Transformers: cosine, dot, and distance conventions](https://www.sbert.net/docs/sentence_transformer/usage/semantic_textual_similarity.html)
- [NumPy linear algebra norm](https://numpy.org/doc/stable/reference/generated/numpy.linalg.norm.html)
