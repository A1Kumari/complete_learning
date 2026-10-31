---
id: lesson-python-iteration-fundamentals
kind: lesson
topicId: python-iterators-generators
title: Iteration Fundamentals
summary: Understand iterables and iterators, iter and next, StopIteration, for loops, exhaustion, and incremental processing.
difficulty: easy
status: published
revision: 1
order: 10
tags: [python, iteration, iterators, generators]
---

## Where this lesson fits

**Intermediate Python · Iterators & Generators · Lesson 1 of 8**

We are studying iteration after OOP and before the Python Data Model. Basic
variables, loops, and functions are useful prerequisites; the class and
generator examples near the end are previews. Examples use Python 3.

The planned progression is:

1. **Iteration Fundamentals** — iterables, iterators, `iter`, `next`, and loops.
2. [**Building Custom Iterators**](building-custom-iterators.md) — `__iter__`, `__next__`, state, and reusable iterables.
3. [**Generator Functions**](generator-functions.md) — `yield`, suspension, preserved state, and exhaustion.
4. [**Generator Expressions & Lazy Pipelines**](generator-expressions-lazy-pipelines.md) — expressions, chaining, and streaming.
5. **Advanced Generators** — `send`, `throw`, `close`, and `yield from`.
6. **itertools & Iteration Utilities** — tools such as `chain`, `islice`, and `groupby`.
7. **Practical Iteration Patterns** — files, batching, pagination, and performance.
8. **Pitfalls, Design & Practice** — consumption, shared state, edge cases, and exercises.

Lessons 1–4 are published; Lessons 5–8 are planned.

## 1. Why do iterators exist?

The same `for` syntax can traverse a list, a string, a range, or a file:

```python
numbers = [10, 20, 30, 40]
for number in numbers:
    print(number)
# 10
# 20
# 30
# 40
```

These objects store or produce values differently. Python's iteration protocol
provides a common way to request successive values: the object supplies an
iterator, and the loop repeatedly asks that iterator for its next value.

## 2. Iterable versus iterator

An **iterable** is an object from which Python can obtain an iterator. Examples
include lists, tuples, strings, dictionaries, sets, ranges, and files. An
**iterator** produces successive values and keeps the state needed to know what
comes next.

An iterator's `__next__()` returns a value or raises `StopIteration`, and its
`__iter__()` returns the iterator itself. Therefore every iterator is also
iterable, but not every iterable is itself an iterator.

```python
numbers = [10, 20, 30]
iterator = iter(numbers)
print(type(numbers).__name__)   # list
print(type(iterator).__name__)  # list_iterator on CPython
print(next(iterator))           # 10
```

The list holds values; the iterator tracks a traversal. A list can provide
multiple independent iterators. Not every iterable is reusable: a generator
object, for example, is itself a one-shot iterator.

## 3. `iter()` and `next()`

`iter(iterable)` obtains an iterator. It does not itself consume the first
value. `next(iterator)` asks for one value and advances that iterator:

```python
numbers = [10, 20, 30]
iterator = iter(numbers)
print(next(iterator))  # 10
print(next(iterator))  # 20
print(next(iterator))  # 30
# Another next(iterator) raises StopIteration.
```

For ordinary modern iterables, `iter()` uses the iteration protocol involving
`__iter__`. Python also supports a legacy sequence-style `__getitem__` fallback
for some objects without `__iter__`; checking only for an `__iter__` attribute
does not identify every object Python can iterate.

## 4. `StopIteration` and `for` loops

`StopIteration` is the normal signal that an iterator has no more values. An
unhandled manual `next()` call displays it as an exception; a `for` loop handles
normal exhaustion and finishes. Conceptually, this:

```python
for number in [10, 20, 30]:
    print(number)
```

behaves like:

```python
iterator = iter([10, 20, 30])
while True:
    try:
        number = next(iterator)
    except StopIteration:
        break
    print(number)
# 10
# 20
# 30
```

The interpreter does not literally rewrite the loop as this Python code. The
`try` surrounds only the request for the next value: exceptions raised by the
loop body are not the same as normal iterator exhaustion.

When an index is useful, `enumerate` supplies one along with each value:

```python
for index, name in enumerate(["Alice", "Bob", "Charlie"]):
    print(index, name)
# 0 Alice
# 1 Bob
# 2 Charlie
```

## 5. Exhaustion and independent iterators

An exhausted finite iterator normally stays exhausted. Iterating over it again
does not reset it:

```python
iterator = iter([10, 20, 30])
print(list(iterator))  # [10, 20, 30]
print(list(iterator))  # []
```

Ask a reusable list for a fresh iterator to traverse it again. Calling `iter`
on an existing iterator, however, returns the same iterator:

```python
numbers = [10, 20, 30]
a = iter(numbers)
b = iter(numbers)
c = iter(a)
print(a is b)  # False: independent traversals
print(a is c)  # True: shared state
print(next(a), next(a), next(b), next(c))  # 10 20 10 30
```

