---
id: lesson-python-fundamentals
kind: lesson
topicId: python-fundamentals
title: Python Values and Expressions
summary: Run Python code and use names, values, operators, conversions, and formatted output.
difficulty: easy
status: published
revision: 1
order: 10
tags: [python, fundamentals]
prerequisiteIds: []
---

## Running Python

Run a script with `python program.py`, or start the interactive interpreter with `python`. Python executes statements in order and indentation defines blocks. Use a virtual environment when installing project dependencies.

## Names, values, and types

Assignment binds a name to an object; it does not declare a fixed type. Common values include integers, floats, booleans, strings, and `None`. Use `type(value)` to inspect a type. Python is dynamically typed, but operations still require compatible values.

```python
name = "Ada"
years = 3
rate = 2.5
message = f"{name} has {years} years of experience"
print(message, years * rate)
```

Arithmetic includes `/` (true division), `//` (floor division), `%` (remainder), and `**` (power). Comparisons return booleans; `and`, `or`, and `not` combine conditions. Floating-point arithmetic is approximate; use `decimal.Decimal` when decimal precision is required.

## Conversion and input

`input()` returns a string. Convert explicitly with `int`, `float`, or `str`, and handle invalid input: `int("three")` raises `ValueError`. An f-string evaluates expressions inside braces; format specifiers such as `f"{rate:.2f}"` control presentation. Avoid using `eval` to parse input.

## Practice

Read a price and quantity, validate that both are nonnegative, then print the total to two decimal places. Explain why a name may be rebound to a different type.
