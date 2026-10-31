---
id: python-generator-call
kind: question
topicId: python-iterators-generators
lessonId: lesson-python-generator-functions
prompt: "What happens when a generator function is called?"
difficulty: easy
frequent: false
status: published
revision: 1
order: 30
tags: [python, generators]
---

## Answer

It creates a generator object without executing the function body. The body
begins when the generator is advanced; call arguments are evaluated normally.
