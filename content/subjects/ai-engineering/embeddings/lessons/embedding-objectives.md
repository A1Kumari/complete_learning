---
id: lesson-ai-embedding-objectives
kind: lesson
topicId: ai-embeddings
title: Embedding Objectives and Semantic Geometry
summary: Trace how contrastive objectives shape whole-text embeddings, explain positive and negative pairs, and distinguish retrieval features from generative-model token states.
difficulty: medium
status: published
revision: 1
order: 340
tags: [embeddings, contrastive-learning, numpy]
conceptIds: [concept-embedding-objectives, concept-text-similarity]
prerequisiteIds: [lesson-ai-sentence-embeddings, lesson-ai-instruction-tuning-alignment]
---

## A vector's purpose comes from training and use

The introductory [sentence-embedding lesson](../../tokenization/lessons/sentence-embeddings.md)
covered pooling and cosine. Here the focus is choosing and operating whole-text
representations. A token-table row is one learned vocabulary vector; a contextual
hidden state represents one occurrence under permitted context. A retrieval
embedding represents a text span under a model and pooling/objective designed for
comparison. They can share dimensions without being interchangeable.

```text
query / positive passage / negative passages
                       ↓ text encoder + prescribed pooling
                vectors and similarity scores
                       ↓ contrastive objective
                  parameter updates
```

In a bi-encoder, queries and documents are encoded independently, enabling document
vectors to be precomputed. The encoders may share weights, use different prefixes,
or be separate networks. A cross-encoder jointly processes a query/document pair;
its pair score is not normally a reusable independent document vector.

## Contrastive learning as a comparison task

Given a query, a positive passage, and negatives, a common loss increases the
positive score relative to negatives. A simplified one-positive objective is:

```text
L = -log(exp(score_positive / tau)
         / sum_candidates exp(score_candidate / tau))
```

`tau` is a positive training temperature. Smaller values sharpen the relative
comparison and can alter gradients. This is not the same purpose as a generative
API's sampling temperature. The loss is relative to the chosen candidates, not a
calibrated probability that the passage is true or relevant in every corpus.

## Calculate an example loss

Use supplied scores `[2,1,0]`, where the first is the positive, and temperature
0.5. Scaled scores become `[4,2,0]`; the positive softmax probability is about
0.8668 and loss is about 0.1429. The scores are synthetic, not actual semantic
outputs from a commercial model.

```python
import numpy as np

def contrastive_loss(scores, positive_index, temperature):
    scores = np.asarray(scores, dtype=float)
    if (scores.ndim != 1 or scores.size == 0 or not np.isfinite(scores).all()
            or not np.isfinite(temperature) or temperature <= 0):
        raise ValueError('finite scores and positive temperature required')
    if not 0 <= positive_index < scores.size:
        raise ValueError('invalid positive index')
    scaled = scores / temperature
    peak = scaled.max()
    log_normalizer = peak + np.log(np.exp(scaled - peak).sum())
    return float(log_normalizer - scaled[positive_index])

loss = contrastive_loss([2., 1., 0.], 0, .5)
improved = contrastive_loss([3., 1., 0.], 0, .5)
assert 0.142 < loss < 0.144 and improved < loss
assert np.isclose(loss, contrastive_loss([102., 101., 100.], 0, .5))
print(round(loss, 4), round(improved, 4))
```

The code calculates the objective without training a neural model. Adding the same
constant to every score leaves the loss unchanged; raising the positive relative
to the fixed negatives lowers it. Production training adds batching, optimization,
and careful data handling beyond this numerical mechanism.

## Positives, hard negatives, and false negatives

Useful positives can be question/answer pairs, paraphrases, or translations under
the desired task. A hard negative is a confusing nonrelevant example, such as a
different product's warranty policy with similar wording. But a second valid
answer accidentally labeled negative is a **false negative**. Penalizing it can
teach harmful distinctions. In-batch negatives are efficient but can contain
multiple genuinely relevant passages; use an appropriate data/objective policy.

Duplicated templates, short identifiers, contradictory policies, or domain shift
can expose failures hidden by general semantic benchmarks. Evaluate the intended
relationship: paraphrase similarity, query relevance, duplicate detection, and
entailment are not identical tasks. “Refund allowed” and “refund prohibited” can
be topically similar and operationally opposite.

## Practical application and recall

For support search, prefer an encoder evaluated on query-to-passage relevance
over blindly averaging generation-model table rows. Keep prefixes, pooling,
normalization, tokenizer, and model revision consistent. A high similarity is a
retrieval candidate signal, not authority or an answer acceptance certificate.

Explain why the loss decreases when only the positive score rises. Give one false
negative and one useful hard negative for warranty search. Why does optimizing
this objective not directly teach permission checks or current policy truth?

## Verified references

- [Sentence-BERT](https://arxiv.org/abs/1908.10084): independently comparable sentence representations.
- [Multilingual E5 model card](https://huggingface.co/intfloat/multilingual-e5-base): contrastive/preference-of-input conventions, pooling, and limits.
- [Sentence Transformers: similarity metrics](https://www.sbert.net/docs/sentence_transformer/usage/semantic_textual_similarity.html)
