---
id: ai-context-compaction-faithfulness
kind: question
topicId: ai-context-engineering
lessonId: lesson-ai-context-memory
prompt: What should conversation compaction preserve, and how would you test it?
difficulty: medium
status: published
revision: 1
order: 580
tags: [context-engineering, compaction, evaluation]
conceptIds: [concept-context-memory]
followUps:
  - How does a summary differ from a KV cache or learned weights?
  - Why distinguish requested actions from confirmed completed actions?
misconception: A shorter summary is not necessarily a faithful or sufficient replacement for history.
---

## Answer

Preserve active goals, constraints, corrections, unresolved tasks, exact operational
IDs, completion state, and source references. Test long traces before/after
compaction, including cancelled tasks, later-needed details, and permission changes.

### Supporting reasoning

A generated summary is lossy derived data, not proof a side effect executed.
Durable service records establish execution; a cache is computational reuse and
ordinary context/memory changes do not retrain weights.

### Evaluation rubric

One point each: meaningful preserved state; provenance/exact identifiers;
requested-versus-completed distinction; adversarial/long-horizon evaluation.
