---
id: python-iteration-iter-return-value
kind: question
topicId: python-iterators-generators
lessonId: lesson-python-building-custom-iterators
prompt: "What must an iterable's __iter__ method return?"
difficulty: easy
frequent: false
status: published
revision: 1
order: 20
tags: [python, iterators]
---

## Answer

It must return an iterator. A list is iterable but is not itself an iterator;
return `iter(the_list)` instead. An iterator's own `__iter__` returns itself.
