---
id: python-generator-iterator
kind: question
topicId: python-iterators-generators
lessonId: lesson-python-generator-functions
prompt: "What does iter(g) is g return for a generator object?"
difficulty: easy
frequent: false
status: published
revision: 1
order: 33
tags: [python, generators]
---

## Answer

`True`. A generator object is an iterator, and an iterator's `__iter__` returns
the iterator itself; it does not create a new traversal.
