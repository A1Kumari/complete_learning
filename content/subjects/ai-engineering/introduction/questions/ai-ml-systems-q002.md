---
id: ai-ml-systems-q002
kind: question
topicId: ai-ml-introduction
lessonId: lesson-how-ml-systems-work
prompt: "What happens during training versus inference?"
difficulty: easy
frequent: true
status: published
revision: 1
order: 50
tags: [machine-learning, training, inference]
conceptIds: [concept-ml-model, concept-ml-parameters]
followUps:
  - "Can a production system update parameters after serving a request?"
  - "What can go wrong if serving preprocessing differs from training preprocessing?"
misconception: "Inference normally does not update model parameters just because a model produced a prediction."
---

## Answer

Training uses examples and an objective to adjust learned parameters. Inference
normally loads the resulting parameters, transforms a new input in the expected way,
and computes a prediction without changing those parameters. A system can be
designed for online learning or periodic retraining, but that update is explicit and
must be controlled. Training and serving must also use compatible preprocessing,
feature mappings, and model versions.
