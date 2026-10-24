---
id: lesson-ai-llm-inference
kind: lesson
topicId: ai-llm-fundamentals
title: LLM Inference, Sampling, and Context Budgets
summary: Calculate softmax, temperature, and nucleus filtering, then trace autoregressive decoding, caching, and stopping conditions.
difficulty: medium
status: published
revision: 1
order: 150
tags: [llm, inference, sampling, python]
conceptIds: [concept-llm-inference]
prerequisiteIds: [lesson-ai-language-model-pretraining]
---

## From prefix to one more token

At a decoding step, the model computes one logit per vocabulary entry. Softmax maps
those scores to a distribution. A selection rule picks the next token, which is
appended to the prefix for the next step. Learned parameters normally remain fixed.

```text
prefix → model logits → sampling/filtering → next token
   ↑                                           |
   +------------- append unless stopped -------+
```

Logits are unnormalized scores, not probabilities. For temperature `T > 0`:
`P(i)=exp(z_i/T)/sum_j exp(z_j/T)`. Subtracting the largest scaled logit before
exponentiation preserves the probabilities and avoids avoidable overflow.

## Work through the distribution

For logits `[2,1,0]`, softmax at `T=1` is approximately `[0.6652,0.2447,0.0900]`.
At `T=0.5` it is sharper: `[0.8668,0.1173,0.0159]`. Lower temperature concentrates
mass on already high-scoring tokens. It does not independently verify facts. A wrong
token can be the highest-scoring option.

Top-k keeps the k largest-probability entries. Top-p (nucleus sampling) sorts by
probability and retains the smallest prefix reaching cumulative mass `p`, then
renormalizes. At `p=0.8`, the `T=1` example keeps the first two tokens, because
0.6652 alone is too small and adding 0.2447 exceeds 0.8. The threshold-crossing
token must not accidentally be dropped.

```python
import math

def softmax(logits, temperature=1.):
    if temperature <= 0 or not logits:
        raise ValueError('positive temperature and nonempty logits required')
    scaled = [z / temperature for z in logits]
    peak = max(scaled)
    weights = [math.exp(z - peak) for z in scaled]
    return [w / sum(weights) for w in weights]

def nucleus(probs, threshold):
    if not 0 < threshold <= 1:
        raise ValueError('invalid threshold')
    kept, mass = [], 0.
    for i in sorted(range(len(probs)), key=lambda i: (-probs[i], i)):
        kept.append(i)
        mass += probs[i]
        if mass >= threshold:
            break
    return [(i, probs[i] / mass) for i in kept]

p = softmax([2., 1., 0.])
assert math.isclose(sum(p), 1.)
assert [i for i, _ in nucleus(p, 0.8)] == [0, 1]
assert softmax([2., 1., 0.], 0.5)[0] > p[0]
print([round(x, 4) for x in p])
print([(i, round(x, 4)) for i, x in nucleus(p, 0.8)])
```

The nucleus probabilities become approximately `[0.7311,0.2689]`. This deterministic
example computes candidates rather than randomly sampling. Real implementations
can apply filters in different orders, impose minimum candidates, or restrict
parameters by model. A provider's “temperature zero” commonly means greedy or
limiting behavior, not division by zero in this formula. Greedy selection does not
guarantee bit-for-bit reproducibility across changing infrastructure or models.

## Prefill, decode, and caches

Prefill processes the available prompt. Autoregressive decode repeatedly extends
it. A Transformer KV cache reuses past key/value states instead of recomputing the
entire prefix each step. With standard full-history attention the cache grows with
retained context, and each new token still attends over permitted past positions.
Caching avoids work; it does not update weights or create permanent conversational
memory.

The context window bounds model-visible tokens, not guaranteed useful recall.
Account for instructions, examples, conversation, retrieved text, tools, and reserved
generation space. If a hypothetical 8,192-token limit receives 6,500 input tokens,
reserving 1,500 generated tokens leaves only 192 tokens of headroom. Some APIs
budget internal reasoning tokens within output limits; inspect the chosen model.

## Stopping and failure interpretation

Generation can stop at an end token, a configured stop condition, an output limit,
a refusal, cancellation, or failure. An incomplete JSON prefix is not a completed
object. Inspect the API's terminal status rather than interpreting a closed network
connection as successful completion. Tool calls are structured output events, not
ordinary prose that should be executed directly.

## Recall

Calculate the cumulative mass for `p=0.8` and explain the crossing-token rule. Why
can greedy decoding be confidently wrong? What changes in a cache versus in model
parameters? A strong answer separates probability transformation, selection,
runtime reuse, and correctness evidence.

## Verified references

- [Hugging Face generation strategies](https://huggingface.co/docs/transformers/generation_strategies)
- [OpenAI text generation and model-specific options](https://developers.openai.com/api/docs/guides/text)
