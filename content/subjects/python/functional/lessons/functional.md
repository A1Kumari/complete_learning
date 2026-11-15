---
id: lesson-python-functional
kind: lesson
topicId: python-functional
title: Functional Tools in Python
summary: Compose functions, lazy transformations, partial application, and iterator utilities.
difficulty: medium
status: published
revision: 1
order: 100
tags: [python, functional]
prerequisiteIds: [lesson-python-iterators-generators]
---

## Functions as values

A higher-order function accepts or returns a function. A `lambda` creates a small anonymous expression; use a named function when logic deserves a name or multiple statements. `map` and `filter` produce iterators in Python 3, so results are computed as they are consumed. Comprehensions can express many transformations more clearly.

```python
from functools import partial, reduce
from itertools import islice

def scale(value, factor):
    return value * factor

double = partial(scale, factor=2)
values = map(double, range(10))
print(list(islice(values, 3)))  # [0, 2, 4]
print(reduce(lambda total, x: total + x, [1, 2, 3], 0))
```

## Tools and tradeoffs

`functools.partial` binds some arguments for later calls. `reduce` folds a sequence into one value; for sums prefer the clearer built-in `sum`. `itertools` supplies composable iterator tools such as `chain`, `islice`, and `groupby`. `groupby` groups adjacent equal keys, so sort first when all equal keys must form one group.

Pure functions avoid hidden side effects and are easier to test, but Python does not enforce purity. Avoid long chains whose deferred work or errors are hard to understand.

## Practice

Filter positive measurements, convert their units with a function, and compute their sum without materializing an intermediate list.
