---
id: lesson-python-typing-validation
kind: lesson
topicId: python-typing-validation
title: Type Hints and Runtime Validation
summary: Express interfaces with Python typing and validate external data at runtime.
difficulty: medium
status: published
revision: 1
order: 120
tags: [python, typing, validation]
prerequisiteIds: [lesson-python-oop]
---

## Annotations describe expectations

Type hints document expected inputs and outputs and enable static tools such as mypy or Pyright. Python generally does not enforce them at runtime. Built-in generics such as `list[str]` and unions such as `str | None` are available in modern Python; check your supported Python version.

```python
from typing import Protocol, TypedDict, Literal

class User(TypedDict):
    name: str
    role: Literal["admin", "reader"]

class Notifier(Protocol):
    def send(self, message: str) -> None: ...

def welcome(user: User, notifier: Notifier) -> None:
    notifier.send(f"Hello {user['name']}")
```

`Protocol` describes structural behavior; a class can satisfy it without inheriting from it. `TypedDict` describes dictionary shape to a type checker, not runtime validation. `Callable` describes callable signatures, and `TypeVar` expresses relationships between generic inputs and outputs.

## Validate boundaries

JSON, environment variables, and database responses can violate annotations. Explicit checks or validation libraries such as Pydantic can parse and validate them; choose whether coercion is acceptable and handle validation errors. Validation complements static checking and does not replace authorization or business rules.

## Practice

Define a protocol for a storage client, implement an in-memory fake, and validate that a received age is a nonnegative integer.
