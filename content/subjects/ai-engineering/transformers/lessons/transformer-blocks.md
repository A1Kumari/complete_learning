---
id: lesson-ai-transformer-blocks
kind: lesson
topicId: ai-transformers
title: Multi-Head Attention, Positions, and Transformer Blocks
summary: Trace head splitting and recombination, distinguish attention from position-wise feed-forward computation, and explain residual and normalization paths.
difficulty: medium
status: published
revision: 1
order: 410
tags: [transformers, multi-head-attention, positions, normalization]
conceptIds: [concept-transformer-block]
prerequisiteIds: [lesson-ai-scaled-attention]
---

## Different heads can learn different routing patterns

One weighted mixture may be limiting. Multi-head attention applies different learned
Q/K/V projections so multiple routing patterns can operate in parallel. Heads are
not assigned fixed roles such as “grammar head” or “facts head”; such behavior, if
observed, is an empirical property of particular models and inputs.

For batch `B`, length `T`, hidden width `D`, and `H` equal-width heads, a common
configuration uses `dh = D/H`:

```text
X (B,T,D)
  → projected Q/K/V (B,T,D)
  → split and transpose (B,H,T,dh)
  → attention weights (B,H,T,T)
  → head outputs (B,H,T,dh)
  → transpose + concatenate (B,T,D) → output projection (B,T,D)
```

Splitting tensor dimensions does not itself learn heads: distinct projection
parameters do. Concatenation preserves separate channels, and the output projection
mixes them. Averaging heads prematurely changes the architecture.

## Verify head layout before implementing a whole model

```python
import numpy as np

projected = np.arange(24).reshape(1, 3, 8)
b, t, d = projected.shape
h = 2
heads = projected.reshape(b, t, h, d // h).transpose(0, 2, 1, 3)
assert heads.shape == (1, 2, 3, 4)
np.testing.assert_array_equal(heads[0, 1, 0], [4, 5, 6, 7])
merged = heads.transpose(0, 2, 1, 3).reshape(b, t, d)
np.testing.assert_array_equal(merged, projected)
# Reshaping without undoing the transpose silently mixes token/head channels.
assert not np.array_equal(heads.reshape(b, t, d), projected)
print('2 heads of width 4; transpose and merge preserve token channels')
```

This is a layout check on already projected activations, not a trained attention
layer. A plausible output shape is insufficient: the wrong reshape can return
`(B,T,D)` while mixing data from different tokens.

## Supply position information

Unmasked self-attention without positions is permutation equivariant: reorder input
rows and outputs reorder correspondingly. It cannot infer arbitrary word order from
token content alone. The original Transformer adds sinusoidal positional vectors to
input embeddings. Learned absolute embeddings instead learn one vector per position.
Rotary position embeddings rotate query/key coordinate pairs using position-dependent
angles so their dot products encode relative-position structure.

A causal mask adds an ordering constraint but does not replace all positional
modeling. Position mechanisms and masking solve different problems. Longer supported
indices do not guarantee reliable length extrapolation; evaluate actual tasks at
the intended context lengths. With cached decoding, position indices must continue
from the prefix rather than restart at zero.

## Add token-wise transformation and stable paths

A common **pre-normalization** block, omitting dropout, is:

```text
U = X + MultiHeadAttention(LayerNorm(X))
Y = U + FeedForward(LayerNorm(U))
FeedForward(z) = activation(z @ W1 + b1) @ W2 + b2
```

Here `W1` maps `D → Dff` and `W2` maps `Dff → D`; biases match the output widths.
The same feed-forward parameters apply independently at each token position.
Attention mixes positions; the FFN performs nonlinear feature transformations.
Residual addition requires matching shapes and gives an additive identity path for
signals and gradients. LayerNorm typically normalizes features within a token,
then applies learned scale/shift; it does not average the sequence into one vector.

The original paper used post-normalization, `Norm(X + Sublayer(X))`. Modern models
may use pre-norm, RMSNorm, gated FFNs, or other choices. These formulas describe
specific variants, not a universal layout. Normalization supports optimization but
does not ensure that any arbitrary deep network will train successfully.

## Recall and application

Trace a block with `B=2,T=5,D=12,H=3,Dff=48`, including attention-weight and FFN
shapes. Diagnose a layer whose loss changes after a split/merge round trip. Explain
why removing attention leaves no content-dependent cross-token communication in
the FFN and residual operations described above.

## References

- [Attention Is All You Need, sections 3.1–3.5](https://arxiv.org/html/1706.03762v7)
- [RoFormer: Rotary Position Embedding](https://arxiv.org/abs/2104.09864)
