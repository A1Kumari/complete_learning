---
id: db-normalization-lossless
kind: question
topicId: db-normalization
lessonId: lesson-db-normalization
prompt: "What does lossless decomposition mean, and how is it different from dependency preservation?"
difficulty: hard
frequent: false
status: published
revision: 1
order: 40
tags: [normalization, schema-design]
---

## Answer

Lossless decomposition means joining the decomposed relations reconstructs exactly the original relation for every instance satisfying the assumed dependencies, without spurious rows. Dependency preservation means the original dependencies can be enforced using constraints on the individual decomposed relations without needing a join. A decomposition can satisfy one property without the other.
