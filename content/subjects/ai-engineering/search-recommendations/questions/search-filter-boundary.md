---
id: ai-search-filter-boundary
kind: question
topicId: ai-search-recommendations
lessonId: lesson-ai-search-ranking-pipeline
prompt: Which search constraints should be hard filters instead of ranking features?
difficulty: hard
status: published
revision: 1
order: 210
tags: [search, authorization, filtering]
followUps:
  - Why is lowering an unauthorized document's score unsafe?
  - Which user context should come from the application?
misconception: A sufficiently low relevance score is equivalent to access control.
---

## Answer

Authorization, tenant scope, privacy restrictions, availability, and hard policy
requirements must filter candidates before ranking. Ranking is for preference among
eligible items. An unauthorized document is unsafe even if it is unlikely to appear.

### Evaluation rubric

One point each: hard eligibility; separate preference ranking; trusted application
context; no security-through-score assumption.
