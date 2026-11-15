---
id: db-foundations-one-to-one
kind: question
topicId: db-foundations
lessonId: lesson-db-relational-model
prompt: "How can you model an optional one-to-one user profile, and what does the constraint not guarantee?"
difficulty: medium
frequent: false
status: published
revision: 1
order: 30
tags: [modeling, foreign-keys]
---

## Answer

Give `profile.user_id` a non-null foreign key to `user` and a unique constraint, or use it as the profile primary key. Each profile then belongs to one existing user and each user has at most one profile. It does not require every user to have a profile; enforcing total participation requires additional design.
