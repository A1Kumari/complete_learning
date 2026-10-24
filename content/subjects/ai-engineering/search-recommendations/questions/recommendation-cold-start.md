---
id: ai-recommendation-cold-start
kind: question
topicId: ai-search-recommendations
lessonId: lesson-ai-recommendation-feedback
prompt: How should a recommender handle a new user or new item with little interaction history?
difficulty: medium
status: published
revision: 1
order: 410
tags: [recommendations, cold-start, personalization]
followUps:
  - Why must cold-start fallbacks remain within eligibility rules?
  - How can exploration create useful evidence?
misconception: A global popularity list is always a sufficient cold-start strategy.
---

## Answer

Use an explicit fallback such as eligible popular items, content similarity, editorial
rules, or a small exploration policy. Keep tenant, privacy, inventory, and safety
filters active. Track fallback usage and new-item exposure so the system can learn
without hiding every item behind existing popularity.

### Evaluation rubric

One point each: explicit fallback; eligibility preserved; exploration or content
signals; observability of cold-start behavior.
