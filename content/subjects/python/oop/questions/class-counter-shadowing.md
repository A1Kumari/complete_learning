---
id: python-oop-class-counter-shadowing
kind: question
topicId: python-oop
lessonId: lesson-python-oop-attributes-methods
prompt: "For an ordinary instance, what does self.count += 1 do when count is an integer class attribute?"
difficulty: medium
frequent: false
status: published
revision: 1
order: 43
tags: [python, oop, attributes]
---

## Answer

It reads the class attribute if no instance value exists, adds one, and
ordinarily assigns the result to an instance attribute. The instance value then
shadows the class attribute; it does not update the original class counter.
