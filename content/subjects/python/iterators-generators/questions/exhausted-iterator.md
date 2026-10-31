---
id: python-iteration-exhausted-iterator
kind: question
topicId: python-iterators-generators
lessonId: lesson-python-iteration-fundamentals
prompt: "What happens when you loop again over the same exhausted list iterator?"
difficulty: easy
frequent: false
status: published
revision: 1
order: 12
tags: [python, iterators]
---

## Answer

The second loop produces no values. To traverse the list again, obtain a fresh
iterator from the list; calling `iter` on the exhausted iterator returns itself.
