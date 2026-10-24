---
id: ai-context-greedy-packing
kind: question
topicId: ai-context-engineering
lessonId: lesson-ai-context-packing
prompt: Trace the packer with input limit 28, required cost 12, and ranked evidence costs 8, 12, and 5. Is greedy packing optimal?
difficulty: medium
status: published
revision: 1
order: 560
tags: [context-engineering, selection]
conceptIds: [concept-context-budgeting]
followUps:
  - Why continue after an item fails to fit?
  - Which context relationships should be treated as atomic groups?
misconception: Deterministic greedy selection improves reproducibility but does not prove maximum task utility.
---

## Answer

Accept cost 8 for total 20, skip cost 12 because total 32 exceeds 28, then accept
cost 5 for total 25. Greedy selection is a declared heuristic, not a universal optimum.

### Supporting reasoning

Shorter complementary evidence may be more useful than one long high-score item.
Preserve relationships such as tool call/result and policy/required exception.
Stable ranking and ordering support controlled evaluation of alternatives.

### Evaluation rubric

One point each: correct trace; skip-and-continue behavior; nonoptimality caveat;
atomic relationship or task-coverage example.
