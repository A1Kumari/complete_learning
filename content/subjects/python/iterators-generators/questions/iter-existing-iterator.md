---
id: python-iteration-iter-existing-iterator
kind: question
topicId: python-iterators-generators
lessonId: lesson-python-iteration-fundamentals
prompt: "What does iter() return when given an existing iterator?"
difficulty: easy
frequent: false
status: published
revision: 1
order: 10
tags: [python, iterators]
---

## Answer

An iterator's `__iter__` returns the iterator itself, so `iter(iterator) is
iterator`. It does not create an independent traversal.
