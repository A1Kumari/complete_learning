---
id: python-generator-return
kind: question
topicId: python-iterators-generators
lessonId: lesson-python-generator-functions
prompt: "What happens when a generator executes return 99?"
difficulty: medium
frequent: false
status: published
revision: 1
order: 32
tags: [python, generators]
---

## Answer

The generator finishes; `99` is available as the `value` of the resulting
`StopIteration`. It is not another yielded value, and a normal `for` loop does
not expose it.
