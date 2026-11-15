---
id: lesson-python-data-model
kind: lesson
topicId: python-data-model
title: Python's Object Protocols
summary: Understand identity, equality, hashing, special methods, and attribute lookup.
difficulty: medium
status: published
revision: 1
order: 80
tags: [python, data-model]
prerequisiteIds: [lesson-python-oop]
---

## Identity, equality, and mutation

`is` compares object identity; `==` asks objects to compare values through their equality protocol. Use `is None` for the singleton sentinel. Names reference objects, and changing a mutable object is visible through every alias. Immutable containers can still refer to mutable objects.

## Special methods and protocols

Operations dispatch to special methods: `len(x)` uses `__len__`, iteration uses `__iter__`, and arithmetic can use `__add__` and its reflected counterpart. Implement only behavior that has a clear meaning for your type. Returning `NotImplemented` from an unsupported binary operation lets Python try the other operand's implementation.

```python
class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __eq__(self, other):
        if not isinstance(other, Point):
            return NotImplemented
        return (self.x, self.y) == (other.x, other.y)
```

Equal hashable objects must have equal hashes, and their hash must remain stable while used as dictionary keys or set members. Defining equality on a mutable class normally makes it unhashable unless hashing is explicitly supplied.

## Attribute lookup

Instance lookup considers data descriptors, the instance dictionary, and class attributes along the MRO, including non-data descriptors. `__getattribute__` intercepts normal access; `__getattr__` handles missing attributes. Properties are descriptors.

## Practice

Explain why two equal lists are not necessarily identical, and why a mutable list cannot serve as a dictionary key.
