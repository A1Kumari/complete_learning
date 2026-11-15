---
id: lesson-python-metaprogramming
kind: lesson
topicId: python-metaprogramming
title: Introspection and Metaprogramming
summary: Inspect objects and understand descriptors, attribute hooks, and class creation.
difficulty: hard
status: published
revision: 1
order: 170
tags: [python, metaprogramming]
prerequisiteIds: [lesson-python-data-model]
---

## Inspecting objects

`type`, `isinstance`, `getattr`, `hasattr`, and the `inspect` module help examine objects and call signatures. Introspection can support debugging and plugins, but normal explicit interfaces are often simpler and easier to test. Attribute access can run user-defined code; `hasattr` is not a side-effect-free schema check.

## Descriptors and hooks

A descriptor defines methods such as `__get__`, `__set__`, or `__delete__`; properties, methods, and many framework fields use this protocol. `__getattr__` handles missing attributes, while `__getattribute__` intercepts normal attribute access and must delegate carefully to avoid recursion.

```python
class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius

    @property
    def fahrenheit(self):
        return self.celsius * 9 / 5 + 32
```

Classes are objects too. `type(name, bases, namespace)` can create one dynamically; metaclasses customize class creation. Prefer class decorators or `__init_subclass__` for simpler registration tasks when sufficient. Metaclass conflicts can complicate multiple inheritance.

## Dynamic execution

`eval` evaluates an expression and `exec` executes statements. Never pass untrusted input to them; limiting globals is not a reliable security sandbox. Use explicit parsing or a constrained data format instead.

## Practice

Use a property to validate an assignment, then explain when a descriptor would be preferable for sharing validation across classes.
