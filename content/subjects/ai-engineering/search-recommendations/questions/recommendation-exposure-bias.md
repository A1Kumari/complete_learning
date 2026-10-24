---
id: ai-recommendation-exposure-bias
kind: question
topicId: ai-search-recommendations
lessonId: lesson-ai-recommendation-feedback
prompt: Why is an unclicked recommendation not necessarily a negative preference?
difficulty: medium
status: published
revision: 1
order: 310
tags: [recommendations, feedback, bias]
followUps:
  - What is position bias?
  - Why should exposure be logged separately from interaction?
misconception: Every missing click is evidence that the user disliked the item.
---

## Answer

The user may never have seen the item, or it may have appeared below competing
content. Position, device, timing, and presentation affect clicks. Log exposure and
interaction separately and use debiasing, exploration, or controlled evaluation before
treating an event as preference evidence.

### Evaluation rubric

One point each: visibility versus interaction; position bias; exposure logging;
controlled or debiased learning.
