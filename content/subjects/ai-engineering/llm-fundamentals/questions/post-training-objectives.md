---
id: ai-llm-post-training-objectives
kind: question
topicId: ai-llm-fundamentals
lessonId: lesson-ai-instruction-tuning-alignment
prompt: Compare pretraining, supervised fine-tuning, and reward-model RLHF.
difficulty: medium
status: published
revision: 1
order: 310
tags: [llm, alignment, fine-tuning]
followUps:
  - What datasets does each stage require?
  - Does an instruction example inside a prompt update the weights?
misconception: Shared use of token probabilities does not make every training stage the same objective.
---

## Answer

Pretraining commonly predicts tokens in broad corpora. SFT increases likelihood of
curated desired responses. A common RLHF recipe learns a reward model from comparative
judgments, then optimizes a policy against that proxy with a reference constraint.

### Supporting reasoning

Stages can be combined or repeated. Comparative preference data differs from raw
text and demonstrations. Ordinary in-context examples affect inference context,
not the model's learned parameters.

### Evaluation rubric

One point each: pretraining objective; SFT demonstrations; reward/policy separation;
data provenance or inference/training distinction.
