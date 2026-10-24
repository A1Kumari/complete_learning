---
id: ai-learning-paradigms-q003
kind: question
topicId: ai-ml-introduction
lessonId: lesson-learning-paradigms
prompt: "When might semi-supervised learning be useful, and what assumption must you check?"
difficulty: medium
frequent: false
status: published
revision: 1
order: 90
tags: [machine-learning, semi-supervised-learning, data]
conceptIds: [concept-learning-paradigms, concept-ml-problem-formulation]
followUps:
  - "Why can pseudo-labels amplify errors?"
  - "What would you do if the unlabeled pool came from a different population?"
misconception: "Unlabeled data is not automatically beneficial; the method depends on distribution and consistency assumptions."
---

## Answer

Semi-supervised learning combines a smaller labeled dataset with a larger unlabeled
dataset. It can be useful when annotation is expensive but the unlabeled examples
are relevant to the same task and population. Algorithms may use consistency
objectives or pseudo-labels. Those pseudo-labels are model predictions, not guaranteed
truth, so errors can be reinforced. Validate the assumptions and compare against a
supervised baseline.
