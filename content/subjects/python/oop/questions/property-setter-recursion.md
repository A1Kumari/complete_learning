---
id: python-oop-property-setter-recursion
kind: question
topicId: python-oop
lessonId: lesson-python-oop-encapsulation
prompt: "What happens if an age property setter assigns to self.age?"
difficulty: medium
frequent: false
status: published
revision: 1
order: 52
tags: [python, oop, properties]
---

## Answer

The assignment invokes the same setter again, causing repeated calls until
Python raises `RecursionError`. Store the value under a different name, such
as `self._age`, instead.
