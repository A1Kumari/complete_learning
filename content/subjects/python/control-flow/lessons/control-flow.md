---
id: lesson-python-control-flow
kind: lesson
topicId: python-control-flow
title: Decisions and Loops
summary: Use conditions, pattern matching, iteration, and loop control to direct execution.
difficulty: easy
status: published
revision: 1
order: 20
tags: [python, control-flow]
prerequisiteIds: [lesson-python-fundamentals]
---

## Conditions and truthiness

`if`, `elif`, and `else` select one branch. Empty containers, zero, `None`, and `False` are falsey; most other objects are truthy. Prefer `value is None` when distinguishing a missing value from zero or an empty string.

```python
def describe(score):
    if score is None:
        return "missing"
    elif score >= 50:
        return "pass"
    return "retry"
```

## Iteration and loop control

`for` consumes an iterable; `while` repeats while its condition is true. `break` exits the nearest loop and `continue` starts its next iteration. A loop's `else` runs when the loop finishes normally, including when it has zero iterations, but not after `break`.

```python
for item in [2, 4, 7]:
    if item % 2:
        print("found", item)
        break
else:
    print("no odd number")
```

## Pattern matching

Python 3.10 introduced `match`/`case` for structural patterns, including sequences and mappings. A bare name in a pattern captures a value rather than comparing against a variable. Use literal patterns, qualified constants, and optional `if` guards when appropriate.

## Practice

Find the first negative number in a sequence and report when none exists. Trace the result for an empty sequence and for one containing zero.
