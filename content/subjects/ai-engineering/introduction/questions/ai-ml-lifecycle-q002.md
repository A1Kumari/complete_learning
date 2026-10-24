---
id: ai-ml-lifecycle-q002
kind: question
topicId: ai-ml-introduction
lessonId: lesson-end-to-end-ml-lifecycle
prompt: "Why should a test set not be repeatedly used to choose models and hyperparameters?"
difficulty: medium
frequent: true
status: published
revision: 1
order: 110
tags: [machine-learning, evaluation, data-splits]
conceptIds: [concept-ml-lifecycle]
followUps:
  - "What is the role of a validation set?"
  - "When would a temporal or grouped split be preferable to a random split?"
misconception: "A test set can be separate from training examples yet still become a tuning target through repeated decisions."
---

## Answer

Use training data to fit parameters and validation data to select features, model
variants, hyperparameters, or thresholds. Reserve the test set for a final estimate.
If the team repeatedly changes the system based on test results, those results become
an indirect training signal and confidence in generalization decreases. A temporal
split can better represent future data; a grouped split can prevent related records
from appearing in both training and test partitions.
