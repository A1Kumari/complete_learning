---
id: lesson-python-oop-polymorphism
kind: lesson
topicId: python-oop
title: Polymorphism in Python
summary: Use common operations with different objects, understand duck typing and dynamic dispatch, and implement meaningful operator behavior.
difficulty: medium
status: published
revision: 1
order: 70
tags: [python, oop, polymorphism, duck-typing]
prerequisiteIds: [lesson-python-oop-inheritance]
---

## Where this lesson fits

**Intermediate Python · OOP · Lesson 7 of 12**

In [Inheritance in Python](inheritance.md), we learned about overriding,
`super()`, and method resolution order. Now we will see how one operation can
work with different kinds of objects, even when their classes are unrelated.
Examples use Python 3.

## 1. What is polymorphism?

Polymorphism means that a common operation can behave differently depending on
the object involved. A dog, a cat, and a cow can all respond to `speak()`, but
each has its own behavior:

```python
class Dog:
    def speak(self):
        print("Woof!")

class Cat:
    def speak(self):
        print("Meow!")

class Cow:
    def speak(self):
        print("Moo!")

def make_sound(animal):
    animal.speak()

for animal in [Dog(), Cat(), Cow()]:
    make_sound(animal)
# Woof!
# Meow!
# Moo!
```

`make_sound` does not need a separate branch for each animal. It asks the
supplied object to perform a common operation. A new object with a compatible
`speak()` method can work with the same function.

## 2. Polymorphism through inheritance

Related classes can provide different implementations by overriding a parent
method:

```python
class Animal:
    def speak(self):
        print("Some animal sound")

class Dog(Animal):
    def speak(self):
        print("Woof!")

class Cat(Animal):
    def speak(self):
        print("Meow!")

for animal in [Dog(), Cat(), Animal()]:
    animal.speak()
# Woof!
# Meow!
# Some animal sound
```

Each loop iteration calls the same operation, but Python finds the appropriate
implementation for that object. This is an example of **subtype polymorphism**:
subclasses can be used through a parent class's interface when their behavior
is compatible with what callers expect.

## 3. Overriding and runtime method selection

```python
class Employee:
    def calculate_bonus(self):
        return 1000

class Manager(Employee):
    def calculate_bonus(self):
        return 5000

class Developer(Employee):
    def calculate_bonus(self):
        return 3000

class Intern(Employee):
    pass

for employee in [Employee(), Manager(), Developer(), Intern()]:
    print(employee.calculate_bonus())
# 1000
# 5000
# 3000
# 1000
```

Python resolves `calculate_bonus` when the expression is evaluated. The manager
and developer methods override the parent method; `Intern` inherits the
parent implementation. This is often called **dynamic dispatch** or runtime
polymorphism. Actual attribute lookup also accounts for instance attributes,
descriptors, the MRO, and any custom lookup behavior.

## 4. Duck typing

Duck typing focuses on what an object can do rather than requiring a particular
class. A common saying is: “If it walks like a duck and quacks like a duck, it
is a duck.” In code, we ask for the operation we need:

```python
class FileStorage:
    def save(self, data):
        print(f"Saving '{data}' to file")

class CloudStorage:
    def save(self, data):
        print(f"Uploading '{data}' to cloud")

def backup_data(storage, data):
    storage.save(data)

backup_data(FileStorage(), "Hello")   # Saving 'Hello' to file
backup_data(CloudStorage(), "Hello")  # Uploading 'Hello' to cloud
```

These classes do not share a custom parent, but both provide a compatible
`save(data)` operation. If an object has no `save` attribute, the call normally
raises `AttributeError`. Matching the name alone is not enough: the method
must accept the arguments and behave in a way the caller can use. Python still
has types and checks operations at runtime; duck typing does not remove them.

Inheritance-based polymorphism uses related classes; duck typing can work with
independently implemented classes. Both approaches are useful.

## 5. Describing an interface with `Protocol`

Python's `typing.Protocol` can describe the operations a static type checker
should expect, without requiring implementations to inherit from that protocol:

```python
from typing import Protocol

class Storage(Protocol):
    def save(self, data: str) -> None:
        ...

def backup_data(storage: Storage, data: str) -> None:
    storage.save(data)
```

A static checker can accept a class with a compatible `save` method even if it
does not explicitly inherit from `Storage`. Type annotations do not by
themselves enforce this interface at runtime. Protocols and static checking are
covered in more depth in Typing & Validation.

## 6. Operator overloading

The same operator can mean different things for different operands:

```python
print(10 + 20)             # 30
print("Hello " + "World")  # Hello World
print([1, 2] + [3, 4])     # [1, 2, 3, 4]
```

User-defined classes can provide operator behavior with special methods. For
example, we can add two points component by component:

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __add__(self, other):
        if not isinstance(other, Point):
            return NotImplemented
        return Point(self.x + other.x, self.y + other.y)

    def __repr__(self):
        return f"Point({self.x}, {self.y})"

