---
id: python-oop-protocol-structural-typing
kind: question
topicId: python-oop
lessonId: lesson-python-oop-abstraction
prompt: "How can unrelated classes satisfy a statically described interface without inheriting from it?"
difficulty: medium
frequent: false
status: published
revision: 1
order: 83
tags: [python, oop, protocols]
---

## Answer

A `typing.Protocol` describes the required structure. A static type checker can
accept unrelated classes that provide compatible members without explicit
inheritance. Annotations alone do not enforce that compatibility at runtime.
