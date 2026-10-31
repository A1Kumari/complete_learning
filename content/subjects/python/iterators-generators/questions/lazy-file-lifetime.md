---
id: python-generator-lazy-file-lifetime
kind: question
topicId: python-iterators-generators
lessonId: lesson-python-generator-expressions-pipelines
prompt: "Why must a file remain open while a lazy pipeline reads its lines?"
difficulty: easy
frequent: false
status: published
revision: 1
order: 44
tags: [python, generators, files]
---

## Answer

The pipeline requests lines when it is consumed, not necessarily when it is
created. Reading after the file's context has closed can raise `ValueError`.
