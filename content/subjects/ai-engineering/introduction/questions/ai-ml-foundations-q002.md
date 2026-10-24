---
id: ai-ml-foundations-q002
kind: question
topicId: ai-ml-introduction
lessonId: lesson-ai-and-ml-foundations
prompt: "When would you choose a rule-based solution instead of machine learning?"
difficulty: medium
frequent: true
status: published
revision: 1
order: 20
tags: [ai, machine-learning, engineering-tradeoffs]
conceptIds: [concept-ai-ml-dl, concept-ml-problem-formulation]
followUps:
  - "What would make the mapping a good candidate for supervised learning?"
  - "How would you combine a rule with a model safely?"
misconception: "Machine learning is not automatically the right solution for every problem containing data."
---

## Answer

Prefer rules when the policy is small, stable, explicit, and safety-critical, or when
there is not enough representative data to train and evaluate a model. Rules are
often easier to inspect, test, and explain. Prefer ML when the mapping is difficult
to enumerate, examples are available, and the system can tolerate and manage
uncertainty. A hybrid is common: use a model for ranking or classification, then use
deterministic rules for authorization, mandatory escalation, or output constraints.

### What a strong answer adds

The decision should consider maintenance cost, data quality, latency, false-positive
and false-negative costs, monitoring, and fallback behavior rather than treating
“AI” as a goal by itself.
