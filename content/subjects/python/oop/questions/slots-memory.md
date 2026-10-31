---
id: python-oop-slots-memory
kind: question
topicId: python-oop
lessonId: lesson-python-oop-advanced-class-features
prompt: "How can __slots__ help when creating many small objects?"
difficulty: easy
frequent: false
status: published
revision: 1
order: 111
tags: [python, oop, slots]
---

## Answer

Slots can avoid a per-instance dictionary and reduce memory overhead. The actual
benefit depends on the class and workload, and slots introduce restrictions.
