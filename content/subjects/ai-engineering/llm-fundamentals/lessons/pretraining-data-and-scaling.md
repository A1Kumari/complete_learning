---
id: lesson-ai-pretraining-data-scaling
kind: lesson
topicId: ai-llm-fundamentals
title: Pretraining Data, Generalization, and Scaling
summary: Follow the data and compute decisions that turn a text corpus into a pretrained model, including filtering, deduplication, and memorization risks.
difficulty: medium
status: published
revision: 1
order: 130
tags: [llm, pretraining, datasets, scaling]
conceptIds: [concept-self-supervised-learning]
prerequisiteIds: [lesson-ai-language-model-introduction]
---

## Why the corpus matters

Pretraining is not simply downloading a large collection of text and pressing run.
The corpus determines which languages, domains, styles, and mistakes the model can
learn. A company assistant trained mostly on public web pages will not automatically
understand private policy versions or current inventory.

## A simplified pipeline

```text
collect → license/filter → normalize → deduplicate → tokenize
       → mix and shard → train → validate → inspect memorization
```

Filtering can remove malware, spam, unsafe material, or low-quality boilerplate.
Deduplication prevents repeated pages from dominating the objective and makes held-out
evaluation more honest. Document boundaries, language labels, and source metadata
should survive long enough to diagnose failures.

## Generalization versus memorization

Training loss measures performance on examples used to update parameters. A separate
validation set tests whether useful patterns transfer. Near-duplicate documents can
make validation look good even when the model has effectively seen the answer.
Memorization can also expose personal data or copyrighted passages, so data handling is
an engineering and governance concern, not only a research concern.

## Compute and scaling

Training cost grows with parameter count, token count, sequence length, and hardware
time. Larger is not automatically better: a smaller model with cleaner data and a
shorter serving path may be the right product choice. Track tokens, throughput,
validation loss, energy or cloud cost, and checkpoint recovery rather than treating
parameter count as a quality metric.

## A useful deployment conclusion

Pretraining produces broad capability, not fresh company knowledge. Current evidence
usually belongs in retrieval or tools; behavior and format can be adapted with
post-training. Both still require evaluation against the population that will use the
system.

## Recall

Why can deduplication improve both training efficiency and evaluation validity? Give
one reason a low validation loss might still fail to predict a safe product.

Continue to [instruction tuning and alignment](instruction-tuning-alignment.md).
