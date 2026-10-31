---
id: lesson-python-building-custom-iterators
kind: lesson
topicId: python-iterators-generators
title: Building Custom Iterators
summary: Implement stateful iterators and reusable iterables, understand independent traversals, and build range-like and collection iterators.
difficulty: medium
status: published
revision: 1
order: 20
tags: [python, iteration, iterators]
prerequisiteIds: [lesson-python-iteration-fundamentals]
---

## Where this lesson fits

**Intermediate Python · Iterators & Generators · Lesson 2 of 8**

In [Iteration Fundamentals](iteration-fundamentals.md), we used `iter`, `next`,
and `StopIteration`. Now we will implement the protocol ourselves and learn
why independent traversals need independent state. Examples use Python 3.

## 1. Build a one-shot iterator

An iterator's `__iter__` returns itself. Its `__next__` returns the next value
or raises `StopIteration` when finished:

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

counter = CountUp(3)
print(iter(counter) is counter)  # True
print(next(counter))             # 0
print(list(counter))             # [1, 2]
print(list(counter))             # []
```

`current` is the **next** number to return. Each call captures that value,
advances the state, and returns it. A loop after a partial traversal continues
from the same position. Once a well-behaved finite iterator signals exhaustion,
subsequent calls should continue to raise `StopIteration`.

## 2. An iterable must return an iterator

An iterable's `__iter__` must return an iterator, not merely another iterable.
A list is iterable but is not itself an iterator:

```python
class BadCounter:
    def __iter__(self):
        return [1, 2, 3]

# iter(BadCounter()) raises TypeError: __iter__ returned a list.

class GoodCounter:
    def __iter__(self):
        return iter([1, 2, 3])

print(list(GoodCounter()))  # [1, 2, 3]
```

`GoodCounter` is a reusable iterable. It does not need `__next__`: its
`__iter__` supplies a separate list iterator on each traversal.

## 3. Separate the sequence from traversal state

For a reusable collection, keep the information describing the sequence in one
object and the position of each traversal in a separate iterator:

```python
class NumberIterator:
    def __init__(self, start, stop):
        self.current = start
        self.stop = stop

    def __iter__(self):
        return self

    def __next__(self):
        if self.current >= self.stop:
            raise StopIteration
        value = self.current
        self.current += 1
        return value

class NumberSequence:
    def __init__(self, start, stop):
        self.start = start
        self.stop = stop

    def __iter__(self):
        return NumberIterator(self.start, self.stop)

numbers = NumberSequence(1, 4)
print(list(numbers))  # [1, 2, 3]
print(list(numbers))  # [1, 2, 3]
a = iter(numbers)
b = iter(numbers)
print(a is b)                    # False
print(next(a), next(a), next(b))  # 1 2 1
```

`NumberSequence` stores the boundaries; each `NumberIterator` stores its own
position. A one-shot iterator describes a traversal in progress, while a
reusable iterable can supply independent traversals. A one-shot iterator need
not be finite: it may keep producing values indefinitely.

## 4. Why not reset `__iter__`?

Resetting a stateful iterator every time `iter()` is called breaks the expected
meaning of an iterator: consumers unexpectedly lose their place. For example,
if `__iter__` assigns `self.current = 0` before returning `self`, calling
`iter(counter)` after consuming two values silently restarts it. It can even
make an exhausted iterator produce values again.

For repeatable traversal, return a **new iterator** from a separate iterable
instead. This also fixes nested loops. With the `NumberSequence` above:

```python
# Continue after defining NumberSequence above.
numbers = NumberSequence(0, 3)
pairs = [(outer, inner) for outer in numbers for inner in numbers]
print(pairs)
# [(0, 0), (0, 1), (0, 2), (1, 0), (1, 1), (1, 2), (2, 0), (2, 1), (2, 2)]
```

Each inner loop gets a fresh iterator. In contrast, two loops using the same
`CountUp(3)` iterator share a position: the outer loop takes `0`, the inner
loop consumes `1` and `2`, and the outer loop then ends. Sharing a stream can
be intentional, but it is not independent traversal.

## 5. Build a range-like iterable

This simplified `MyRange(start, stop, step)` supports positive and negative
steps with an exclusive stop. It assumes integer arguments and is not a full
replacement for built-in `range`:

```python
class MyRangeIterator:
    def __init__(self, start, stop, step):
        if step == 0:
            raise ValueError("Step cannot be zero")
        self.current = start
        self.stop = stop
        self.step = step

    def __iter__(self):
        return self

    def __next__(self):
        if self.step > 0 and self.current >= self.stop:
            raise StopIteration
        if self.step < 0 and self.current <= self.stop:
            raise StopIteration
        value = self.current
        self.current += self.step
        return value

class MyRange:
    def __init__(self, start, stop, step=1):
        if step == 0:
            raise ValueError("Step cannot be zero")
        self.start = start
        self.stop = stop
        self.step = step

    def __iter__(self):
        return MyRangeIterator(self.start, self.stop, self.step)

