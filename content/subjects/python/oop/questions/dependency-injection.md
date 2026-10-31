---
id: python-oop-dependency-injection
kind: question
topicId: python-oop
lessonId: lesson-python-oop-composition-relationships
prompt: "Why can constructor dependency injection make a class easier to test and extend?"
difficulty: easy
frequent: false
status: published
revision: 1
order: 102
tags: [python, oop, dependency-injection]
---

## Answer

Dependencies are supplied from outside, allowing callers to provide different
implementations or test doubles. Injection alone does not determine whether the
receiving object owns or shares the dependency.