p1 = Point(2, 3)
p2 = Point(4, 5)
print(p1 + p2)  # Point(6, 8)
```

For these operands, addition uses the `__add__` implementation. Returning
`NotImplemented` for an unsupported operand tells Python this method cannot
handle that combination; Python can then try the appropriate reflected
operation, such as the right operand's `__radd__`. If neither side supports
the operation, Python raises `TypeError`. Reflected-method precedence can also
depend on operand types, so `a + b` is not always simply a direct call to
`a.__add__(b)`.

`NotImplemented` is a special return value, not the exception
`NotImplementedError`. Choose operator meanings that are predictable for your
type; using `+` to send an email or delete a file would be surprising.

## 7. Built-in operations and special methods

Python's built-in operations use protocols that custom classes can implement:

| Operation | Related special method |
| --- | --- |
| `a + b` | `__add__` |
| `a - b` | `__sub__` |
| `a * b` | `__mul__` |
| `a == b` | `__eq__` |
| `a < b` | `__lt__` |
| `len(a)` | `__len__` |
| `str(a)` | `__str__` |
| `a[index]` | `__getitem__` |
| `a()` | `__call__` |

Some operators also have reflected and in-place methods, including `__radd__`
and `__iadd__`. For example, `len()` can work with a custom class:

```python
class Classroom:
    def __init__(self, students):
        self.students = students

    def __len__(self):
        return len(self.students)

classroom = Classroom(["Alice", "Bob", "Charlie"])
print(len(classroom))  # 3
```

`len` relies on the length protocol rather than knowing how `Classroom` stores
its students. Special-method lookup has its own rules and generally looks on
the type, rather than acting exactly like ordinary instance attribute lookup.

## 8. Overriding versus overloading

**Overriding** means a subclass provides its own implementation of an inherited
method. Traditional signature-based **overloading** means multiple methods
share a name but are selected by their argument signatures.

Repeated definitions in one Python class do not create signature-based
overloads: the later definition replaces the earlier one. Instead, defaults or
variable arguments can support different calls:

```python
class Calculator:
    def add(self, *numbers):
        return sum(numbers)

calculator = Calculator()
print(calculator.add(10, 20))         # 30
print(calculator.add(10, 20, 30))     # 60
print(calculator.add(1, 2, 3, 4, 5))  # 15
```

Python also offers `functools.singledispatch` for dispatch based on a type and
`typing.overload` for describing accepted signatures to static type checkers.
They serve different purposes and are not the same as repeated runtime method
definitions.

## 9. How the OOP ideas relate

| Idea | Focus | Example |
| --- | --- | --- |
| Encapsulation | Organize and control interaction with state. | Account deposits and withdrawals. |
| Inheritance | Build on or specialize another class. | `Dog` inherits from `Animal`. |
| Polymorphism | Use different objects through a common operation. | Calling `speak()` on different animals. |
| Abstraction | Expose useful behavior while hiding unnecessary details. | A payment interface. |

Inheritance can support polymorphism, but it is not required. The unrelated
storage classes above work through a shared operation without a common parent.

## 10. Practical example: simulated payments

```python
class CreditCardPayment:
    def pay(self, amount):
        print(f"Paid Rs {amount} using Card")

class UPIPayment:
    def pay(self, amount):
        print(f"Paid Rs {amount} using UPI")

class WalletPayment:
    def pay(self, amount):
        print(f"Paid Rs {amount} using Wallet")

def checkout(payment_method, amount):
    payment_method.pay(amount)

checkout(CreditCardPayment(), 500)  # Paid Rs 500 using Card
checkout(UPIPayment(), 1000)        # Paid Rs 1000 using UPI
checkout(WalletPayment(), 750)      # Paid Rs 750 using Wallet
```

`checkout` depends on the `pay(amount)` operation instead of branching on
specific payment types. A new compatible payment object can be used without
changing `checkout`. The example only prints simulated payments; real payment
systems need proper authentication, error handling, transaction tracking,
and appropriate handling of retries.

## 11. Common mistakes

- Assuming polymorphism requires inheritance: compatible unrelated objects can work too.
- Assuming the same method name guarantees compatible arguments or behavior.
- Confusing overriding with traditional signature-based overloading.
- Adding repeated type checks when a suitable common operation would be clearer.
- Giving an overloaded operator a surprising meaning.

Type checks are sometimes appropriate; polymorphism is a design tool, not a
rule that every explicit type check must be removed.

## Check your understanding

1. [What is the central idea of polymorphism?](../questions/polymorphism-basics.md)
2. [Does duck typing require a common parent?](../questions/duck-typing.md)
3. [What happens when a child overrides a method?](../questions/method-overriding.md)
4. [What does returning `NotImplemented` from `__add__` mean?](../questions/operator-not-implemented.md)

## Coding challenge

Create `EmailNotification`, `SMSNotification`, and `PushNotification`
classes. Each should provide `send(message)` with a different output format.
Write `notify_all(notifications, message)` to call `send(message)` on every
object without checking its class.

For an extra challenge, add a `NotificationLogger` with a `send(message)`
method that records messages in a list rather than printing them. Verify that
`notify_all` works with it unchanged and that the list contains the message.

**Next:** [Abstraction in Python](abstraction.md) covers abstract classes,
abstract methods, the `abc` module, and protocols.
