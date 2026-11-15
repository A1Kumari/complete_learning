---
id: db-foundations-candidate-key
kind: question
topicId: db-foundations
lessonId: lesson-db-relational-model
prompt: "What is the difference between a superkey, candidate key, and primary key?"
difficulty: easy
frequent: true
status: published
revision: 1
order: 10
tags: [keys, modeling]
---

## Answer

A superkey uniquely identifies a row. A candidate key is a minimal superkey: removing any attribute loses uniqueness. A primary key is the candidate key selected as the table's main identifier. A composite key has multiple attributes, and another candidate key can be enforced separately with an appropriate unique constraint.
