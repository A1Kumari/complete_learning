---
id: python-oop-mutable-constructor-default
kind: question
topicId: python-oop
lessonId: lesson-python-oop-constructors-self
prompt: "What happens if two objects use the same mutable list as a default constructor argument?"
difficulty: medium
frequent: true
status: published
revision: 1
order: 31
tags: [python, oop, mutable-defaults]
---

## Answer

They can unintentionally share the same list. Default values are evaluated when
the function is defined, so calls that omit the argument reuse that object.
Use a `None` default and create a new list inside the initializer; copy an
explicitly supplied list too if the instances should not share it.
