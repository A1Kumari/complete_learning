---
id: ai-learning-paradigms-q002
kind: question
topicId: ai-ml-introduction
lessonId: lesson-learning-paradigms
prompt: "How does reinforcement learning differ from ordinary supervised classification?"
difficulty: medium
frequent: true
status: published
revision: 1
order: 80
tags: [machine-learning, reinforcement-learning]
conceptIds: [concept-learning-paradigms]
followUps:
  - "Why do delayed rewards make credit assignment difficult?"
  - "What is the exploration-exploitation trade-off?"
misconception: "A reward is not simply a classification label because actions affect future states and rewards may be delayed."
---

## Answer

In supervised classification, each example usually has a target label and the model
learns to map an input to that target. In reinforcement learning, an agent selects
actions in an environment, observes transitions, and receives rewards or penalties.
The goal is to learn a policy that maximizes suitable cumulative reward. Actions can
change future states, rewards can be delayed, and the agent must balance exploring
unknown actions with exploiting known ones.
