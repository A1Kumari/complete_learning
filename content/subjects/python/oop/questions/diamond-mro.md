---
id: python-oop-diamond-mro
kind: question
topicId: python-oop
lessonId: lesson-python-oop-inheritance
prompt: "What is the MRO of D(B, C) when both B and C inherit from A?"
difficulty: medium
frequent: false
status: published
revision: 1
order: 61
tags: [python, oop, inheritance, mro]
---

## Answer

For the ordinary diamond hierarchy, it is `D → B → C → A → object`. Inspect
`D.__mro__` or `D.mro()` to verify it.
