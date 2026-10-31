---
id: python-oop-static-method-purpose
kind: question
topicId: python-oop
lessonId: lesson-python-oop-attributes-methods
prompt: "What method type can check whether a number is positive without using instance or class state?"
difficulty: easy
frequent: false
status: published
revision: 1
order: 42
tags: [python, oop, staticmethod]
---

## Answer

A static method can do this without automatically receiving an instance or
class. If the check is a general utility rather than part of the class's
interface, a module-level function may be simpler.
