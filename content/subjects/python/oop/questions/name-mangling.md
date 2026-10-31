---
id: python-oop-name-mangling
kind: question
topicId: python-oop
lessonId: lesson-python-oop-encapsulation
prompt: "How is __score normally rewritten when it appears inside a class named Student?"
difficulty: easy
frequent: false
status: published
revision: 1
order: 51
tags: [python, oop, name-mangling]
---

## Answer

It is mangled to `_Student__score`. This reduces accidental name collisions,
especially with subclasses; it does not make the attribute secure or inaccessible.
