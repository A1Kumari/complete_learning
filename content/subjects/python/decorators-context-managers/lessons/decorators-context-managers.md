---
id: lesson-python-decorators-context-managers
kind: lesson
topicId: python-decorators-context-managers
title: Decorators and Context Managers
summary: Wrap functions and manage resources reliably with Python protocols.
difficulty: medium
status: published
revision: 1
order: 110
tags: [python, decorators, context-managers]
prerequisiteIds: [lesson-python-functions-scope]
---

## Decorators

A decorator takes a function and returns a replacement. `@decorate` above a definition is equivalent to assigning `function = decorate(function)`. A decorator factory takes configuration and returns a decorator. Stacked decorators apply from the bottom upward. Use `functools.wraps` to retain metadata and expose the wrapped function to introspection.

```python
from functools import wraps
from time import perf_counter

def timed(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        start = perf_counter()
        try:
            return fn(*args, **kwargs)
        finally:
            print(f"{fn.__name__}: {perf_counter() - start:.3f}s")
    return wrapper
```

## Context managers

`with` calls `__enter__` and guarantees `__exit__` after the block, including when the block raises. An `__exit__` return value that is truthy suppresses the exception, so suppress only errors you intentionally handle. `contextlib.contextmanager` lets a generator implement setup before `yield` and cleanup in `finally` after it.

Use context managers for files, locks, transactions, and temporary resources. A database transaction's commit and rollback behavior depends on its implementation.

## Practice

Write a context manager that temporarily changes a setting and restores it even when the block raises.
