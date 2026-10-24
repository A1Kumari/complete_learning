---
id: ai-ml-systems-q003
kind: question
topicId: ai-ml-introduction
lessonId: lesson-how-ml-systems-work
prompt: "Walk through one parameter update in a simple linear model."
difficulty: hard
frequent: true
status: published
revision: 1
order: 60
tags: [machine-learning, training, optimization]
conceptIds: [concept-ml-model, concept-ml-parameters]
followUps:
  - "What role does the learning rate play?"
  - "What is the difference between a loss and a parameter?"
misconception: "The model does not update by guessing a new answer; an objective supplies a numerical signal used to calculate an update."
---

## Answer

For `y_hat = w*x + b`, evaluate predictions on training examples, compute a loss,
calculate the loss gradient with respect to `w` and `b`, then update each parameter
in the opposite gradient direction:

```text
w <- w - learning_rate * dL/dw
b <- b - learning_rate * dL/db
```

For mean squared error, `dL/dw` aggregates prediction error multiplied by the
corresponding feature and `dL/db` aggregates prediction error. Repeat the process
until the objective stops improving or another stopping criterion is met. The exact
update depends on the loss, batch, optimizer, and learning rate.
