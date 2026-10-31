---
id: python-iteration-custom-exhaustion
kind: question
topicId: python-iterators-generators
lessonId: lesson-python-building-custom-iterators
prompt: "What should __next__ do when a finite custom iterator is exhausted?"
difficulty: easy
frequent: false
status: published
revision: 1
order: 22
tags: [python, iterators]
---

## Answer

It should raise `StopIteration` and continue to signal exhaustion on later
calls rather than silently restarting the traversal.
