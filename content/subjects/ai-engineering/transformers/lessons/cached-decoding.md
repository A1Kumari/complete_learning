---
id: lesson-ai-cached-decoding
kind: lesson
topicId: ai-transformers
title: Prefill, Decoding, and the KV Cache
summary: Verify cached attention against full causal attention, estimate cache memory, and distinguish quadratic prompt work from per-token decoding costs.
difficulty: hard
status: published
revision: 1
order: 430
tags: [transformers, inference, kv-cache, performance]
conceptIds: [concept-kv-cache]
prerequisiteIds: [lesson-ai-transformer-variants]
---

## Reuse the prefix instead of recomputing it

**Prefill** processes the prompt's known tokens and stores each layer's keys and
values. The last prompt position produces logits for the first generated token.
**Decode** then processes newly selected tokens using cached prefix K/V. In a
causal model, future tokens do not change already computed prefix states, making
this reuse valid with fixed model parameters, positions, and visibility rules.

```text
prompt → prefill → per-layer K/V cache → first next-token logits
chosen token → new Q/K/V → append K/V → attend across cached prefix + new token
                                     → logits → choose next token → repeat
```

Queries from old positions are not needed for the new position's output. The cache
is not an embedding database or persistent factual memory; it is transient
per-layer inference state for a specific processed prefix.

## Prove a single-head cached step matches the full pass

```python
import numpy as np

def attend(q, k, v, allowed):
    logits = np.where(allowed, q @ k.T / np.sqrt(q.shape[-1]), -np.inf)
    p = np.exp(logits - logits.max(axis=1, keepdims=True))
    return (p / p.sum(axis=1, keepdims=True)) @ v

x = np.array([[1., 0.], [0., 1.], [1., 1.], [2., 1.]])
full = attend(x, x, x, np.tri(4, dtype=bool))
cached_k, cached_v = x[:3].copy(), x[:3].copy()
cached_k = np.concatenate([cached_k, x[3:]], axis=0)
cached_v = np.concatenate([cached_v, x[3:]], axis=0)
step = attend(x[3:], cached_k, cached_v, np.ones((1, 4), dtype=bool))
assert step.shape == (1, 2)
np.testing.assert_allclose(step[0], full[3])
# A triangle created for only one query would allow key 0, not the whole prefix.
wrong = attend(x[3:], cached_k, cached_v, np.tri(1, 4, dtype=bool))
assert not np.allclose(wrong, step)
print('cached token matches full pass; offset-free triangle fails')
```

This proves the attention operation for fixed projected vectors, not a full
multi-layer language model. In a model, each layer separately caches its own
projected K/V. A chunk with multiple new queries needs a causal mask offset by the
past length: new query row `i` may read key columns through `past_length + i`.

## Trace dimensions and memory

One common cache layout per layer is `(B,Hkv,T,dh)` for each of K and V. Storage
layouts vary; grouped-query attention can have fewer KV heads than query heads.
For `L` layers and `s` bytes per element, ordinary uncompressed full-prefix storage is:

```text
cache bytes = 2 * L * B * Hkv * T * dh * s
```

The factor two counts keys and values. With `L=24,B=1,Hkv=8,T=4096,dh=64,s=2`,
the cache takes 201,326,592 bytes, or 192 MiB, before allocator and metadata overhead.
Doubling batch size or cached length doubles this estimate. Model weights,
activations, and temporary workspaces require additional memory.

## Separate arithmetic, memory, and wall-clock latency

Dense prefill attention computes interactions among `T` positions: roughly
`O(T² * dh)` arithmetic per head. A naive implementation materializes `(T,T)`
weights. Memory-efficient attention kernels can avoid storing that whole matrix
without eliminating all quadratic pairwise arithmetic for full attention.

One cached decode query attends to `T` keys, roughly `O(T * dh)` attention work,
while the stored cache grows linearly in `T`. Projection and FFN work, memory
bandwidth, batching, hardware, and kernel efficiency also affect latency. Caching
does not make ordinary autoregressive generation parallel across unknown tokens,
and does not make per-token cost independent of context length.

## Debug a cache mismatch

Compare full versus cached logits on short fixed inputs, with dropout disabled and
appropriate numerical tolerances. Check sequence-axis concatenation, layer/head
layout, prefix position offsets, padding, and total key length. Reusing a cache
after changing the prefix, model, or relevant mask invalidates that comparison.
Sliding-window caches intentionally retain only part of the history, so use their
declared visibility semantics instead of this full-prefix assumption.

## Recall

Why store K/V but not old Q? What mask should a two-token chunk use after a
three-token prefix? Explain a memory failure caused by many concurrent long prompts
even if model weights fit comfortably on the device.

## References

- [Hugging Face Transformers: how caching works](https://huggingface.co/docs/transformers/cache_explanation)
- [FlashAttention: IO-aware exact attention](https://arxiv.org/abs/2205.14135)
