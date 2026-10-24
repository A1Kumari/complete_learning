---
id: ai-ml-systems-q001
kind: question
topicId: ai-ml-introduction
lessonId: lesson-how-ml-systems-work
prompt: "Define features, labels, predictions, parameters, and hyperparameters in a supervised ML system."
difficulty: medium
frequent: true
status: published
revision: 1
order: 40
tags: [machine-learning, features, parameters]
conceptIds: [concept-ml-model, concept-ml-parameters]
followUps:
  - "Why is an integer category ID not necessarily a useful numeric feature?"
  - "Give two examples of hyperparameters."
misconception: "A label is the target used during supervised training, not automatically an input feature."
---

## Answer

Features are the input representation consumed by the model. A label or target is
the desired answer attached to a training example. A prediction is the model's
output for an input. Parameters are values learned by the training procedure, such
as weights and biases. Hyperparameters configure the model or training procedure,
such as learning rate, tree depth, regularization strength, or batch size; they are
selected outside the ordinary parameter update.

### What a strong answer adds

Features may be transformed from raw fields, and a target can be delayed or noisy.
The target must not leak into the feature representation.
