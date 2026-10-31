---
id: lesson-python-generator-expressions-pipelines
kind: lesson
topicId: python-iterators-generators
title: Generator Expressions & Lazy Pipelines
summary: Compare eager lists and generator expressions, build pull-driven pipelines, and understand consumption, resource lifetime, and infinite sources.
difficulty: medium
status: published
revision: 1
order: 40
tags: [python, generators, lazy-evaluation, pipelines]
prerequisiteIds: [lesson-python-generator-functions]
---

## Where this lesson fits

**Intermediate Python · Iterators & Generators · Lesson 4 of 8**

In [Generator Functions and yield](generator-functions.md), we learned how
generators suspend and resume. Now we will use generator expressions to connect
small processing steps without necessarily building intermediate lists. Examples
use Python 3.9 or later where `str.removeprefix` is used.

## 1. List comprehensions and generator expressions

A list comprehension eagerly constructs a list. A generator expression creates
an iterator that normally computes each result when requested:

```python
numbers = [1, 2, 3, 4, 5, 6]
eager = [x * x for x in numbers if x % 2 == 0]
lazy = (x * x for x in numbers if x % 2 == 0)
print(eager)       # [4, 16, 36]
print(next(lazy))  # 4
print(list(lazy))  # [16, 36]
print(list(lazy))  # []
```

The list supports indexing and repeated traversal. The generator is a one-shot
iterator; a loop continues from its current position. `list(lazy)` consumes and
materializes the remaining results. Parentheses around a comprehension with a
`for` clause create a generator, not a tuple. To collect a tuple, use
`tuple(x * x for x in numbers)`.

## 2. What does lazy mean?

The transformation and filtering in a generator expression are generally
deferred until values are requested. A list comprehension evaluates them while
building the list:

```python
def square(x):
    print(f"Squaring {x}")
    return x * x

eager = [square(x) for x in [1, 2]]
print("List created")
lazy = (square(x) for x in [1, 2])
print("Generator created")
print(next(lazy))
# Squaring 1
# Squaring 2
# List created
# Generator created
# Squaring 1
# 1
```

There is an important qualification: the **leftmost iterable expression** is
evaluated and its iterator obtained when the generator expression is created.
The rest of the iteration, filters, and output expression are deferred:

```python
def get_numbers():
    print("Getting source")
    return [1, 2, 3]

def square(x):
    print(f"Squaring {x}")
    return x * x

g = (square(x) for x in get_numbers())
print("Generator created")
print(next(g))
# Getting source
# Generator created
# Squaring 1
# 1
```

If `get_numbers` were itself a generator function, calling it would create a
generator object without running its body. Errors or side effects in the
leftmost iterable expression can still occur immediately.

## 3. Filtering and execution order

To produce one result, a generator may examine several inputs. The filter is
checked before the output expression for each candidate:

```python
def is_even(x):
    print(f"Checking {x}")
    return x % 2 == 0

def square(x):
    print(f"Squaring {x}")
    return x * x

g = (square(x) for x in range(1, 6) if is_even(x))
print(next(g))
print(next(g))
# Checking 1
# Checking 2
# Squaring 2
# 4
# Checking 3
# Checking 4
# Squaring 4
# 16
```

Multiple `for` clauses behave like nested loops, left to right:

```python
pairs = ((x, y) for x in [1, 2] for y in ["A", "B"])
print(list(pairs))  # [(1, 'A'), (1, 'B'), (2, 'A'), (2, 'B')]
```

If an expression becomes hard to follow, use a named generator function with
`yield` instead.

## 4. Choosing between a list and a generator

| Feature | List comprehension | Generator expression |
| --- | --- | --- |
| Result | List | One-shot generator |
| Evaluation | Eager | Mostly deferred |
| Repeated traversal or indexing | Yes | Not directly |
| Intermediate output storage | Materialized | Produced on demand |

Use a list when you need a reusable collection, random access, or a stable
snapshot. Use a generator for incremental, one-pass processing. A generator
can retain large sources or local state, and converting it to a list materializes
the output. It is not automatically faster; measure when performance matters.
`sys.getsizeof` compares shallow object sizes and does not include all
referenced data, so it is not a complete process-memory measurement.

## 5. A pull-driven pipeline

Suppose we filter even numbers, square them, add one, and sum the results:

```python
numbers = range(1, 11)
evens = (x for x in numbers if x % 2 == 0)
squares = (x * x for x in evens)
results = (x + 1 for x in squares)
print(sum(results))  # 225
```

The stages avoid materializing intermediate result lists. The final consumer
pulls from `results`, which pulls from `squares`, which pulls from `evens`.
To produce the first result, the filter examines 1 and 2, then 2 becomes 4 and
finally 5. The next requested result is 17. `sum` consumes the entire finite
pipeline; a consumer that stops early may avoid later work.

## 6. Consumers and short-circuiting

