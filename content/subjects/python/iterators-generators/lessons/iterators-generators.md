---
id: lesson-python-iterators-generators
kind: lesson
topicId: python-iterators-generators
title: Iterators and Generators
summary: Consume iterables and build lazy pipelines with iterator and generator protocols.
difficulty: medium
status: published
revision: 1
order: 90
tags: [python, iterators, generators]
prerequisiteIds: [lesson-python-functions-scope]
---

## The iteration protocol

An iterable provides an iterator through `iter(value)`. An iterator returns itself from `__iter__` and produces values from `__next__`, raising `StopIteration` when exhausted. A `for` loop handles this protocol automatically. A list is reusable; an iterator over it is generally consumed once.

```python
def squares(limit):
    for number in range(limit):
        yield number * number

stream = squares(4)
print(next(stream))  # 0
print(list(stream)) # [1, 4, 9]
```

## Lazy evaluation

Calling a generator function returns a generator without executing its body immediately. Each `yield` suspends execution until the next request. A generator expression, such as `(x * x for x in values)`, similarly produces values on demand. This can reduce memory consumption, but it shifts work and errors to iteration time.

`yield from iterable` delegates iteration to another iterable and, for generators, forwards values and exceptions according to the delegation protocol. If a generator owns a resource, make its lifetime explicit and close it when abandoning it early.

## Practice

Build a generator that yields nonempty lines from a file. Compare its memory behavior with `readlines()` and explain what happens on a second traversal.
