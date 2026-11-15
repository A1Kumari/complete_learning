---
id: lesson-python-functions-scope
kind: lesson
topicId: python-functions-scope
title: Functions, Arguments, and Scope
summary: Design functions and understand argument binding, closures, and name lookup.
difficulty: easy
status: published
revision: 1
order: 40
tags: [python, functions]
prerequisiteIds: [lesson-python-control-flow]
---

## Defining functions

Functions are first-class objects: assign them to names, pass them as arguments, and return them. A function returns `None` if it reaches the end without a return value. Parameters can be positional-only (`/`), positional or keyword, or keyword-only (`*`). `*args` collects extra positional arguments and `**kwargs` collects extra keyword arguments.

```python
def add_item(item, items=None, *, prefix=""):
    if items is None:
        items = []
    items.append(f"{prefix}{item}")
    return items
```

Defaults are evaluated once at definition time. Avoid a mutable default when each call should start with a fresh container. Arguments bind local names to the same objects passed by the caller: mutation is observable, but rebinding a parameter does not rebind the caller's name.

## Scope and closures

Python looks up names in local, enclosing, global, then built-in scopes (LEGB). `global` allows rebinding a module name; `nonlocal` allows rebinding an enclosing function's name. Closures retain access to enclosing bindings, which are looked up when used rather than automatically copied.

## Recursion

Recursive functions need a base case and progress toward it. Python limits recursion depth and does not guarantee tail-call optimization; an iterative solution is often preferable for deep inputs.

## Practice

Write a counter factory using `nonlocal`, then explain why two counters have independent state.
