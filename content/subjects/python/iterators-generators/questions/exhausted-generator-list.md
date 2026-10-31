---
id: python-generator-exhausted-list
kind: question
topicId: python-iterators-generators
lessonId: lesson-python-generator-expressions-pipelines
prompt: "What does list() return for an already exhausted generator?"
difficulty: easy
frequent: false
status: published
revision: 1
order: 42
tags: [python, generators]
---

## Answer

An empty list. Generator objects are normally one-shot and do not restart when
passed to `list` again.
