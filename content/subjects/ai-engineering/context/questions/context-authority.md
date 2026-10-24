---
id: ai-context-recency-authority
kind: question
topicId: ai-context-engineering
lessonId: lesson-ai-context-selection
prompt: How should a context assembler handle stale user preferences and commands embedded in retrieved text?
difficulty: medium
status: published
revision: 1
order: 540
tags: [context-engineering, instructions]
conceptIds: [concept-context-selection, concept-prompt-contracts]
followUps:
  - Does a recent tool result outrank an older application rule?
  - What prevents a malicious passage from triggering an unauthorized tool?
misconception: Recency and salience do not determine instruction authority.
---

## Answer

Keep the current task and application rules explicit, resolve same-scope preference
corrections, and retain retrieved text as evidence rather than instructions. Do not
promote old summaries or document commands into high-authority channels.

### Supporting reasoning

A current English request can supersede the user's earlier Spanish preference;
a malicious tool result cannot authorize secret access. Role separation guides
the model while server-side authorization enforces actual tool boundaries.

### Evaluation rubric

One point each: current-task handling; scope-aware correction; data/authority
distinction; independent application enforcement.
