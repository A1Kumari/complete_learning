---
id: ai-context-eligibility-before-ranking
kind: question
topicId: ai-context-engineering
lessonId: lesson-ai-context-selection
prompt: Why should context eligibility be checked separately from relevance ranking?
difficulty: medium
status: published
revision: 1
order: 530
tags: [context-engineering, authorization]
conceptIds: [concept-context-selection]
followUps:
  - Can a high similarity score authorize access to another tenant's document?
  - When can an older policy be the correct source?
misconception: Relevance does not establish permission, currentness, truth, or instruction authority.
---

## Answer

Eligibility determines whether an item may be supplied under the user's permissions,
scope, and requested reference time. Relevance ranks eligible items by usefulness.
A highly relevant private or inapplicable policy must still be excluded.

### Supporting reasoning

Gate access before the model sees the text; post-generation redaction cannot undo
disclosure. Historical questions may require an older effective policy, whereas a
current-policy question requires the applicable current version.

### Evaluation rubric

One point each: separate permission and usefulness; filter before disclosure;
time/scope qualification; concrete private or historical-policy example.
