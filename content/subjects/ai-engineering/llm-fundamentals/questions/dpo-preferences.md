---
id: ai-llm-dpo-preference-proxy
kind: question
topicId: ai-llm-fundamentals
lessonId: lesson-ai-instruction-tuning-alignment
prompt: What does DPO simplify, and why can preference optimization still produce wrong answers?
difficulty: medium
status: published
revision: 1
order: 320
tags: [llm, dpo, alignment]
followUps:
  - Why compare chosen and rejected responses relative to a reference?
  - What happens if annotators prefer confident verbosity over correctness?
misconception: Preference optimization aligns to a data-dependent proxy rather than a universal truth oracle.
---

## Answer

DPO uses chosen/rejected pairs with a reference-relative preference objective,
avoiding a separate reward-model-plus-online-RL loop in the common RLHF recipe.
It still depends on preference quality, task coverage, and held-out evaluation.

### Supporting reasoning

Biased judgments can reward style instead of correctness. A falling preference loss
means the training comparison is better satisfied, not that every answer is factual.

### Evaluation rubric

One point each: preference pairs; reference-relative objective; accurate description
of the simplified loop; a concrete proxy failure and evaluation need.
