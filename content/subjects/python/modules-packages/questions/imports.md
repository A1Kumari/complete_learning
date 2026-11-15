---
id: python-modules-import-cache
kind: question
topicId: python-modules-packages
lessonId: lesson-python-modules-packages
prompt: Why does importing a module twice normally not execute its top-level code twice?
difficulty: medium
status: published
revision: 1
order: 50
tags: [python, imports]
---

## Answer

Python caches imported modules in `sys.modules` and normally reuses the existing module object on subsequent imports. Explicit reloads, cache changes, and importing the same file under different names can change this behavior.
