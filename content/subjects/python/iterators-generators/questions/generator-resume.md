---
id: python-generator-resume
kind: question
topicId: python-iterators-generators
lessonId: lesson-python-generator-functions
prompt: "Where does a generator resume after yielding a value?"
difficulty: easy
frequent: false
status: published
revision: 1
order: 31
tags: [python, generators]
---

## Answer

It resumes after the suspended `yield` expression with its local state and
control flow preserved, rather than restarting the function.
