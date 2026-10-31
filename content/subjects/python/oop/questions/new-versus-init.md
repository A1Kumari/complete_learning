---
id: python-oop-new-versus-init
kind: question
topicId: python-oop
lessonId: lesson-python-oop-constructors-self
prompt: "What is the main purpose of __new__ compared with __init__?"
difficulty: medium
frequent: false
status: published
revision: 1
order: 32
tags: [python, oop, constructors]
---

## Answer

`__new__` creates or returns an object, usually an instance of the class.
`__init__` initializes an existing instance and must return `None`. Normally
you only need to define `__init__` for an ordinary class.
