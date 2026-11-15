---
id: db-foundations-surrogate-natural
kind: question
topicId: db-foundations
lessonId: lesson-db-relational-model
prompt: "Why might a table need a unique constraint on email even when it has a surrogate primary key?"
difficulty: easy
frequent: false
status: published
revision: 1
order: 20
tags: [keys, constraints]
---

## Answer

An artificial ID distinguishes rows but does not prevent two rows having the same email. If the business rule requires unique email addresses, enforce that rule separately with an appropriate unique constraint, considering case normalization and NULL behavior in the chosen DBMS.
