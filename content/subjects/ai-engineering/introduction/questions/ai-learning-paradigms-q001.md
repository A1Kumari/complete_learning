---
id: ai-learning-paradigms-q001
kind: question
topicId: ai-ml-introduction
lessonId: lesson-learning-paradigms
prompt: "Compare supervised, unsupervised, and self-supervised learning."
difficulty: medium
frequent: true
status: published
revision: 1
order: 70
tags: [machine-learning, supervised-learning, self-supervised-learning]
conceptIds: [concept-learning-paradigms, concept-self-supervised-learning]
followUps:
  - "Is self-supervised learning simply unsupervised learning with a new name?"
  - "Where do labels come from in next-token prediction?"
misconception: "Self-supervised learning constructs a target and loss from the input; it is not merely clustering unlabeled data."
---

## Answer

Supervised learning receives input-target pairs and learns to predict the target.
Unsupervised learning receives inputs without a prescribed task label and seeks
structure such as clusters or compact representations. Self-supervised learning
also starts with unlabeled raw data, but constructs an explicit predictive target
from each example, such as a masked token or the next token. Thus self-supervised
learning has supervision in the form of a derived target, not a human-supplied label.
