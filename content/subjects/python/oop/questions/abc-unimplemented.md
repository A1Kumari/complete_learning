---
id: python-oop-abc-unimplemented
kind: question
topicId: python-oop
lessonId: lesson-python-oop-abstraction
prompt: "What happens when a conventional ABC subclass leaves an abstract method unimplemented?"
difficulty: easy
frequent: false
status: published
revision: 1
order: 82
tags: [python, oop, abc]
---

## Answer

It remains abstract and cannot normally be instantiated; attempting to do so
raises `TypeError`. Python's ABC machinery does not guarantee that a concrete
replacement has the correct signature or behavior.
