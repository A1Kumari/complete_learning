---
id: db-indexes-n-plus-one
kind: question
topicId: db-indexes
lessonId: lesson-db-indexes
prompt: "What is the N+1 query problem, and why is a single join not always the best fix?"
difficulty: medium
frequent: true
status: published
revision: 1
order: 40
tags: [performance, orm]
---

## Answer

An application fetches N parent records and issues a separate query for each parent's related data, causing many round trips. Batch related rows or use an appropriate eager-loading strategy. A join can help, but joining multiple collections can multiply rows and transfer excessive data, so compare plans and result sizes.
