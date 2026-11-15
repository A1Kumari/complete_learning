---
id: db-foundations-check-null
kind: question
topicId: db-foundations
lessonId: lesson-db-relational-model
prompt: "Why might CHECK (price >= 0) permit a missing price?"
difficulty: medium
frequent: false
status: published
revision: 1
order: 40
tags: [constraints, "null"]
---

## Answer

With SQL three-valued logic, comparing NULL to zero produces UNKNOWN. A check constraint normally rejects FALSE, not UNKNOWN, so add `NOT NULL` if every row must have a price. Verify the exact behavior in the target DBMS.
