---
id: python-oop-operator-not-implemented
kind: question
topicId: python-oop
lessonId: lesson-python-oop-polymorphism
prompt: "What does returning NotImplemented from __add__ indicate?"
difficulty: medium
frequent: false
status: published
revision: 1
order: 73
tags: [python, oop, operators]
---

## Answer

It indicates that this implementation does not support the given operands.
Python can try appropriate fallback dispatch, including a reflected operation,
before raising `TypeError` if no implementation handles the operation.
`NotImplemented` is a return value, not `NotImplementedError`.
