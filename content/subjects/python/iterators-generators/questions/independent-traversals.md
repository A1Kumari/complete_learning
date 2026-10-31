---
id: python-iteration-independent-traversals
kind: question
topicId: python-iterators-generators
lessonId: lesson-python-building-custom-iterators
prompt: "Why does a reusable collection usually return a fresh iterator for each traversal?"
difficulty: easy
frequent: false
status: published
revision: 1
order: 21
tags: [python, iterators]
---

## Answer

Fresh iterators have independent positions, so simultaneous or nested
traversals do not accidentally consume each other's values.
