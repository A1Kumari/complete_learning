---
id: python-generator-expression-result
kind: question
topicId: python-iterators-generators
lessonId: lesson-python-generator-expressions-pipelines
prompt: "What does a generator expression produce when evaluated?"
difficulty: easy
frequent: false
status: published
revision: 1
order: 40
tags: [python, generators]
---

## Answer

It creates a generator object, not a tuple or list. The leftmost iterable
expression is evaluated immediately; most processing occurs as values are requested.
