---
id: python-metaprogramming-descriptors
kind: question
topicId: python-metaprogramming
lessonId: lesson-python-metaprogramming
prompt: What is a descriptor, and how does a property use the descriptor protocol?
difficulty: hard
status: published
revision: 1
order: 170
tags: [python, descriptors]
---

## Answer

A descriptor is an object that defines attribute-access behavior through methods such as `__get__`, `__set__`, or `__delete__`. A property is a descriptor that delegates access to methods defined on the owning class.
