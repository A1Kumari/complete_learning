---
id: python-oop-method-overriding
kind: question
topicId: python-oop
lessonId: lesson-python-oop-polymorphism
prompt: "What happens when a subclass overrides an inherited method?"
difficulty: easy
frequent: false
status: published
revision: 1
order: 72
tags: [python, oop, inheritance]
---

## Answer

The subclass supplies its own implementation, which is normally found first
when the method is looked up on its instances. The parent method is not deleted
and can be called explicitly or through suitable use of `super()`.
