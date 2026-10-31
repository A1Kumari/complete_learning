---
id: lesson-python-oop-encapsulation
kind: lesson
topicId: python-oop
title: Encapsulation in Python
summary: Use Python naming conventions, properties, and methods to provide a clear interface and keep object state consistent.
difficulty: medium
status: published
revision: 1
order: 50
tags: [python, oop, encapsulation, properties]
prerequisiteIds: [lesson-python-oop-attributes-methods]
---

## Where this lesson fits

**Intermediate Python · OOP · Lesson 5 of 12**

In [Attributes and Methods in Python](attributes-and-methods.md), we learned
how objects store data and provide behavior. Now we will build clear interfaces
that help keep that data consistent. Examples use Python 3.

## 1. What is encapsulation?

Encapsulation brings related data and behavior together and defines how other
code should interact with them. It helps an object maintain its **invariants**:
rules that should remain true about its state.

Imagine an account with a rule that its balance cannot be negative:

```python
class BankAccount:
    def __init__(self, owner, balance):
        self.owner = owner
        self.balance = balance

    def withdraw(self, amount):
        self.balance -= amount

account = BankAccount("Alice", 5000)
account.withdraw(10000)
print(account.balance)  # -5000
account.balance = -100000  # Also allowed by this class.
```

The class does not check either operation. We can improve the design by
providing `deposit` and `withdraw` methods that validate changes and a property
that exposes the balance for reading. Encapsulation is not simply making
variables private: it is about sensible boundaries and a useful interface.

## 2. Python's naming conventions

Python generally communicates intended access through names rather than
enforcing Java-style access modifiers for ordinary attributes.

| Style | Example | Meaning |
| --- | --- | --- |
| Public | `name` | Intended for use by callers. |
| Non-public | `_balance` | An internal detail by convention. |
| Name-mangled | `__value` | Renamed to reduce accidental collisions, especially in subclasses. |

These conventions are not access-control or security mechanisms.

## 3. Public attributes

Direct access is perfectly reasonable when no special behavior is needed:

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

point = Point(2, 3)
print(point.x)  # 2
point.x = 5
print(point.x)  # 5
```

There is no need to write a getter and setter for every attribute. Start with
a clear public attribute when that is sufficient; a property can later add
behavior while preserving the same access syntax.

## 4. A single leading underscore

`_balance` tells readers that the attribute is an implementation detail:

```python
class BankAccount:
    def __init__(self, balance):
        self._balance = balance

    def show_balance(self):
        return self._balance

account = BankAccount(5000)
print(account.show_balance())  # 5000
print(account._balance)        # 5000: Python still allows access
```

Callers can still assign `account._balance`; the underscore asks them not to
depend on it casually. The convention applies to methods too: `_connect` might
be an internal helper used by a public `send` method. A leading underscore also
has other effects in particular contexts, such as default wildcard imports, but
it does not make an attribute private.

## 5. Double underscores and name mangling

An identifier such as `__balance` written inside a class definition is normally
rewritten to include the class name. This is called **name mangling**:

```python
class BankAccount:
    def __init__(self, balance):
        self.__balance = balance

    def show_balance(self):
        return self.__balance

account = BankAccount(5000)
print(account.show_balance())          # 5000
print(account.__dict__)                # {'_BankAccount__balance': 5000}
print(account._BankAccount__balance)   # 5000
# account.__balance raises AttributeError: that spelling was not mangled here.
```

The value remains accessible under its mangled name. The main purpose is to
reduce accidental collisions between a class and its subclasses:

```python
class Parent:
    def __init__(self):
        self.__value = 10

    def get_parent_value(self):
        return self.__value

class Child(Parent):
    def __init__(self):
        super().__init__()
        self.__value = 20

    def get_child_value(self):
        return self.__value

obj = Child()
print(obj.get_parent_value(), obj.get_child_value())  # 10 20
print(obj.__dict__)  # {'_Parent__value': 10, '_Child__value': 20}
```

Names with at least two leading underscores and at most one trailing underscore
are candidates for mangling in a class definition. Dunder names such as
`__init__` and `__str__`, which also end in two underscores, are not mangled.
Use `__name` when avoiding subclass collisions is useful, not as a way to hide
secrets. Name mangling does not encrypt or secure data.

## 6. Getters and setters

A getter reads a value; a setter changes it and can validate the change:

```python
class Student:
    def __init__(self, age):
        self.set_age(age)

    def get_age(self):
        return self._age

    def set_age(self, age):
        if age < 0:
            raise ValueError("Age cannot be negative")
        self._age = age

student = Student(20)
student.set_age(21)
print(student.get_age())  # 21
# Student(-5) and student.set_age(-5) raise ValueError.
```

Calling the setter during initialization ensures the initial value is checked
too. Python also offers properties, which let callers use ordinary attribute
syntax while the class controls the read or write.

## 7. Properties and validation

```python
class Student:
    def __init__(self, age):
        self.age = age  # Calls the setter, including during initialization.

    @property
    def age(self):
        return self._age

    @age.setter
    def age(self, value):
        if value < 0:
            raise ValueError("Age cannot be negative")
        self._age = value

