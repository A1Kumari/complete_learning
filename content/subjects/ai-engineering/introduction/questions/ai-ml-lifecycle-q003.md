---
id: ai-ml-lifecycle-q003
kind: question
topicId: ai-ml-introduction
lessonId: lesson-end-to-end-ml-lifecycle
prompt: "What should you monitor after deploying a machine-learning model?"
difficulty: medium
frequent: true
status: published
revision: 1
order: 120
tags: [machine-learning, monitoring, deployment]
conceptIds: [concept-ml-lifecycle, concept-ml-monitoring]
followUps:
  - "Why is input drift not proof of model-quality failure?"
  - "How do you monitor outcomes when labels arrive late?"
misconception: "Monitoring only uptime and latency misses input, prediction, outcome, and feedback-loop failures."
---

## Answer

Monitor service health such as availability, latency, errors, and cost; input quality
such as schema validity, missingness, ranges, and distribution changes; model behavior
such as score distributions, abstentions, and slice-level errors; and outcomes such
as delayed labels, business success, and fairness-relevant errors. Input drift is a
signal to investigate, not proof of degraded quality. Log model and data versions,
sample cases for review, and account for label delay and privacy constraints.
