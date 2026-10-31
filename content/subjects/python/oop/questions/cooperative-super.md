---
id: python-oop-cooperative-super
kind: question
topicId: python-oop
lessonId: lesson-python-oop-inheritance
prompt: "In a diamond D(B, C), where can super().show() inside B.show() go when called on a D instance?"
difficulty: medium
frequent: false
status: published
revision: 1
order: 62
tags: [python, oop, inheritance, mro]
---

## Answer

It continues after `B` in `D`'s MRO and can therefore call `C.show()` if `C`
defines that method. `super()` follows the MRO rather than always calling the
direct parent written in `B`'s definition.
