---
id: python-collections-shallow-copy
kind: question
topicId: python-data-structures
lessonId: lesson-python-data-structures
prompt: How does a shallow copy of a nested list differ from a deep copy?
difficulty: easy
status: published
revision: 1
order: 30
tags: [python, collections]
misconception: A shallow copy creates a new outer container, not independent nested objects.
---

## Answer

A shallow copy creates a new outer list but retains references to the same nested objects. Mutating a shared inner list affects both. A deep copy recursively copies nested objects, subject to the objects' copying behavior.