student = Student(20)
print(student.age)  # 20
student.age = 21
print(student.age)  # 21
# student.age = -5 raises ValueError.
```

Reading `student.age` invokes the getter; assigning `student.age = 21` invokes
the setter. Callers use attribute syntax, not `student.age()`. The setter
stores its value in `_age`, a different name from the property.

Why not write `self.age = value` inside the setter? That assignment calls the
same setter again, which calls itself repeatedly until Python raises
`RecursionError`. Writing `self._age = value` avoids that recursion. The
underscore is still a convention: someone can deliberately bypass the property
by assigning `_age` directly.

## 8. Read-only and computed properties

A property with a getter but no setter normally rejects assignment. It can
calculate a value whenever it is read:

```python
import math

class Circle:
    def __init__(self, radius):
        self.radius = radius

    @property
    def area(self):
        return math.pi * self.radius ** 2

circle = Circle(5)
print(round(circle.area, 2))  # 78.54
circle.radius = 10
print(round(circle.area, 2))  # 314.16
# circle.area = 100 raises AttributeError: there is no setter.
```

`area` is recalculated from the current radius. This example does not validate
the radius; a fuller model could require it to be non-negative. A read-only
property does not make the whole object immutable, nor does it make a mutable
value returned by its getter immutable.

## 9. Property deleters

A property may define what happens when it is deleted:

```python
class User:
    def __init__(self, nickname):
        self._nickname = nickname

    @property
    def nickname(self):
        return self._nickname

    @nickname.setter
    def nickname(self, value):
        self._nickname = value

    @nickname.deleter
    def nickname(self):
        print("Deleting nickname")
        del self._nickname

user = User("alice123")
print(user.nickname)  # alice123
del user.nickname     # Deleting nickname
# Reading user.nickname now raises AttributeError until a value is set again.
```

Deleters are useful when deletion needs special behavior or cleanup, though
they are less common than getters and setters.

## 10. Encapsulation and abstraction

These ideas overlap but emphasize different things:

| Encapsulation | Abstraction |
| --- | --- |
| Groups data and behavior and controls interaction with state. | Exposes useful operations while hiding unnecessary complexity. |
| Helps maintain an object's rules. | Helps callers focus on what an interface does. |
| Often uses methods and properties. | Can use interfaces and abstract base classes. |

For example, a car's accelerator offers a simple operation without requiring a
driver to understand every engine detail: that is abstraction. Managing the
car's internal state through appropriate controls illustrates encapsulation.
Abstract base classes and the `abc` module will be covered in a later lesson.

## 11. Practical example: a bank account

```python
class BankAccount:
    def __init__(self, owner, balance=0):
        if balance < 0:
            raise ValueError("Initial balance cannot be negative")
        self.owner = owner
        self._balance = balance

    @property
    def balance(self):
        return self._balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Deposit must be positive")
        self._balance += amount

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("Withdrawal must be positive")
        if amount > self._balance:
            raise ValueError("Insufficient balance")
        self._balance -= amount

account = BankAccount("Alice", 5000)
account.deposit(1000)
account.withdraw(500)
print(account.balance)  # 5500
# account.balance = -1 raises AttributeError: no setter is defined.
```

The constructor checks the initial balance. `balance` is readable through a
property, while deposits and withdrawals enforce rules for normal changes.
`_balance` remains accessible by convention, so this is an API boundary, not
protection against malicious code. This teaching example assumes suitable
numeric inputs; real financial systems also require robust validation, suitable
money types such as `Decimal`, concurrency control, and transaction safety.

## 12. Common mistakes

- Assuming `__name` secures data: name mangling only changes the name.
- Adding getters and setters everywhere even when public attributes are clear.
- Assigning to the property itself inside its setter, causing recursion.
- Validating updates but allowing invalid values during initialization.
- Assuming a read-only property makes the entire object or its returned values immutable.

## Check your understanding

Try these questions before viewing their answers:

1. [What does a single leading underscore mean?](../questions/non-public-attribute.md)
2. [How is `__score` mangled inside `Student`?](../questions/name-mangling.md)
3. [What happens when a setter assigns to its own property?](../questions/property-setter-recursion.md)
4. [What happens when a property has no setter?](../questions/read-only-property.md)

## Coding challenge

Create a `Product` with a name, price, and discount percentage. The price must
not be negative and the discount must be between 0 and 100, inclusive. Use
properties and setters to validate both initial values and later changes.
Expose a read-only computed `final_price` that applies the discount.

Try these cases: price 100 and discount 20 gives 80; discounts 0 and 100 are
accepted; a negative price or discount above 100 raises `ValueError`. Consider
what should happen when a caller supplies a non-numeric value.

**Next:** [Inheritance in Python](inheritance.md) covers parent and child
classes, `super()`, overriding, multiple inheritance, and method resolution order.
