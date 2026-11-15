---
id: python-decorators-order
kind: question
topicId: python-decorators-context-managers
lessonId: lesson-python-decorators-context-managers
prompt: In what order are stacked decorators applied, and why use functools.wraps?
difficulty: medium
status: published
revision: 1
order: 110
tags: [python, decorators]
---

## Answer

Decorators are applied from the bottom upward: `@outer` above `@inner` produces `outer(inner(function))`. `functools.wraps` copies useful metadata and provides `__wrapped__`, improving debugging and introspection.
