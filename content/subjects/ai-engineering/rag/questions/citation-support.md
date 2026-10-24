---
id: ai-rag-citation-support
kind: question
topicId: ai-rag
lessonId: lesson-ai-rag-grounding
prompt: An answer says returns are allowed for 90 days and cites a real retrieved source that says 30 days. Which validation passed, and which failed?
difficulty: medium
frequent: true
status: published
revision: 1
order: 1060
tags: [rag, citations, grounding]
conceptIds: [concept-rag-grounding]
followUps:
  - Does finding an exact quote in a source establish every surrounding claim?
  - What should happen if the rule changes after retrieval?
misconception: A resolvable citation does not prove the cited evidence entails the answer.
---

## Answer

Citation integrity may pass because the ID resolves to supplied evidence. Claim
support fails because the cited rule contradicts 90 days. Reject or repair the
unsupported claim using the appropriate revision, scope, and source conditions.

### Supporting reasoning

Source identity, quote integrity, and semantic support are separate checks. A narrow
typed field can have a deterministic validator; unrestricted prose requires broader
evaluation. Preserve revision identity rather than silently resolving to new text.

### Evaluation rubric

One point each: integrity distinction; contradictory numeric claim; correct
acceptance response; revision or semantic-validation qualification.
