---
id: python-generators-lifecycle
kind: question
topicId: python-iterators-generators
lessonId: lesson-python-iterators-generators
prompt: When does a generator function execute, and can an exhausted generator be restarted?
difficulty: medium
status: published
revision: 1
order: 90
tags: [python, generators]
---

## Answer

Calling it creates a generator; its body runs as values are requested, suspending at `yield`. Once exhausted, that generator stays exhausted. Call the generator function again to create a new one.
