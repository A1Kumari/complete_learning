---
id: python-data-model-hash-equality
kind: question
topicId: python-data-model
lessonId: lesson-python-data-model
prompt: What relationship must hold between equality and hashing for dictionary keys?
difficulty: medium
status: published
revision: 1
order: 80
tags: [python, hashing]
misconception: Equal hashes do not imply that two objects are equal.
---

## Answer

Objects that compare equal must have the same hash, and a key's hash must remain stable while it is in a dictionary or set. Unequal objects may have the same hash. Mutable value-based objects are generally unsuitable as hash keys.
