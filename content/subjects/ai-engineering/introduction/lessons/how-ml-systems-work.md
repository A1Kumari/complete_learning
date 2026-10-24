---
id: lesson-how-ml-systems-work
kind: lesson
topicId: ai-ml-introduction
title: How Machine Learning Systems Work
summary: Trace data, features, labels, parameters, objectives, training, and inference through a concrete prediction problem.
difficulty: medium
status: published
revision: 1
order: 20
tags: [machine-learning, training, inference, features]
conceptIds: [concept-ml-model, concept-ml-parameters, concept-ml-problem-formulation]
prerequisiteIds: [lesson-ai-and-ml-foundations]
anchors:
  vocabulary: The vocabulary is a pipeline
  worked-trace: "Worked trace: a tiny linear model"
  training-inference: A model as a parameterized function
---

## The vocabulary is a pipeline

For one example, separate these ideas:

| Term | Meaning | Example for ticket routing |
| --- | --- | --- |
| Example | One training or inference case | One support ticket |
| Feature | A representation supplied to the model | Word counts, language, account tier |
| Label / target | Desired answer during supervised training | `billing` |
| Prediction | Model output for an input | Class scores or `billing` |
| Parameter | Value learned by optimizing an objective | A feature weight |
| Objective / loss | Number measuring undesirable behavior | Penalty for wrong predictions |
| Hyperparameter | Configuration chosen outside ordinary parameter updates | Learning rate or tree depth |

Feature engineering converts raw observations into a representation a model can
use. A text model might use token IDs or embeddings; a tabular model might use
numeric values and encoded categories. An integer ID is not automatically a useful
numeric feature: treating `red=0`, `blue=1`, `green=2` as ordered numbers invents a
relationship that may not exist.

## A model as a parameterized function

Write a simple model as:

```text
prediction = f(parameters, input)
```

For a one-feature linear model, `y_hat = w*x + b`. `w` and `b` are parameters. A
training algorithm changes them to reduce a loss over examples. The model does not
memorize “the answer” in a magical field; it stores a parameterized approximation
whose quality depends on the data, model family, objective, and optimization.

```text
training examples (x, y)
          |
          v
  model + loss/objective
          |
   parameter updates
          |
          v
     learned parameters

new x ---> same model + learned parameters ---> prediction y_hat
```

Training and inference are different operations. Training evaluates examples and
updates learned parameters. Inference normally holds those parameters fixed and
computes outputs for new inputs. An online-learning system may deliberately update
later, but that is a separate system behavior, not an automatic consequence of a
prediction request.

## Worked trace: a tiny linear model

Assume the examples are `(x=1, y=3)` and `(x=2, y=5)`. Start with `w=0`, `b=0`.
Use squared error per example, `loss = (y_hat - y)^2`, and a deliberately simple
update rule with learning rate `0.1`. This is a teaching trace, not production
training code.

| Step | `w` | `b` | Prediction for x=1 | Prediction for x=2 | Errors |
| ---: | ---: | ---: | ---: | ---: | --- |
| 0 | 0 | 0 | 0 | 0 | -3, -5 |
| 1 (illustrative update) | 0.9 | 1.3 | 2.2 | 3.1 | -0.8, -1.9 |
| 2 (illustrative update) | 1.15 | 1.7 | 2.85 | 4.0 | -0.15, -1.0 |

The exact values depend on whether the update uses the sum or mean of gradients and
the chosen derivative. The important trace is invariant: evaluate predictions,
measure error, calculate a direction for improvement, update parameters, and repeat.
The model is not “learning” during the final prediction step; its parameters were
already selected by training.

For a real linear-regression update using mean squared error, the gradients are:

```text
dL/dw = (2/n) * sum((w*x_i + b - y_i) * x_i)
dL/db = (2/n) * sum(w*x_i + b - y_i)
w     <- w - learning_rate * dL/dw
b     <- b - learning_rate * dL/db
```

The objective defines what “better” means. A low training loss can still mean poor
future predictions if the examples are unrepresentative or the model overfits.

## What labels do and do not mean

A label is the target defined for a particular task, not an eternal truth about an
example. “Toxic” might mean a moderator decision under a policy version. “Resolved”
might mean a ticket closed within seven days. Label definitions, missing labels,
label delay, and disagreement can all affect the learned behavior.

If a team wants document classification but has only documents and no category
labels, a supervised classifier cannot be trained directly from the intended target.
The team might label a sample, use an unsupervised method to explore structure, or
change the task. The availability and cost of labels are problem constraints.

## Hyperparameters are not learned parameters

Parameters are adjusted by the training procedure, such as weights in a linear
model. Hyperparameters configure that procedure or model capacity: learning rate,
number of trees, regularization strength, batch size, and neural-network depth are
examples. A validation process can select hyperparameters, but that selection is
external to the ordinary parameter update.

## Misconceptions to retire

- **“A prediction updates the model.”** Usually inference is read-only with respect
  to learned parameters. Updates need an explicit online-training design.
- **“Features are the same as raw columns.”** A feature is the representation the
  model consumes; preprocessing can transform, combine, or remove raw fields.
- **“A label is a feature.”** The target is used as the answer during supervised
  training and should not be accidentally included as an input.
- **“More parameters guarantee better predictions.”** Capacity can help represent
  patterns, but it can also increase data, compute, and overfitting requirements.

## Active recall

1. In `y_hat = w*x + b`, which values are parameters and which value is the input?
2. What changes during training, and what normally stays fixed during inference?
3. A model has excellent training loss but weak production results. Name three
   possible causes before changing the model architecture.

## Sources

- [Google ML Crash Course: Linear Regression](https://developers.google.com/machine-learning/crash-course/linear-regression)
- [Google ML Crash Course: Gradient Descent](https://developers.google.com/machine-learning/crash-course/linear-regression/gradient-descent)
- [Google ML Crash Course: Categorical Data and Feature Representations](https://developers.google.com/machine-learning/crash-course/categorical-data/one-hot-encoding)
- [Stanford CS229](https://cs229.stanford.edu/)
