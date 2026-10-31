---
id: python-oop-bound-method-self
kind: question
topicId: python-oop
lessonId: lesson-python-oop-constructors-self
prompt: "When you call student.introduce(), how does an ordinary instance method receive the student object?"
difficulty: easy
frequent: false
status: published
revision: 1
order: 30
tags: [python, oop, methods]
---

## Answer

Python binds the instance to the method, so the call supplies `student` as the
first argument, conventionally called `self`. For a normal method defined on
`Student`, `student.introduce()` is conceptually like
`Student.introduce(student)`.
