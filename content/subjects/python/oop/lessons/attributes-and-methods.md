---
id: lesson-python-oop-attributes-methods
kind: lesson
topicId: python-oop
title: Attributes and Methods in Python
summary: Learn how instance, class, and static methods work with attributes, binding, shadowing, and inheritance.
difficulty: medium
status: published
revision: 1
order: 40
tags: [python, oop, attributes, methods]
prerequisiteIds: [lesson-python-oop-constructors-self]
---

## Where this lesson fits

**Intermediate Python · OOP · Lesson 4 of 12**

In [Constructors and self in Depth](constructors-and-self.md), we learned how
objects are initialized. Now we will connect attributes to three kinds of
methods and see how Python finds and binds them. Examples use Python 3.

## 1. Attributes and methods

An **attribute** is a value associated with an object or class. A **method** is
a function defined on a class that provides behavior.

```python
class Student:
    def __init__(self, name, marks):
        self.name = name
        self.marks = marks

    def introduce(self):
        print(f"Hello, I'm {self.name}")

    def has_passed(self):
        return self.marks >= 40

s1 = Student("Alice", 85)
print(s1.name)          # Alice
print(s1.marks)         # 85
s1.introduce()          # Hello, I'm Alice
print(s1.has_passed())  # True
```

`name` and `marks` are attributes holding information. `introduce` and
`has_passed` are methods that use that information.

## 2. Instance and class attributes

Instance attributes belong to individual objects. Class attributes live on the
class and can be found through its instances.

```python
class Student:
    university = "Delhi University"

    def __init__(self, name, marks):
        self.name = name
        self.marks = marks

s1 = Student("Alice", 85)
s2 = Student("Bob", 70)
s1.marks = 95
print(s1.marks, s2.marks)            # 95 70
print(s1.university, s2.university)  # Delhi University Delhi University
```

Each student has their own marks. Neither instance has its own `university`, so
both find it on `Student`. Most ordinary instances store their own attributes
in `__dict__`; methods defined in the class are stored on the class instead.

A class attribute can also hold a shared count:

```python
class Student:
    total_students = 0

    def __init__(self, name):
        self.name = name
        Student.total_students += 1

Student("Alice")
Student("Bob")
Student("Charlie")
print(Student.total_students)  # 3
```

This counts successful initializations, not necessarily students still alive.
Using `Student` explicitly means subclasses using this initializer also update
the same base-class counter. Concurrent increments need synchronization if an
accurate count matters.

## 3. Instance methods

An instance method receives the particular object as its first argument,
conventionally named `self`. Use one when an action reads or changes that
object's state.

```python
class Student:
    university = "Delhi University"

    def __init__(self, name, marks):
        self.name = name
        self.marks = marks

    def update_marks(self, new_marks):
        self.marks = new_marks

    def display(self):
        print(self.name, self.marks, self.university)

s1 = Student("Alice", 80)
s2 = Student("Bob", 65)
s1.update_marks(95)
s1.display()  # Alice 95 Delhi University
s2.display()  # Bob 65 Delhi University
```

`s1.update_marks(95)` is conceptually like `Student.update_marks(s1, 95)` for
this ordinary method. `self.university` finds the class attribute unless an
instance attribute or a higher-priority descriptor changes the lookup.

## 4. Class methods

`@classmethod` makes a method receive the class as its first argument,
conventionally called `cls`. It can be called on the class or an instance;
either way it receives the class rather than a particular instance.

```python
class Student:
    total_students = 0

    def __init__(self, name):
        self.name = name
        Student.total_students += 1

    @classmethod
    def show_total(cls):
        print(f"Total: {cls.total_students}")

s1 = Student("Alice")
Student("Bob")
Student.show_total()  # Total: 2
s1.show_total()       # Total: 2
```

Class methods are also useful as **alternative constructors**:

```python
class Student:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    @classmethod
    def from_string(cls, data):
        name, age = data.split(",")
        return cls(name, int(age))

s1 = Student("Alice", 20)
s2 = Student.from_string("Bob,22")
print(s1.name, s1.age)  # Alice 20
print(s2.name, s2.age)  # Bob 22
```

`cls(...)` calls the class's normal construction process. This simple parser
expects exactly two comma-separated fields and a valid integer; malformed input
raises an exception. For real CSV data, use Python's `csv` module to handle
quoting and other CSV rules.

## 5. Static methods

A static method receives neither an instance nor a class automatically. It is
similar to an ordinary function placed in the class namespace.

```python
class Calculator:
    @staticmethod
    def add(a, b):
        return a + b

    @staticmethod
    def multiply(a, b):
        return a * b

print(Calculator.add(10, 20))    # 30
print(Calculator.multiply(5, 6))  # 30
```

A static method can access a class or instance if it is given one or explicitly
references one, but nothing is supplied automatically. Use `@staticmethod`
when an operation belongs naturally to a class's interface without needing its
state. A module-level function is often simpler for a general utility.

## 6. Compare the three method types

| Method | Decorator | Automatically supplied | Common purpose |
| --- | --- | --- | --- |
| Instance | None | Instance (`self`) | Read or change one object's state |
| Class | `@classmethod` | Class (`cls`) | Class behavior or alternative constructors |
| Static | `@staticmethod` | Nothing | Related operation independent of either |

Instance methods can access class attributes too. Class and static methods can
access a specific instance only if they obtain one, for example as an explicit
argument. A static method can refer to a class by name, but that hardcodes the
class rather than receiving the class through `cls`.

