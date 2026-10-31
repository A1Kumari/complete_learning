---
id: lesson-python-generator-functions
kind: lesson
topicId: python-iterators-generators
title: Generator Functions and yield
summary: Learn how yield suspends and resumes execution, how generator objects maintain state, and how to handle exhaustion and cleanup.
difficulty: medium
status: published
revision: 1
order: 30
tags: [python, generators, yield, iteration]
prerequisiteIds: [lesson-python-building-custom-iterators]
---

## Where this lesson fits

**Intermediate Python · Iterators & Generators · Lesson 3 of 8**

In [Building Custom Iterators](building-custom-iterators.md), we tracked the
position of a traversal ourselves. A generator function lets Python preserve
the execution state for us. Examples use Python 3.

## 1. Why use a generator?

Our custom `CountUp` iterator needed a class, a position, `__iter__`,
`__next__`, and an exhaustion check. A generator can express the same sequence
with a function:

```python
def count_up(limit):
    for number in range(limit):
        yield number

for number in count_up(5):
    print(number)
# 0
# 1
# 2
# 3
# 4
```

`yield` produces a value and suspends the generator. When the consumer asks for
another value, execution resumes where it stopped. Python supplies the
iterator machinery and retains the function's local state.

## 2. `yield` versus `return`

An ordinary `return` ends a function invocation. A `yield` produces a value and
pauses the generator so that the same invocation can continue later:

```python
def get_number():
    print("Function started")
    yield 10
    print("After yield")

generator = get_number()
print(next(generator))  # Prints Function started, then 10.
try:
    next(generator)    # Prints After yield, then finishes.
except StopIteration:
    print("Generator exhausted")
```

A generator can also use `return`: it ends the generator rather than producing
another iteration value. We will inspect its optional return value shortly.

## 3. Calling a generator function

Calling a generator function creates a generator object; it does not execute
the function body yet. Execution begins when the object is advanced:

```python
def steps():
    print("Step 1")
    yield 10
    print("Step 2")
    yield 20
    print("Step 3")

g = steps()
print("Generator created")
print(next(g))
print(next(g))
try:
    next(g)
except StopIteration:
    print("Finished")
# Generator created
# Step 1
# 10
# Step 2
# 20
# Step 3
# Finished
```

The arguments to the call are evaluated normally, but the generator's body
waits until advancement. A `yield` in the function body makes it a generator
function even if that particular `yield` is on an unreachable path.

## 4. Local state survives suspension

```python
def counter():
    count = 0
    while count < 3:
        count += 1
        yield count

g = counter()
print(next(g))  # 1
print(next(g))  # 2
print(next(g))  # 3
```

Between calls, the generator retains its local variables, execution position,
and active control flow. It does not restart the function on each `next()`.
This replaces much of the explicit state management needed in a custom iterator.

## 5. Generators are iterators

The **generator function** is a function. Calling it creates a **generator
object**, which implements the iterator protocol:

```python
def numbers():
    yield 10
    yield 20

g = numbers()
print(iter(g) is g)  # True
print(next(g))       # 10
print(list(g))       # [20]
print(list(g))       # []
```

Each generator object is normally one-shot. Call the function again to create
another generator with independent state:

```python
def numbers():
    yield 1
    yield 2
    yield 3

a = numbers()
b = numbers()
print(next(a), next(a), next(b))  # 1 2 1
```

`next(numbers)` fails because `numbers` is a function, not the iterator it
creates. `next(numbers())` advances a newly created generator.

## 6. Multiple yields and early stopping

A generator can yield from different parts of its body, with or without a loop:

```python
def stages():
    print("Preparing")
    yield "Started"
    print("Performing expensive work")
    yield "Finished"

for stage in stages():
    print(stage)
    break
# Preparing
# Started
```

The second part does not execute because the consumer never resumes this
generator. Lazy execution can avoid unnecessary work, but it also means side
effects in unconsumed code might never occur.

## 7. Generator return values and exhaustion

Reaching the end or executing `return` completes a generator. `return value`
does not yield that value; it attaches it to the completion exception:

```python
def generate():
    yield 10
    yield 20
    return 99

g = generate()
print(next(g))  # 10
print(next(g))  # 20
try:
    next(g)
except StopIteration as error:
    print("Return value:", error.value)  # Return value: 99
```

A `for` loop handles normal exhaustion and does not expose the return value.
`yield from` can retrieve a delegated generator's return value; we will explore
it in the advanced generators lesson.

Do not explicitly raise `StopIteration` to finish a generator body. In modern
Python, an unhandled `StopIteration` escaping that body is converted into a
`RuntimeError`. Instead, use `return` or reach the end. Explicitly raising
`StopIteration` is appropriate inside a custom iterator's `__next__` method.

