---
id: ai-context-memory-supersession
kind: question
topicId: ai-context-engineering
lessonId: lesson-ai-context-memory
prompt: Why can filtering expired memory events before applying corrections revive stale preferences?
difficulty: medium
status: published
revision: 1
order: 570
tags: [context-engineering, memory]
conceptIds: [concept-context-memory]
followUps:
  - What happens when an English preference supersedes Spanish and then expires?
  - How should deletion events affect retrieved memory?
misconception: Expiring a corrected value does not necessarily make its superseded predecessor valid again.
---

## Answer

Removing the newer expired event first can leave the older value as the apparent
latest. Resolve correction/deletion order for the key, then apply expiry to the
resolved state under the declared policy.

### Supporting reasoning

The lesson's policy returns no preference after English expires rather than
resurrecting Spanish. Memory also requires user isolation, provenance, and current
authorization; last-write-wins is not a universal rule for differing authorities.

### Evaluation rubric

One point each: explains revival failure; correct resolution order; deletion/expiry
behavior; scope/authority or isolation qualification.
