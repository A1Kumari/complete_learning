---
id: python-oop-inherited-initializer
kind: question
topicId: python-oop
lessonId: lesson-python-oop-inheritance
prompt: "If a subclass defines its own __init__, does Python automatically run the parent's initializer too?"
difficulty: easy
frequent: false
status: published
revision: 1
order: 60
tags: [python, oop, inheritance]
---

## Answer

No. The child initializer must call the parent initialization when it is
needed, commonly using `super().__init__(...)`. If the child does not define
an initializer, Python can find an inherited one instead.
