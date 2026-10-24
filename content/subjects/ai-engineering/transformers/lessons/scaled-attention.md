---
id: lesson-ai-scaled-attention
kind: lesson
topicId: ai-transformers
title: Queries, Keys, Values, and Causal Attention
summary: Compute three-token attention, explain scaling and row-wise softmax, and detect future-token leakage with a causal-mask test.
difficulty: medium
status: published
revision: 1
order: 400
tags: [transformers, attention, masking, numpy]
conceptIds: [concept-scaled-attention]
prerequisiteIds: [lesson-ai-token-representations]
---

## Let each token select context

A recurrent model carries a state through a sequence. Attention instead lets a
token compute a weighted mixture of accessible token representations. In “the animal
did not cross because it was tired,” interpreting “it” benefits from other positions.
Learned attention can route information between positions; it is not a hard-coded
pronoun resolver, and its weights alone are not a faithful explanation of a prediction.

Starting with hidden states `X` of shape `(T, D)`, learned matrices make three views:
`Q = X @ Wq`, `K = X @ Wk`, `V = X @ Wv`. Queries express what a position seeks,
keys provide matching features, and values provide the information to mix. The
matrices are learned parameters; Q/K/V are input-dependent activations.

```text
token states X → Q, K, V projections
Q @ K.T → divide by sqrt(dk) → add mask → row softmax → multiply by V
                 (T,T) weights                           (T,dv) output
```

For query row `i` and key row `j`, the logit is `dot(Q[i], K[j])/sqrt(dk)`.
Softmax runs over the **keys in each query row**. Outputs are weighted sums of V,
not of token IDs. Query/key feature widths must match; value width may differ.

## Why divide by the square root of the key width?

If query/key coordinates are approximately independent, zero mean, and unit variance,
the sum of `dk` products has variance about `dk`. Dividing by `sqrt(dk)` keeps logit
scale more stable as width grows. Excessively large logits make softmax sharply
concentrated and can make gradients small. This is a motivating approximation,
not a guarantee that actual learned coordinates satisfy those assumptions.

## Trace three tokens and expose leakage

For clarity, use identity projections and only one head. These invented vectors
teach mechanics; they are not embeddings from a trained model.

```python
import numpy as np

def attention(q, k, v, allowed):
    scores = q @ k.T / np.sqrt(q.shape[-1])
    if allowed.shape != scores.shape or not allowed.any(axis=1).all():
        raise ValueError('each query needs at least one allowed key')
    scores = np.where(allowed, scores, -np.inf)
    exp = np.exp(scores - scores.max(axis=1, keepdims=True))
    weights = exp / exp.sum(axis=1, keepdims=True)
    return weights @ v, weights

x = np.array([[1., 0.], [0., 1.], [1., 1.]])
causal = np.tri(3, dtype=bool)
y, weights = attention(x, x, x, causal)
np.testing.assert_allclose(weights.sum(axis=1), 1)
assert np.all(weights[np.triu_indices(3, 1)] == 0)
np.testing.assert_allclose(y[0], x[0])
np.testing.assert_allclose(weights[1], [.33023845, .66976155, 0], atol=1e-7)
changed = x.copy()
changed[2] = [20., -20.]
y_changed, _ = attention(changed, changed, changed, causal)
np.testing.assert_allclose(y_changed[:2], y[:2])
unmasked, _ = attention(x, x, x, np.ones((3, 3), dtype=bool))
assert not np.allclose(unmasked[0], y[0])
print('rows sum to 1; future weights zero; earlier outputs unchanged')
```

Row zero can read only itself, so its output is `[1,0]`. Row one mixes the first
two values, giving approximately `[0.3302,0.6698]`. Row two can read all three.
Changing the future must leave earlier outputs unchanged in causal self-attention.
That behavioral check catches a transposed triangular mask more reliably than a
shape check.

## Combine causal and padding masks correctly

A causal mask disallows keys at future positions; a padding mask disallows padding
keys. Combine eligibility before softmax. **Replacing forbidden logits with zero
does not remove them**: `exp(0)` is positive. In this example forbidden logits are
negative infinity, producing zero probability. An entirely masked row has no valid
distribution; real kernels need an explicit convention for such rows, and padding
query outputs must be excluded from downstream loss or pooling.

Boolean mask meaning differs between APIs: true may mean allowed or blocked. Check
the operation's contract. During training, shifted next-token labels plus causal
masking permit parallel computation across known input positions without exposing
future labels. The mask alone does not implement the loss or the shift.

## Recall and application

Write the dimensions of `Q @ K.T` and `weights @ V`. Explain why softmax down the
query axis is wrong. Add a padding key to the example and prove it receives zero
weight. If a decoder's training loss is suspiciously low, test future perturbations
and label alignment before attributing the result to model quality.

## References

- [Attention Is All You Need, sections 3.2 and 3.5](https://arxiv.org/html/1706.03762v7)
- [PyTorch scaled dot-product attention and mask contract](https://docs.pytorch.org/docs/stable/generated/torch.nn.functional.scaled_dot_product_attention.html)
