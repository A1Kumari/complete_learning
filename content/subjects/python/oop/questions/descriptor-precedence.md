---
id: python-oop-descriptor-precedence
kind: question
topicId: python-oop
lessonId: lesson-python-oop-advanced-class-features
prompt: "What takes precedence over an instance dictionary entry in ordinary attribute lookup?"
difficulty: medium
frequent: false
status: published
revision: 1
order: 112
tags: [python, oop, descriptors]
---

## Answer

A readable data descriptor found on the class through the MRO takes precedence.
For example, a property getter is used even if the instance dictionary contains
an entry with the same name. Custom attribute lookup can change these rules.
