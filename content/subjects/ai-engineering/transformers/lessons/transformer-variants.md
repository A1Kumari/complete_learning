---
id: lesson-ai-transformer-variants
kind: lesson
topicId: ai-transformers
title: Encoder, Decoder, and Cross-Attention Variants
summary: Choose attention visibility and training objectives for representation learning or generation, and trace cross-attention with unequal source and target lengths.
difficulty: medium
status: published
revision: 1
order: 420
tags: [transformers, encoder-decoder, cross-attention]
conceptIds: [concept-transformer-variants, concept-encoder-decoder]
prerequisiteIds: [lesson-ai-transformer-blocks]
---

## Architecture determines what each position can see

“Transformer” names a family, not one objective or one input/output contract.
Different visibility patterns enable different tasks:

| Family | Self-attention visibility | Typical use and objective |
| --- | --- | --- |
| Encoder-only | All nonpadding input positions | Classification or representations; masked-token objectives are common |
| Decoder-only | Prefix through current position | Autoregressive next-token prediction and generation |
| Encoder–decoder | Bidirectional source encoder; causal target decoder | Conditional generation such as translation |

An encoder-only model can use words on both sides of a masked position, so its
ordinary hidden states are not a drop-in causal next-token predictor. A decoder-only
model can generate continuations conditioned on a prompt. An encoder–decoder
model has a separate source representation and a decoder that conditions on it.
Architecture and objective are related design choices; the family name alone does
not guarantee a high-quality sentence embedding or instruction-following behavior.

```text
source tokens → bidirectional encoder → source states ───────┐
                                                           ↓ K,V
shifted target tokens → causal self-attention → target Q → cross-attention → FFN
```

Text alternative: each target position first reads its allowed target prefix,
then queries the encoder's source states. Cross-attention mixes source values
using queries from the decoder, with one weight row per target position.

## Trace rectangular cross-attention

With source length `S=4`, target length `T=2`, and one head of width `dk=3`, Q has
shape `(2,3)`, K `(4,3)`, V `(4,dv)`. Scores have shape `(2,4)`, not `(2,2)`.
Unlike target self-attention, ordinary cross-attention can read the entire available
source sentence; source padding must still be excluded.

```python
import numpy as np

q = np.array([[1., 0., 0.], [0., 1., 0.]])
k = np.array([[1., 0., 0.], [0., 1., 0.], [1., 1., 0.], [9., 9., 9.]])
v = np.array([[1., 0.], [0., 1.], [1., 1.], [99., 99.]])
allowed = np.array([[True, True, True, False]] * 2)
scores = np.where(allowed, q @ k.T / np.sqrt(3), -np.inf)
exp = np.exp(scores - scores.max(axis=1, keepdims=True))
weights = exp / exp.sum(axis=1, keepdims=True)
output = weights @ v
assert weights.shape == (2, 4) and output.shape == (2, 2)
assert np.all(weights[:, 3] == 0)
np.testing.assert_allclose(weights.sum(axis=1), 1)
assert output.max() <= 1
print('cross-attention: 2 target queries x 4 source keys; padding excluded')
```

The huge padded source value does not enter the output. Applying a target-length
causal triangle to source keys would accidentally exclude useful source context and
would be conceptually wrong even if broadcasting happened to succeed.

## Keep training inputs and inference steps aligned

For target tokens `[BOS, hello, world]`, inputs `[BOS, hello]` can predict labels
`[hello, world]`. During teacher-forced training, all input positions are known and
processed in parallel, with causal masking to prevent future access. At inference,
the next target token is not known until selected; append it and repeat.

In source-to-target generation, do not expose the current target label in a
bidirectional decoder input. Low training loss with poor generation can come from
label leakage rather than useful learning. Check shifts, masks, padding loss
exclusion, and inference serialization together.

## Select by the actual task

For a support-ticket classifier, an encoder with a classification head is a useful
baseline. For open-ended continuation, a causal decoder is a natural fit. For
translation, a source encoder plus target decoder provides an explicit conditioning
path, although a suitably trained decoder-only model may also perform translation.
Measure quality, serving cost, available pretrained checkpoints, and data fit rather
than assuming there is exactly one architecture per task.

## Recall

Who supplies Q and who supplies K/V in cross-attention? How does its score shape
change when source length doubles? Why does using an encoder backbone not by itself
make pooled vectors useful for retrieval?

## References

- [Attention Is All You Need, encoder and decoder stacks](https://arxiv.org/html/1706.03762v7)
- [BERT: bidirectional pretraining and masked language modeling](https://arxiv.org/abs/1810.04805)