```python
print(sum(x * x for x in range(1, 6)))  # 55
print(any(x > 100 for x in [10, 20, 150, 200]))  # True
print(all(x > 0 for x in [10, 20, -5, 30]))      # False
print(any([]), all([]))  # False True
```

`any` stops at the first truthy value; `all` stops at the first falsy value.
`sum`, `min`, and `max` generally consume a finite input to calculate their
results. `list` and `tuple` materialize all remaining values. These consumers
do not naturally finish on an infinite stream that keeps producing values.

When a generator expression is the sole argument, its extra parentheses can be
omitted, as with `sum(x * x for x in range(5))`. With additional arguments,
parenthesize it explicitly:

```python
students = [("Alice", 85), ("Bob", 92), ("Charlie", 96)]
top = next((student for student in students if student[1] > 90), None)
print(top)  # ('Bob', 92)
```

`next` stops at the first match. Choose a unique sentinel rather than `None` if
`None` could itself be a valid result.

## 7. Other iterator tools

`map`, `filter`, `zip`, and `enumerate` also return iterators in Python 3:

```python
numbers = [1, 2, 3]
print(list(map(lambda x: x * x, numbers)))  # [1, 4, 9]
print(list(x * x for x in numbers))         # [1, 4, 9]

pairs = zip(["Alice", "Bob", "Charlie"], [85, 90, 95])
print(next(pairs))  # ('Alice', 85)
print(list(pairs))  # [('Bob', 90), ('Charlie', 95)]
```

Choose the clearest expression for the operation. These iterators share the
same one-shot consumption model; later lessons cover more `itertools` tools.

## 8. Processing logs and resource lifetime

```python
logs = ["INFO Application started", "ERROR Database connection failed",
        "INFO Retrying", "ERROR Request timed out"]
errors = (line for line in logs if line.startswith("ERROR "))
messages = (line.removeprefix("ERROR ").strip() for line in errors)
print(list(messages))  # ['Database connection failed', 'Request timed out']
```

For a large file, use the same pipeline inside the file's context:

```python
# app.log must exist before running this example.
with open("app.log", encoding="utf-8") as file:
    errors = (line for line in file if line.startswith("ERROR "))
    messages = (line.removeprefix("ERROR ").strip() for line in errors)
    for message in messages:
        print(message)
```

Consume the pipeline while the file remains open. Creating a generator inside
`with` and iterating it after the block closes the file can raise `ValueError`.
Incremental processing avoids reading the whole file at once, but buffering
and exceptionally large lines can still use substantial memory.

## 9. Infinite sources

Bound consumption when a source does not naturally finish:

```python
from itertools import islice

def count_forever():
    number = 0
    while True:
        yield number
        number += 1

evens = (x for x in count_forever() if x % 2 == 0)
print(list(islice(evens, 5)))  # [0, 2, 4, 6, 8]
```

Calling `list(evens)` without a bound would keep consuming and accumulating
values. Even a bounded consumer can wait forever if a filter never finds
another matching value.

## 10. Common pitfalls

**One-shot consumption:** `list(g)` consumes the remaining values; a second
call normally returns `[]`. Passing a generator to multiple consumers shares
its position:

```python
numbers = (x for x in range(5))
print(next(numbers))  # 0
print(sum(numbers))   # 10: consumes 1, 2, 3, 4
```

**Late lookup:** expressions can read external variables when advanced, not
when the generator is created:

```python
factor = 10
g = (x * factor for x in [1, 2, 3])
factor = 100
print(next(g))  # 100
```

If the value must be fixed, pass it as an argument to a generator function when
creating that function's generator. Avoid hiding important side effects in
generator expressions: they occur only if the relevant values are consumed.

## Check your understanding

1. [What does a generator expression produce?](../questions/generator-expression-result.md)
2. [Which consumer stops at the first truthy value?](../questions/any-short-circuit.md)
3. [What happens when an exhausted generator is converted to a list?](../questions/exhausted-generator-list.md)
4. [Why can a lazy pipeline reduce memory use?](../questions/lazy-pipeline-memory.md)
5. [Why must a file stay open while a pipeline consumes it?](../questions/lazy-file-lifetime.md)

## Coding challenges

1. **Predict execution:** use a `process(x)` function that prints `Processing`
   and returns `x * 2`. Create `(process(x) for x in range(1, 5) if x % 2 == 0)`;
   print `A`, request one value, print `B`, consume the rest with `list`, and
   print `C`. Predict the output before running it.
2. **Build a pipeline:** filter `range(1, 101)` for multiples of 3, square
   them, and sum only squares below 1,000 without intermediate lists.
3. **Student records:** produce uppercase names for students with marks at least
   70. Use `next` with a default to find the first student above 90 without
   building a list; also test the case where no student qualifies.

**Next:** the planned Lesson 5, Advanced Generators, will cover `send`, `throw`,
`close`, `yield from`, and delegation. It is not yet published.
