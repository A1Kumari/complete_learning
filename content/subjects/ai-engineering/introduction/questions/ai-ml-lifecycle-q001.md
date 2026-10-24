---
id: ai-ml-lifecycle-q001
kind: question
topicId: ai-ml-introduction
lessonId: lesson-end-to-end-ml-lifecycle
prompt: "What should you define before collecting data for an ML product?"
difficulty: medium
frequent: true
status: published
revision: 1
order: 100
tags: [machine-learning, problem-formulation, production]
conceptIds: [concept-ml-lifecycle, concept-ml-problem-formulation]
followUps:
  - "What makes a useful baseline?"
  - "Why must feature availability be defined at decision time?"
misconception: "Starting with a model architecture before defining the decision and success criteria is not a reliable ML workflow."
---

## Answer

Define the decision, user or downstream consumer, inputs available at decision time,
output type, ground-truth outcome, success metric, error costs, latency and cost
constraints, privacy or safety constraints, and a simple baseline. This definition
exposes whether labels exist, whether the feature is available early enough, and
whether ML is necessary. It also determines how data should be collected and split.
