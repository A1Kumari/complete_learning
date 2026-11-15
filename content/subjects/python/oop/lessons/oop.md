---
id: lesson-python-oop
kind: lesson
topicId: python-oop
title: Classes and Object-Oriented Design
summary: Build classes, use inheritance and composition, and model data with dataclasses.
difficulty: medium
status: published
revision: 1
order: 70
tags: [python, oop]
prerequisiteIds: [lesson-python-functions-scope]
---

## Classes and instances

A class defines behavior shared by its instances. `__init__` initializes an instance; methods receive that instance as `self`. Instance attributes belong to each object, while class attributes are shared unless shadowed. A leading underscore signals an internal interface by convention; it is not access control.

```python
from dataclasses import dataclass, field

@dataclass
class Cart:
    items: list[str] = field(default_factory=list)

    def add(self, item: str) -> None:
        self.items.append(item)
```

`dataclass` can generate initialization and equality methods. `default_factory` gives each cart its own list. Use properties when an attribute needs controlled access without changing callers.

## Inheritance and composition

Inheritance expresses a genuine subtype relationship; composition combines objects with focused responsibilities. Polymorphism lets clients use different objects through compatible behavior, often without a shared base class. Abstract base classes can express required methods, but Python also supports structural interfaces.

For multiple inheritance, the method resolution order (MRO) determines lookup order. Inspect `Class.__mro__`; cooperative methods call `super()` so the next implementation in that order can participate. Prefer composition when inheritance introduces fragile coupling.

## Practice

Model an order that uses a separate pricing strategy. Explain why two `Cart` instances must not share the same default list.