Not every iterator is finite. Some can produce values indefinitely, so avoid
blindly converting an unknown iterator to a list.

## 6. A default for `next()`

`next(iterator, default)` returns the default instead of raising
`StopIteration` when the iterator is exhausted:

```python
iterator = iter([10, 20])
print(next(iterator, None))  # 10
print(next(iterator, None))  # 20
print(next(iterator, None))  # None
```

If `None` could be a real value, use a unique sentinel to distinguish it from
exhaustion:

```python
missing = object()
iterator = iter([None])
value = next(iterator, missing)
print(value is None)  # True: a real element
value = next(iterator, missing)
print(value is missing)  # True: no element remains
```

You can also request the first matching value without building a full list:

```python
numbers = [10, 50, 150, 200]
result = next((number for number in numbers if number > 100), None)
print(result)  # 150
```

The expression inside `next` is a generator expression, covered later.

## 7. Common iterables and iterators

| Object | Iterable? | Iterator? |
| --- | --- | --- |
| List, tuple, string, dictionary, set, or range | Yes | No |
| `iter([1, 2])` | Yes | Yes |
| `enumerate(...)`, `zip(...)`, or `map(...)` | Yes | Yes |
| Generator object | Yes | Yes |

Calling `next([1, 2])` raises `TypeError` because a list is not itself an
iterator. Use `next(iter([1, 2]))` instead. Repeatedly writing
`next(iter(numbers))` on a list creates a fresh traversal each time, so save
the iterator when you want to advance through it.

## 8. Iterating over dictionaries

A dictionary iterates over keys by default; views provide values or pairs:

```python
student = {"name": "Alice", "age": 20, "marks": 90}
print(list(student))           # ['name', 'age', 'marks']
print(list(student.values()))  # ['Alice', 20, 90]
for key, value in student.items():
    print(key, value)
# name Alice
# age 20
# marks 90
```

`keys()`, `values()`, and `items()` return iterable views that reflect changes
to the dictionary; they are not themselves the traversal iterator. Changing a
dictionary's size while iterating can raise `RuntimeError`. Mutating a list
during traversal can also produce surprising results.

## 9. Incremental processing and memory

`range(10_000_000)` represents a numerical sequence compactly; it does not
construct a list of ten million integers. Its iterator supplies values as they
are requested. By contrast, `list(range(10_000_000))` materializes a list.

File iteration can process lines without loading the whole file into one string:

```python
from io import StringIO

with StringIO("first line\nsecond line\n") as file:
    for line in file:
        print(line.rstrip("\n"))
# first line
# second line
```

For a real file, use `with open("large_file.txt", encoding="utf-8") as file:`
and the same loop. Line-by-line processing avoids loading the entire file at
once, although a single very large line and buffering still use memory.
Iterating over an already-created list does not remove the memory used by that
list. Laziness depends on how the underlying producer works.

## 10. Preview: custom iterators and generators

An iterator class can explicitly keep its position:

```python
class CountUp:
    def __init__(self, limit):
        self.limit = limit
        self.current = 0

    def __iter__(self):
        return self

    def __next__(self):
        if self.current >= self.limit:
            raise StopIteration
        value = self.current
        self.current += 1
        return value

print(list(CountUp(3)))  # [0, 1, 2]
```

A generator function can express the same sequence more simply:

```python
def count_up(limit):
    for number in range(limit):
        yield number

print(list(count_up(3)))  # [0, 1, 2]
```

Calling `count_up` returns a generator object, which is an iterator. `yield`
suspends the function and preserves its state until the next request. We will
build custom iterators in the next planned lesson, then explore generators.

## Common mistakes

- Confusing an iterable, such as a list, with the iterator traversing it.
- Calling `next()` directly on an object that is iterable but not an iterator.
- Expecting an exhausted iterator to restart or `iter(iterator)` to copy it.
- Assuming every iterator is finite or that iteration requires indexing.
- Treating normal `StopIteration` at the iterator boundary as an unexpected failure.
- Assuming every iterator removes the memory cost of its underlying data.

## Check your understanding

1. [What does `iter()` return for an existing iterator?](../questions/iter-existing-iterator.md)
2. [How does an iterator signal exhaustion?](../questions/stop-iteration.md)
3. [What happens when an exhausted iterator is reused?](../questions/exhausted-iterator.md)
4. [Why does Python have an iterator protocol?](../questions/iterator-protocol-purpose.md)

## Coding challenge

Predict the output before running this code:

```python
numbers = [10, 20, 30, 40]
a = iter(numbers)
b = iter(numbers)
c = iter(a)
print(next(a))
print(next(b))
print(next(c))
print(next(a))
print(next(b))
```

`a` and `c` share one traversal; `b` has its own. The output is `10`, `10`,
`20`, `30`, `20`, each on its own line.

**Next:** [Building Custom Iterators](building-custom-iterators.md) covers state,
`__iter__`, `__next__`, and reusable iterables.