## 8. Loops and conditions

Generators can filter input without creating another list:

```python
def passing_marks(marks):
    for mark in marks:
        if mark >= 40:
            yield mark

print(list(passing_marks([35, 90, 20, 75, 55])))  # [90, 75, 55]
```

A loop iteration can yield more than once; execution pauses at each `yield`:

```python
def number_and_square(numbers):
    for number in numbers:
        yield number
        yield number * number

print(list(number_and_square([2, 3, 4])))  # [2, 4, 3, 9, 4, 16]
```

## 9. Lazy execution and memory

Generating one million values one at a time can avoid storing a million-element
output list:

```python
def generate_numbers(n):
    for number in range(n):
        yield number

numbers = generate_numbers(1_000_000)
print(next(numbers))  # 0
print(next(numbers))  # 1
```

This does not guarantee low memory use: a generator may retain large local
objects, and `list(generate_numbers(...))` materializes the output. Generators
also have overhead and are not automatically faster than lists. Choose based on
access patterns, memory requirements, and measurements.

## 10. File processing and cleanup

This generator reads matching lines incrementally:

```python
def error_lines(filename):
    with open(filename, encoding="utf-8") as file:
        for line in file:
            if "ERROR" in line:
                yield line.strip()

# Example: for line in error_lines("app.log"): print(line)
```

Calling `error_lines` creates the generator; the file opens when the body starts
on first advancement. While the generator is suspended inside `with`, the file
can remain open. Exhaustion exits the block, but if consumption stops early,
close the generator explicitly rather than relying on garbage collection:

```python
from contextlib import closing

# Continue after defining error_lines; app.log must exist.
with closing(error_lines("app.log")) as errors:
    first = next(errors, None)
    print(first)
# The generator is closed even when we stop after the first match.
```

Closing a started generator executes entered `finally` blocks:

```python
def resource_generator():
    print("Opening resource")
    try:
        yield 1
        yield 2
    finally:
        print("Cleaning up resource")

g = resource_generator()
print(next(g))  # Opening resource, then 1
g.close()       # Cleaning up resource
```

Closing a generator before it starts does not execute setup or cleanup code it
never entered. Resource lifetimes should be explicit when consumers may stop
early.

## 11. Inspect generator states

```python
import inspect

def numbers():
    yield 10
    yield 20

g = numbers()
print(inspect.getgeneratorstate(g))  # GEN_CREATED
next(g)
print(inspect.getgeneratorstate(g))  # GEN_SUSPENDED
next(g)
print(inspect.getgeneratorstate(g))  # GEN_SUSPENDED
try:
    next(g)
except StopIteration:
    pass
print(inspect.getgeneratorstate(g))  # GEN_CLOSED
```

After its last `yield`, the generator is still suspended until it resumes and
reaches the end, or is closed. `GEN_RUNNING` describes active execution.

## Common mistakes

- Assuming calling a generator function runs its body or creates a list.
- Expecting `next()` to restart execution, or an exhausted generator to reset.
- Confusing `yield value` with a generator's final `return value`.
- Raising `StopIteration` directly from a generator body.
- Assuming laziness always improves speed or eliminates all memory costs.
- Forgetting that unconsumed side effects might never run and resources may need cleanup.

## Check your understanding

1. [What happens when a generator function is called?](../questions/generator-call.md)
2. [Where does execution resume after `yield`?](../questions/generator-resume.md)
3. [What does `return 99` mean inside a generator?](../questions/generator-return.md)
4. [What does `iter(g) is g` mean for a generator?](../questions/generator-iterator.md)
5. [Why can a generator help process a large file?](../questions/generator-file-memory.md)

## Coding challenges

1. **Predict execution:** write a generator that sets `x = 1`, prints `Start`,
   yields `x`, adds 2, prints `Middle`, yields again, multiplies `x` by 3,
   prints `End`, and yields once more. Predict the interleaving of those prints
   with the caller's three `next()` calls before running it.
2. **Fibonacci:** implement `fibonacci(n)` that yields the first `n` values
   using two state variables. Check that `list(fibonacci(8))` is
   `[0, 1, 1, 2, 3, 5, 8, 13]` and test `n = 0`.
3. **Primes:** implement `primes(limit)` yielding primes below `limit` without
   storing all results. Check `list(primes(20))` gives
   `[2, 3, 5, 7, 11, 13, 17, 19]` and test limits below 2.

**Next:** [Generator Expressions & Lazy Pipelines](generator-expressions-lazy-pipelines.md)
covers expressions, memory behavior, and chained processing.
