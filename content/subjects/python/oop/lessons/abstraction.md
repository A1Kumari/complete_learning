---
id: lesson-python-oop-abstraction
kind: lesson
topicId: python-oop
title: Abstraction in Python
summary: Design clear interfaces with abstract base classes, abstract methods and properties, and structurally typed protocols.
difficulty: medium
status: published
revision: 1
order: 80
tags: [python, oop, abstraction, protocols]
prerequisiteIds: [lesson-python-oop-polymorphism]
---

## Where this lesson fits

**Intermediate Python · OOP · Lesson 8 of 12**

In [Polymorphism in Python](polymorphism.md), we used a common operation with
different objects. Abstraction helps us describe that operation without making
callers depend on the details of each implementation. Examples use Python 3.

## 1. What is abstraction?

Abstraction exposes the functionality callers need while hiding unnecessary
implementation details. For example, a checkout function can request
`payment.pay(amount)` without knowing how a card, UPI, or wallet implementation
performs its work:

```python
class CreditCard:
    def pay(self, amount):
        print(f"Card payment: {amount}")

class UPI:
    def pay(self, amount):
        print(f"UPI payment: {amount}")

def checkout(payment, amount):
    payment.pay(amount)

checkout(CreditCard(), 500)  # Card payment: 500
checkout(UPI(), 500)         # UPI payment: 500
```

The caller depends on the common `pay` operation rather than a branch for each
payment type. This ordinary function already provides abstraction; an abstract
class is one optional way to describe and partially enforce a contract.

## 2. Abstract base classes

Python's standard-library `abc` module provides `ABC` and `abstractmethod`:

```python
from abc import ABC, abstractmethod

class Payment(ABC):
    @abstractmethod
    def pay(self, amount):
        pass

class UPIPayment(Payment):
    def pay(self, amount):
        print(f"Paid Rs {amount} using UPI")

payment = UPIPayment()
payment.pay(500)  # Paid Rs 500 using UPI
# Payment() raises TypeError because pay is still abstract.
```

`Payment` defines an abstract member. A conventional subclass remains abstract
until its remaining abstract members have concrete replacements. Defining an
incomplete subclass is allowed, but trying to instantiate it normally raises
`TypeError`. Inheriting from `ABC` alone does not prevent instantiation: the
class must actually have unresolved abstract members.

The ABC machinery checks abstract status, not whether a replacement has the
right signature or meaningful behavior. A `pay(self)` method can clear the
abstract marker but still fail when called with an amount. Use static checking
and tests to check the intended contract. Virtual subclasses registered with
an ABC are another distinct mechanism and do not acquire these inherited-method
or instantiation checks automatically.

## 3. Shared and abstract behavior together

An abstract base class may have a constructor, attributes, and ordinary
methods alongside abstract ones:

```python
from abc import ABC, abstractmethod

class Employee(ABC):
    def __init__(self, name, salary):
        self.name = name
        self.salary = salary

    def show_details(self):
        print(f"Employee: {self.name}")
        print(f"Salary: {self.salary}")

    @abstractmethod
    def calculate_bonus(self):
        pass

class Developer(Employee):
    def calculate_bonus(self):
        return self.salary * 0.10

class Manager(Employee):
    def calculate_bonus(self):
        return self.salary * 0.20

dev = Developer("Alice", 50000)
manager = Manager("Bob", 80000)
dev.show_details()
print(dev.calculate_bonus())      # 5000.0
manager.show_details()
print(manager.calculate_bonus())  # 16000.0
```

Both subclasses inherit initialization and `show_details`, while each supplies
its own bonus calculation. This is a simplified numeric example.

## 4. Abstract methods can contain code

Marking a method abstract does not require an empty body. A subclass can
provide a concrete override and call shared behavior with `super()`:

```python
from abc import ABC, abstractmethod

class Report(ABC):
    @abstractmethod
    def generate(self):
        print("Preparing report...")

class PDFReport(Report):
    def generate(self):
        super().generate()
        print("Generating PDF content")

PDFReport().generate()
# Preparing report...
# Generating PDF content
```

`Report` remains abstract even though its method has a body. If subclasses do
not need to override a shared method, an ordinary concrete method is simpler.

## 5. Abstract properties

An abstract property can describe a value that concrete subclasses should
provide. Place `@abstractmethod` closest to the function:

```python
from abc import ABC, abstractmethod
import math

class Shape(ABC):
    @property
    @abstractmethod
    def area(self):
        pass

class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height

    @property
    def area(self):
        return self.width * self.height

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius

    @property
    def area(self):
        return math.pi * self.radius ** 2

def display_area(shape):
    print(f"Area: {shape.area}")

display_area(Rectangle(4, 5))  # Area: 20
display_area(Circle(3))        # Area: 28.274333882308138
```

The formulas are width × height and π × radius². ABC machinery does not fully
verify that a replacement preserves property semantics: a different concrete
attribute can satisfy the abstract name. The examples also omit dimension
validation for clarity.

## 6. Abstract class methods and static methods

Put `@abstractmethod` inside `@classmethod` or `@staticmethod` as well:

```python
from abc import ABC, abstractmethod

class Parser(ABC):
    @classmethod
    @abstractmethod
    def from_text(cls, text):
        pass

class NumberParser(Parser):
    def __init__(self, value):
        self.value = value

    @classmethod
    def from_text(cls, text):
        return cls(int(text))

print(NumberParser.from_text("123").value)  # 123
```

