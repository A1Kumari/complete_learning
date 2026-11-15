---
id: db-normalization-bcnf
kind: question
topicId: db-normalization
lessonId: lesson-db-normalization
prompt: "What is the precise difference between 3NF and BCNF?"
difficulty: hard
frequent: true
status: published
revision: 1
order: 30
tags: [normalization]
---

## Answer

For each nontrivial functional dependency X → A, 3NF requires X to be a superkey or A to be prime, meaning it belongs to some candidate key. BCNF requires X to be a superkey for every nontrivial dependency. Thus BCNF is stricter; a BCNF decomposition can lose dependency preservation.
