---
id: python-functions-mutable-default
kind: question
topicId: python-functions-scope
lessonId: lesson-python-functions-scope
prompt: Why can a mutable default argument retain values between function calls?
difficulty: medium
status: published
revision: 1
order: 40
tags: [python, functions]
misconception: Default argument expressions are not evaluated anew for each call.
---

## Answer

The default expression is evaluated when the function is defined, and the resulting object is reused. Use `None` as a sentinel and create a new list inside the function when a fresh list is required for each call.
