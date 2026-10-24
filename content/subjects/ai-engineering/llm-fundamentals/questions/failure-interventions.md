---
id: ai-llm-failure-intervention
kind: question
topicId: ai-llm-fundamentals
lessonId: lesson-ai-llm-capabilities-limitations
prompt: How do you choose between prompt changes, retrieval, deterministic tools, and model adaptation?
difficulty: medium
status: published
revision: 1
order: 350
tags: [llm, reliability, model-selection]
followUps:
  - Can clearer instructions supply a policy that changed yesterday?
  - Can a correct citation format still contain a hallucinated citation?
misconception: One universal prompt repair cannot resolve missing evidence, calculation bugs, and capability gaps alike.
---

## Answer

Diagnose the failure. Clarify ambiguous requirements with prompting, retrieve current
authorized evidence for knowledge gaps, use deterministic tools for exact operations,
and evaluate different models or adaptation for persistent behavior/capability gaps.

### Supporting reasoning

Each intervention has its own failures: stale retrieval, wrong tool results, and
overfit adaptation. Check actual supporting evidence and held-out task outcomes.

### Evaluation rubric

One point each: failure diagnosis; appropriate prompt use; evidence/tool distinction;
measured adaptation decision rather than automatic escalation in complexity.
