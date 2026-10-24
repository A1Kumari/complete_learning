---
id: ai-prompt-few-shot-examples
kind: question
topicId: ai-prompt-engineering
lessonId: lesson-ai-prompt-examples-patterns
prompt: When do few-shot examples help, and how do you choose them?
difficulty: medium
status: published
revision: 1
order: 470
tags: [prompting, few-shot]
followUps:
  - Why include boundary or missing-information cases?
  - How do few-shot examples differ from supervised fine-tuning?
misconception: More examples can increase cost or bias without improving the task.
---

## Answer

Examples can clarify label boundaries, output format, and exception policies.
Choose representative, consistent demonstrations, including difficult boundaries,
and evaluate against disjoint held-out cases. Check benefit against token and latency cost.

### Supporting reasoning

Class imbalance and conflicting example labels can dominate the prompt. Ordinary
few-shot prompting changes inference context, whereas fine-tuning updates parameters.

### Evaluation rubric

One point each: concrete benefit; representative consistent examples;
held-out evaluation/cost trade-off; distinction from training.