numbers = MyRange(2, 10, 2)
print(list(numbers))              # [2, 4, 6, 8]
print(list(numbers))              # [2, 4, 6, 8]
print(list(MyRange(10, 0, -3)))   # [10, 7, 4, 1]
print(list(MyRange(5, 5)))        # []
print(list(MyRange(5, 0, 1)))     # []
# MyRange(0, 5, 0) raises ValueError.
```

The iterable stores configuration; each iterator stores its own next value.
Neither stores the entire generated sequence. Built-in `range` additionally
supports length, indexing, membership, and other operations; use it unless a
custom implementation serves a real purpose.

## 6. Iterating over a custom collection

A separate iterator can traverse existing data:

```python
class BookShelfIterator:
    def __init__(self, books):
        self.books = books
        self.index = 0

    def __iter__(self):
        return self

    def __next__(self):
        if self.index >= len(self.books):
            raise StopIteration
        book = self.books[self.index]
        self.index += 1
        return book

class BookShelf:
    def __init__(self, books):
        self._books = list(books)

    def __iter__(self):
        return BookShelfIterator(self._books)

shelf = BookShelf(["1984", "Dune", "The Hobbit"])
print(list(shelf))  # ['1984', 'Dune', 'The Hobbit']
```

The iterator holds a reference to the underlying list. Changes during
traversal may affect what it sees. A snapshot design could pass
`self._books.copy()` instead; that copies the list of references, not the book
objects themselves. Another design could detect modifications and fail. Choose
and document the policy.

For this simple shelf, `return iter(self._books)` would usually be clearer than
writing `BookShelfIterator` at all. Use custom machinery when it adds useful
behavior.

## 7. The older `__getitem__` fallback

Python can iterate over some objects without `__iter__`, using the older
sequence-style `__getitem__` protocol. It requests integer indexes starting at
zero until `IndexError`:

```python
class Squares:
    def __getitem__(self, index):
        if index >= 4:
            raise IndexError
        return index ** 2

print(list(Squares()))  # [0, 1, 4, 9]
```

`Squares` is not itself an iterator; Python obtains a sequence iterator to
track the index. An explicit `__iter__ = None` disables this fallback. Modern
custom collections generally benefit from an explicit `__iter__` because it
makes the intended interface clearer.

## 8. Infinite iterators and protocol checks

An iterator can represent an ongoing process rather than a stored collection:

```python
from itertools import islice

class Fibonacci:
    def __init__(self):
        self.a, self.b = 0, 1

    def __iter__(self):
        return self

    def __next__(self):
        value = self.a
        self.a, self.b = self.b, self.a + self.b
        return value

print(list(islice(Fibonacci(), 8)))  # [0, 1, 1, 2, 3, 5, 8, 13]
```

This iterator never signals exhaustion; use a bound such as `islice` or a
`break`. It stores two current numbers rather than the whole history, although
the numbers themselves grow in size as the sequence grows.

`collections.abc.Iterable` and `Iterator` can help identify ordinary protocol
implementations, but `isinstance(obj, Iterable)` misses some objects using the
legacy `__getitem__` fallback. Trying `iter(obj)` is the direct test of whether
Python can obtain an iterator. Method presence alone does not guarantee correct
behavior.

## Common mistakes

- Returning a list from `__iter__` instead of an iterator.
- Forgetting to signal and maintain exhaustion for a finite iterator.
- Resetting a one-shot iterator inside `__iter__`.
- Sharing one traversal state when independent or nested traversals are needed.
- Advancing state incorrectly or leaving collection mutation behavior unclear.
- Implementing a custom iterator when an existing iterator or generator is simpler.

## Check your understanding

1. [What must an iterable's `__iter__` return?](../questions/iter-return-value.md)
2. [Why should a reusable collection create fresh iterators?](../questions/independent-traversals.md)
3. [How should a finite iterator signal exhaustion?](../questions/custom-iterator-exhaustion.md)
4. [What happens when a one-shot iterator is traversed twice?](../questions/one-shot-traversal.md)

## Coding challenges

### 1. Predict the output

```python
class Counter:
    def __init__(self):
        self.x = 0

    def __iter__(self):
        return self

    def __next__(self):
        if self.x >= 3:
            raise StopIteration
        self.x += 1
        return self.x

a = Counter()
b = iter(a)
print(next(a))
print(next(b))
print(list(a))
print(list(b))
```

`a` and `b` are the same iterator. The outputs are `1`, `2`, `[3]`, and `[]`.

### 2. Reverse a sequence

Create a reusable `ReverseSequence` that takes a list and produces its elements
in reverse using a separate iterator class. Verify that two consecutive
traversals of `[10, 20, 30]` both produce `[30, 20, 10]`, and test an empty list.

### 3. Traverse a binary tree

Implement an inorder iterator over a binary search tree using a stack. Return
one value per `next` call rather than preparing the entire traversal. Test an
empty tree, a single node, and a tree with inorder values `1, 3, 6, 8, 10`.

**Next:** [Generator Functions and `yield`](generator-functions.md) explores
suspension, state preservation, and how generators simplify iterator code.
