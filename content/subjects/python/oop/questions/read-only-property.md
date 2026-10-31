---
id: python-oop-read-only-property
kind: question
topicId: python-oop
lessonId: lesson-python-oop-encapsulation
prompt: "What happens when you assign to a Python property that has a getter but no setter?"
difficulty: easy
frequent: false
status: published
revision: 1
order: 53
tags: [python, oop, properties]
---

## Answer

Ordinary assignment raises `AttributeError`. This only prevents assignment
through that property; it does not make the entire object immutable.
