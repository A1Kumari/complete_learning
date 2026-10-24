---
id: ai-llm-loss-and-perplexity
kind: question
topicId: ai-llm-fundamentals
lessonId: lesson-ai-language-model-pretraining
prompt: What do next-token cross-entropy and perplexity measure, and do they measure factual reliability?
difficulty: medium
status: published
revision: 1
order: 300
tags: [llm, evaluation]
followUps:
  - How do you aggregate negative log probabilities?
  - Why are perplexities from different tokenizers not directly comparable?
misconception: Predictive loss is not a guarantee of truthful or instruction-following answers.
---

## Answer

Cross-entropy averages negative log probabilities assigned to correct next tokens.
Perplexity is its exponential under natural-log loss. They evaluate predictive fit
under a particular dataset/tokenization and masking protocol, not independent truth.

### Supporting reasoning

For correct-token probabilities 0.5, 0.25, and 0.8, mean loss is about 0.7675 and
perplexity 2.1544. Data contamination and distribution mismatch can mislead comparisons.

### Evaluation rubric

One point each: negative-log objective; exponential relationship; comparable
evaluation conditions; distinction from downstream factual correctness.