```python
class Employee:
    company = "Google"

    def __init__(self, name, salary):
        self.name = name
        self.salary = salary

    def show_details(self):
        print(self.name, self.salary)

    @classmethod
    def change_company(cls, new_company):
        cls.company = new_company

    @staticmethod
    def is_valid_salary(salary):
        return salary >= 0

employee = Employee("Alice", 50000)
employee.show_details()                 # Alice 50000
Employee.change_company("Microsoft")
print(Employee.company)                 # Microsoft
print(Employee.is_valid_salary(50000))  # True
```

## 7. How method binding works

When an ordinary function defined on a class is accessed through an instance,
Python normally returns a **bound method**. It combines the function and the
instance; calling it supplies that instance automatically.

```python
class Student:
    def introduce(self):
        print("Hello")

s1 = Student()
method = s1.introduce
print(method.__self__ is s1)                  # True
print(method.__func__ is Student.introduce)   # True
method()                                      # Hello
```

`__self__` is the bound instance and `__func__` is the underlying function.
Accessing `Student.introduce` gives the function; accessing `s1.introduce` gives
the bound method. Class methods bind a class instead; static methods do not
perform this automatic binding.

## 8. Lookup and method shadowing

Methods are usually defined on the class, not copied into each instance:

```python
class Student:
    def __init__(self, name):
        self.name = name

    def greet(self):
        print("Hello")

s1 = Student("Alice")
print(s1.__dict__)                # {'name': 'Alice'}
print("greet" in Student.__dict__)  # True
s1.greet()                        # Hello
s1.greet = "Hi"
print(s1.greet)                   # Hi
# s1.greet() now raises TypeError: the string is not callable.
```

The instance attribute shadows this ordinary method. Avoid using the same name
for unrelated data and methods. This is a simplified lookup model: descriptors
such as properties can take priority over instance attributes, and custom
attribute hooks can change lookup.

## 9. Class methods and inheritance

Using `cls` instead of hardcoding a class makes many alternative constructors
work naturally with subclasses:

```python
class Animal:
    def __init__(self, name):
        self.name = name

    @classmethod
    def create(cls, name):
        return cls(name)

class Dog(Animal):
    pass

animal = Animal.create("Generic Animal")
dog = Dog.create("Bruno")
print(type(animal).__name__)  # Animal
print(type(dog).__name__)     # Dog
```

The inherited method receives `Dog` as `cls` when called through `Dog`. This
assumes the subclass can be constructed with the arguments the method supplies.
Hardcoding `Animal(name)` would produce an `Animal` in both calls.

## 10. Common mistakes

**Accidentally shadowing a class counter:**

```python
class Counter:
    count = 0

    def increment(self):
        self.count += 1

a = Counter()
b = Counter()
a.increment()
print(a.count)        # 1
print(b.count)        # 0
print(Counter.count)  # 0
```

For this ordinary integer attribute, `self.count += 1` reads the class value
and then assigns a new instance attribute. Use `Counter.count += 1` to update
that shared base-class counter. `type(self).count += 1` can instead create or
update a separate attribute on a subclass, so choose the behavior deliberately.

**Choosing the wrong method:** a class method does not automatically receive a
student's `self.name`; use an instance method for individual state. A helper
that has no meaningful connection to a class may belong at module level rather
than being decorated with `@staticmethod`.

## 11. Putting it together: bank accounts

This teaching example uses all three method types:

```python
class BankAccount:
    bank_name = "National Bank"
    total_accounts = 0

    def __init__(self, owner, balance=0):
        if not BankAccount.is_valid_balance(balance):
            raise ValueError("Invalid balance")
        self.owner = owner
        self.balance = balance
        BankAccount.total_accounts += 1

    def deposit(self, amount):
        if not self.is_valid_amount(amount):
            raise ValueError("Invalid deposit")
        self.balance += amount

    def show_balance(self):
        print(f"{self.owner}: Rs {self.balance}")

    @classmethod
    def show_total_accounts(cls):
        # The counter is deliberately shared with the base class.
        print(f"Total accounts: {BankAccount.total_accounts}")

    @classmethod
    def from_string(cls, data):
        owner, balance = data.split(",")
        return cls(owner, float(balance))

    @staticmethod
    def is_valid_balance(balance):
        return balance >= 0

    @staticmethod
    def is_valid_amount(amount):
        return amount > 0

alice = BankAccount("Alice", 1000)
bob = BankAccount.from_string("Bob,2000")
alice.deposit(500)
alice.show_balance()               # Alice: Rs 1500
bob.show_balance()                 # Bob: Rs 2000.0
BankAccount.show_total_accounts()  # Total accounts: 2
```

`owner` and `balance` belong to each account. `bank_name` and the counter live
on the class. Instance methods operate on an account; `from_string` constructs
through `cls`; static methods check supplied values. The counter explicitly
uses `BankAccount`, so it is shared across subclasses rather than maintained
separately for each one.

This example assumes numeric inputs and a simple comma-separated string. Real
banking code needs stronger validation, appropriate monetary types such as
`Decimal`, and transaction safety; floating-point arithmetic is not suitable
for precise money calculations.

## Test your understanding

1. [What does an instance method receive?](../questions/instance-method-binding.md)
2. [Which method is useful for an alternative constructor?](../questions/alternative-constructor.md)
3. [When can a static method fit?](../questions/static-method-purpose.md)
4. [What does `self.count += 1` do with a class integer?](../questions/class-counter-shadowing.md)

**Next:** [Encapsulation in Python](encapsulation.md) covers naming conventions,
name mangling, properties, and protecting object state.
