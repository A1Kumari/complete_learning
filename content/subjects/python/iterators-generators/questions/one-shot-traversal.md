---
id: python-iteration-one-shot-traversal
kind: question
topicId: python-iterators-generators
lessonId: lesson-python-building-custom-iterators
prompt: "What does a second loop over the same fully consumed one-shot iterator produce?"
difficulty: easy
frequent: false
status: published
revision: 1
order: 23
tags: [python, iterators]
---

## Answer

Normally it produces no values: the iterator remains exhausted. A reusable
iterable can instead provide a new iterator for another traversal.
