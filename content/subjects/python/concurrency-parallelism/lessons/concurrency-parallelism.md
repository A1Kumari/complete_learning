---
id: lesson-python-concurrency-parallelism
kind: lesson
topicId: python-concurrency-parallelism
title: Threads, Processes, and Synchronization
summary: Choose concurrency tools and protect shared state from races and deadlocks.
difficulty: hard
status: published
revision: 1
order: 130
tags: [python, concurrency]
prerequisiteIds: [lesson-python-functions-scope]
---

## Concurrency versus parallelism

Concurrency coordinates overlapping tasks; parallelism executes work simultaneously. Threads share a process's memory and are useful for blocking I/O. Processes have separate address spaces and can execute CPU-bound Python work in parallel, at the cost of startup, serialization, and communication.

In conventional GIL-enabled CPython, only one thread executes Python bytecode at a time, though blocking I/O and some native extensions release the GIL. Free-threaded CPython builds and other implementations have different behavior. The GIL is not a substitute for synchronization.

## Executors and shared state

```python
from concurrent.futures import ThreadPoolExecutor

def square(value):
    return value * value

with ThreadPoolExecutor(max_workers=4) as executor:
    results = list(executor.map(square, range(5)))
```

Use `ProcessPoolExecutor` for suitable CPU-bound work; submitted functions and arguments generally need to be picklable, and a main guard is important when using process spawning. Measure overhead before choosing either executor.

A race occurs when correctness depends on interleaving. Protect a multi-step invariant with a lock; a semaphore limits concurrent access. Acquire locks in a consistent order and avoid holding them during slow I/O to reduce deadlock risk. Futures propagate task exceptions when their results are retrieved.

## Practice

Design a concurrent downloader with bounded workers and timeouts. Explain how you would protect a shared counter and shut workers down on failure.
