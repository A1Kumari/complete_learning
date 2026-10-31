---
id: python-generator-any-short-circuit
kind: question
topicId: python-iterators-generators
lessonId: lesson-python-generator-expressions-pipelines
prompt: "Which built-in stops consuming values as soon as it finds a truthy value?"
difficulty: easy
frequent: false
status: published
revision: 1
order: 41
tags: [python, generators]
---

## Answer

`any()` short-circuits at the first truthy value. It returns `False` when its
input is exhausted without finding one, including for an empty iterable.
