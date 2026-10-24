---
id: ai-llm-next-token-targets
kind: question
topicId: ai-llm-fundamentals
lessonId: lesson-ai-language-model-pretraining
prompt: How are next-token training targets constructed, and why is this self-supervised?
difficulty: medium
status: published
revision: 1
order: 290
tags: [llm, pretraining]
followUps:
  - Build targets for [BOS,cats,nap,EOS].
  - Why is causal masking required when all tokens are available during training?
misconception: The whole sequence being available does not permit a prediction position to read its future target.
---

## Answer

Each prefix predicts the following token, using the text itself as supervision.
For the sequence given, BOS predicts cats, BOS/cats predicts nap, and BOS/cats/nap
predicts EOS. A causal mask prevents reading future targets.

### Supporting reasoning

Many positions can be processed together during training with known prefixes.
Check framework loss alignment to avoid shifting labels twice; mask padding loss.

### Evaluation rubric

One point each: target provenance; correct shifted pairs; causal information
boundary; training parallelism or padding/alignment qualification.
