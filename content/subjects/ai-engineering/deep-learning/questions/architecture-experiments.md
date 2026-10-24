---
id: ai-architecture-experiment-design
kind: question
topicId: ai-deep-learning
lessonId: lesson-ai-architecture-selection
prompt: Can you select an architecture family for image defects, telemetry, or ticket classification without experiments?
difficulty: medium
frequent: false
status: published
revision: 1
order: 220
tags: [model-selection, evaluation, engineering-tradeoffs]
conceptIds: [concept-architecture-tradeoffs, concept-ml-problem-formulation]
followUps:
  - What baselines would you choose for the three tasks?
  - How could random splitting of neighboring telemetry windows mislead the comparison?
misconception: Architectural inductive bias justifies a candidate; it does not establish the winner for a new dataset and deployment budget.
---

## Answer

You can justify candidates from modality, locality, sequence dependence, pretrained
models, and hardware constraints, but you cannot establish a winner from family names
alone. Define the task and costs, choose baselines, compare on appropriate held-out
data, inspect slices and errors, and benchmark the complete system on target hardware.

### Supporting reasoning

For image defects, start with a pretrained vision/CNN baseline and preserve tiny
defects during resizing. For telemetry, compare statistical features, a causal 1D
CNN, and a GRU with time/device-aware splits. For tickets, start with TF-IDF plus
logistic regression before an encoder or LLM. Near-duplicate windows split randomly
can inflate quality. Evaluate latency, memory, cost, and failure handling as well as
aggregate predictive scores.

### Evaluation rubric

- **1 point:** treats architecture choice as a testable hypothesis.
- **1 point:** gives task-appropriate baselines and measurable metrics.
- **1 point:** handles representative splits, slices, or leakage.
- **1 point:** includes deployment measurements and an explicit selection trade-off.

### Reference

[Engineering decision process](../lessons/architecture-selection.md).
