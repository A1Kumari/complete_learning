---
id: lesson-python-async
kind: lesson
topicId: python-async
title: Asynchronous Python with asyncio
summary: Coordinate asynchronous I/O using coroutines, tasks, cancellation, and task groups.
difficulty: hard
status: published
revision: 1
order: 140
tags: [python, asyncio]
prerequisiteIds: [lesson-python-iterators-generators]
---

## Coroutines and the event loop

Calling an `async def` function creates a coroutine object; it does not execute until awaited or scheduled. An event loop runs tasks cooperatively, switching when a task awaits an operation that suspends. Blocking I/O or CPU-heavy code in the event-loop thread delays every task; use an asynchronous library or move appropriate blocking work to an executor.

```python
import asyncio

async def work(value):
    await asyncio.sleep(0.1)
    return value * 2

async def main():
    async with asyncio.TaskGroup() as group:
        first = group.create_task(work(1))
        second = group.create_task(work(2))
    print(first.result(), second.result())

asyncio.run(main())
```

`TaskGroup` is available in Python 3.11 and later. It waits for child tasks and cancels remaining siblings after a non-cancellation failure. `asyncio.gather` has different failure behavior, so choose deliberately. Futures represent eventual results; tasks are scheduled coroutines.

## Cancellation and cleanup

Cancellation is delivered at an await point as `CancelledError`. Use `try/finally` to release resources and normally re-raise cancellation. Set timeouts and limit concurrency with an async semaphore. Async generators use `async for` and can be explicitly closed when abandoned.

## Practice

Fetch several independent resources with a concurrency limit and a timeout. Describe what happens when one task fails inside a task group.
