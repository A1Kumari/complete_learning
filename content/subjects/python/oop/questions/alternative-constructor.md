---
id: python-oop-alternative-constructor
kind: question
topicId: python-oop
lessonId: lesson-python-oop-attributes-methods
prompt: "Which method type is useful for constructing an object from a string, and why?"
difficulty: easy
frequent: false
status: published
revision: 1
order: 41
tags: [python, oop, classmethod]
---

## Answer

A class method is a common choice: it receives `cls`, parses the input, and
calls `cls(...)` to construct an instance. This can also support subclasses
whose constructors accept the same arguments. Use the `csv` module for actual
CSV input rather than assuming a simple comma split handles every case.
