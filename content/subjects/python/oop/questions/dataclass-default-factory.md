---
id: python-oop-dataclass-default-factory
kind: question
topicId: python-oop
lessonId: lesson-python-oop-advanced-class-features
prompt: "Why use field(default_factory=list) in a dataclass?"
difficulty: easy
frequent: false
status: published
revision: 1
order: 110
tags: [python, oop, dataclasses]
---

## Answer

The factory creates a fresh list when each instance needs the default, avoiding
unintentional sharing. It does not enforce the types of list elements.