```python
from abc import ABC, abstractmethod

class DataFormat(ABC):
    @staticmethod
    @abstractmethod
    def is_valid(data):
        pass

class IntegerFormat(DataFormat):
    @staticmethod
    def is_valid(data):
        try:
            int(data)
            return True
        except ValueError:
            return False

print(IntegerFormat.is_valid("123"))    # True
print(IntegerFormat.is_valid("hello"))  # False
```

The validator assumes string input; other input types can raise `TypeError`.

## 7. Interfaces and protocols

An interface describes operations callers can rely on. Python has no separate
`interface` keyword; ABCs, protocols, and ordinary duck typing can all express
interfaces in different ways.

`typing.Protocol` describes a structure for static type checking. Classes need
not explicitly inherit from the protocol to satisfy it:

```python
from typing import Protocol

class Drawable(Protocol):
    def draw(self) -> None:
        ...

class Circle:
    def draw(self) -> None:
        print("Drawing circle")

class Square:
    def draw(self) -> None:
        print("Drawing square")

def render(shape: Drawable) -> None:
    shape.draw()

render(Circle())  # Drawing circle
render(Square())  # Drawing square
```

A static checker can recognize both classes as compatible because they provide
the required method. This is **structural typing**. Annotations alone do not
enforce the contract at runtime. `@runtime_checkable` enables certain runtime
checks for protocols, but checks member presence rather than validating method
signatures or behavior.

| Approach | Main use | Enforcement |
| --- | --- | --- |
| ABC | A deliberate hierarchy, possibly with shared implementation. | Normal instantiation rejects subclasses with unresolved abstract members. |
| Protocol | Describe a compatible structure without requiring inheritance. | Primarily static checking; optional runtime checks are limited. |
| Duck typing | Simply use the operations needed. | Unsupported operations fail when executed. |

Choose the simplest approach that expresses the contract clearly. Abstraction
focuses on the useful interface; encapsulation focuses on managing state and
its rules. They often work together, but neither requires the other.

## 8. Practical example: interchangeable storage

This example defines a shared storage interface, with in-memory and local-file
implementations. The file implementation accepts only simple keys and stores
text. A temporary directory keeps the example self-contained.

```python
from abc import ABC, abstractmethod
from pathlib import Path
from tempfile import TemporaryDirectory

class Storage(ABC):
    @abstractmethod
    def save(self, key, data):
        pass

    @abstractmethod
    def load(self, key):
        pass

class MemoryStorage(Storage):
    def __init__(self):
        self._data = {}

    def save(self, key, data):
        self._data[key] = data

    def load(self, key):
        return self._data.get(key)

class FileStorage(Storage):
    def __init__(self, directory):
        self.directory = Path(directory)
        self.directory.mkdir(parents=True, exist_ok=True)

    def _path(self, key):
        if not key or not key.isascii() or not key.isalnum():
            raise ValueError("Key must contain only ASCII letters and digits")
        return self.directory / f"{key}.txt"

    def save(self, key, data):
        self._path(key).write_text(data, encoding="utf-8")

    def load(self, key):
        path = self._path(key)
        try:
            return path.read_text(encoding="utf-8")
        except FileNotFoundError:
            return None

def save_user_settings(storage, username):
    storage.save("username", username)

with TemporaryDirectory() as directory:
    memory = MemoryStorage()
    files = FileStorage(directory)
    save_user_settings(memory, "Alice")
    save_user_settings(files, "Bob")
    print(memory.load("username"))  # Alice
    print(files.load("username"))   # Bob
```

The calling function does not need to know which backend it receives. The
example assumes text data and trusted local directory contents; production
storage needs a clearly documented contract, appropriate error handling and
concurrency controls. Both backends return `None` for a missing key.

## 9. Common mistakes

- Thinking abstraction requires hidden or inaccessible source code.
- Making every parent abstract even when an ordinary class is sufficient.
- Assuming an abstract method must have an empty body.
- Assuming ABC machinery checks compatible signatures and semantics.
- Adding layers of abstraction that make a simple program harder to follow.

## Check your understanding

1. [What is the purpose of abstraction?](../questions/abstraction-purpose.md)
2. [Can an abstract class have concrete methods and a constructor?](../questions/abc-concrete-methods.md)
3. [What if a subclass leaves an abstract method unresolved?](../questions/abc-unimplemented.md)
4. [How can unrelated classes satisfy a statically described interface?](../questions/protocol-structural-typing.md)

## Coding challenge

Create a `Notification` ABC with an abstract `send(message)` method and a
concrete `format_message(message)` method. Implement `EmailNotification`,
`SMSNotification`, and `PushNotification`; each should reuse the formatter and
provide its own `send`. Write `notify_all` to send the same message through a
collection of notifications.

As an extra challenge, describe the same `send` operation using a `Protocol`.
Explain how static structural checking differs from the ABC's normal runtime
instantiation check. Verify that an incomplete ABC subclass cannot normally be
instantiated and that unrelated compatible protocol implementations can be
accepted by a static checker.

**Next:** the planned Lesson 9, Special Methods, will explore `__str__`,
`__repr__`, equality, hashing, container behavior, and operator overloading.
It is not yet published.
