---
id: ai-embedding-contrastive-objective
kind: question
topicId: ai-embeddings
lessonId: lesson-ai-embedding-objectives
prompt: What does a contrastive embedding objective optimize, and what does its probability not mean?
difficulty: medium
status: published
revision: 1
order: 690
tags: [embeddings, contrastive-learning]
conceptIds: [concept-embedding-objectives]
followUps:
  - What happens when only the positive score increases?
  - Is its training temperature the same as a generative API's sampling temperature?
misconception: A candidate-relative contrastive probability is not a calibrated relevance or truth probability.
---

## Answer

A common objective increases the positive passage's score relative to selected
negatives for a query. Raising only the positive score lowers the one-positive
softmax loss. The result depends on candidate selection and training configuration.

### Supporting reasoning

Training temperature scales comparison logits and gradients; generation sampling
temperature controls output selection at inference. Neither independently establishes
truth, permission, or current policy applicability.

### Evaluation rubric

One point each: relative-positive objective; correct score/loss behavior;
candidate-dependent interpretation; training/inference temperature distinction.
