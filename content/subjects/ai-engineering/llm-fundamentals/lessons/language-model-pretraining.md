---
id: lesson-ai-language-model-pretraining
kind: lesson
topicId: ai-llm-fundamentals
title: How Language Models Are Trained
summary: Build shifted next-token targets, calculate language-model loss, and distinguish learned generalization from memorization and factual verification.
difficulty: medium
status: published
revision: 1
order: 120
tags: [llm, pretraining, self-supervised-learning, python]
conceptIds: [concept-language-modeling, concept-self-supervised-learning]
prerequisiteIds: [lesson-ai-text-tokenization, lesson-ai-token-representations]
---

## A predictive objective from raw text

A causal language model assigns probabilities to the next token given a prefix.
For tokens `t1...tN`, a sequence probability factors into conditional predictions:

```text
P(t1,...,tN) = product_i P(t_i | tokens before i)
training loss = mean_i(-log P(correct token_i | prefix_i))
```

The target comes from the text itself, so the setup is **self-supervised**. It does
not require a person to label every next token. People still make consequential
choices about data collection, filtering, licensing, deduplication, and mixture
weights. “No manual next-token labels” does not mean “no human design.”

A decoder-only Transformer is a common architecture, but language modeling is an
objective rather than a synonym for that architecture. You need token IDs,
probability, and the idea of minimizing a loss. Detailed attention derivation is
not required to trace these training examples.

## Shift the labels without leaking the answer

Take `[BOS, cats, nap, EOS]`. The input prefixes predict `cats`, `nap`, and `EOS`.
During training, all correct tokens are available, but the causal mask prevents
a position from reading future tokens. Thus many next-token losses can be computed
in one forward pass. Do not apply the shift twice when using a framework whose
model loss already shifts labels internally.

```text
tokens:       BOS   cats   nap   EOS
input slots:  BOS   cats   nap
targets:      cats  nap    EOS
                  ↓ loss → gradients → parameter update
```

Padding positions should normally be excluded from the loss. Packed documents
need an explicit boundary policy; concatenation does not automatically make every
cross-document transition desirable. Deduplicate before splitting so copied text
does not inflate validation results.

## Calculate a tiny loss

Suppose the model assigns the correct next tokens probabilities `[0.5,0.25,0.8]`.
Their negative natural log losses are approximately `[0.6931,1.3863,0.2231]`.
The average is `0.7675`; perplexity is `exp(average) ≈ 2.1544`.

```python
import math

tokens = ['BOS', 'cats', 'nap', 'EOS']
pairs = list(zip(tokens[:-1], tokens[1:]))
assert pairs == [('BOS', 'cats'), ('cats', 'nap'), ('nap', 'EOS')]
correct_probs = [0.5, 0.25, 0.8]
loss = -sum(math.log(p) for p in correct_probs) / len(correct_probs)
perplexity = math.exp(loss)
assert math.isclose(perplexity, (1 / (0.5 * 0.25 * 0.8)) ** (1/3))
print(round(loss, 4), round(perplexity, 4))
```

This executes target alignment and loss arithmetic, not neural-network training.
Perplexity comparisons require compatible tokenization, dataset, masking, and
aggregation. A lower number on one corpus does not prove better factual answers,
tool use, or task performance on another population.

## What changes during pretraining?

Forward computation produces logits and probabilities. Backpropagation calculates
gradients of the objective; an optimizer updates parameters, including token
embeddings and network weights. Batches, learning rate, model architecture, and
regularization govern this process. Compute and data constraints influence which
patterns are learned, and duplicated or sensitive material can be memorized.

The objective rewards predictive regularities, which can support language,
reasoning, code, and factual associations. It does not implement a database lookup
with provenance or prove each learned association true. Fluent training text can
also be wrong, outdated, biased, or contradictory.

## Generalization and deployment consequences

Holding out examples helps distinguish memorization from generalization, but
contamination can survive through paraphrases and duplicates. Evaluate genuinely
unseen tasks and distributions, not just training-set continuations. Updating the
context at inference normally changes activations, not pretrained weights. External
retrieval can provide current evidence without retraining, although its integration
and answer quality still need checks.

## Recall

Build the three input-target pairs before looking back. Why does the next token
count as a label despite no manual annotation? Why does causal masking matter even
when the complete sequence is in memory? Why is low perplexity not equivalent to
truthfulness? A good answer mentions target provenance, information boundaries,
and the mismatch between predictive loss and application correctness.

## Verified references

- [Hugging Face: causal language-model training](https://huggingface.co/learn/llm-course/chapter7/6)
- [Vaswani et al., decoder masking](https://arxiv.org/html/1706.03762v7)

Continue to [instruction tuning and alignment](instruction-tuning-alignment.md).
