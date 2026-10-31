---
id: python-iteration-stop-iteration
kind: question
topicId: python-iterators-generators
lessonId: lesson-python-iteration-fundamentals
prompt: "How does an iterator signal that it has no more values?"
difficulty: easy
frequent: false
status: published
revision: 1
order: 11
tags: [python, iterators]
---

## Answer

It raises `StopIteration`. A `for` loop handles this normal exhaustion signal;
manual `next()` raises it unless a default was supplied.
