---
id: lesson-python-oop-constructors-self
kind: lesson
topicId: python-oop
title: Constructors and self in Depth
summary: Learn how initialization and method binding work, avoid shared mutable defaults, and build objects with valid initial state.
difficulty: medium
status: published
revision: 1
order: 30
tags: [python, oop, constructors, methods]
prerequisiteIds: [lesson-python-oop-classes-objects]
---

## Where this lesson fits

**Intermediate Python · OOP · Lesson 3 of 12**

In [Classes and Objects in Depth](classes-and-objects-in-depth.md), we explored
instance data, class attributes, and object creation. Now we will look closely
at initialization and `self`. The examples use Python 3.

## 1. Why initialize objects?

Suppose every bank account needs a name and a balance. Without initialization
logic, you could create an empty object and add attributes afterward:

```python
class BankAccount:
    pass

account = BankAccount()
account.name = "Alice"
account.balance = 5000
```

This works, but it is easy to forget an attribute. `__init__` puts the setup
in one place and requires the caller to supply the necessary information:

```python
class BankAccount:
    def __init__(self, name, balance):
        self.name = name
        self.balance = balance

account1 = BankAccount("Alice", 5000)
account2 = BankAccount("Bob", 10000)
print(account1.name)     # Alice
print(account2.balance)  # 10000
```

`__init__` is commonly called a constructor. More precisely, it **initializes**
an instance; `__new__` normally creates it first.

## 2. Understanding `__init__`

```python
class Student:
    def __init__(self, name, age):
        self.name = name
        self.age = age

s1 = Student("Alice", 20)
s2 = Student("Bob", 22)
print(s1.name, s1.age)  # Alice 20
print(s2.name, s2.age)  # Bob 22
```

`self` refers to the instance being initialized. `name` and `age` are local
parameters containing the supplied values. Assignments such as `self.name =
name` ordinarily store those values on the instance.

In the normal construction process, calling `Student("Alice", 20)` first
creates an instance, then calls `__init__` with that instance and the supplied
arguments, and finally returns the instance. Each normal call creates and
initializes a separate student; `__init__` is not a once-per-class operation.

## 3. What is `self`?

`self` is the conventional name of the first parameter of an instance method.
It refers to the instance the method is working with.

```python
class Dog:
    def __init__(self, name):
        self.name = name

    def bark(self):
        print(f"{self.name} says Woof!")

dog1 = Dog("Bruno")
dog2 = Dog("Max")
dog1.bark()  # Bruno says Woof!
dog2.bark()  # Max says Woof!
```

The same method works with both dogs. In the first call, `self` refers to
`dog1`; in the second, it refers to `dog2`. `self` is not a Python keyword:
another parameter name would work, but using `self` is the standard convention
and makes your code easier for other Python programmers to read.

## 4. How Python passes the instance

For an ordinary instance method, accessing the function through an instance
produces a **bound method**: Python associates the instance with the function.
Calling that bound method supplies the instance as the first argument.

```python
class Person:
    def introduce(self):
        print(f"Hello from {self.name}")

p1 = Person()
p1.name = "Alice"
p1.introduce()        # Hello from Alice
Person.introduce(p1)  # Hello from Alice
```

For this ordinary method, the two calls have the same effect. Accessing it
through `Person` requires you to pass `p1` explicitly. `Person.introduce()`
raises `TypeError` because the instance is missing; `p1.introduce(p1)` raises
`TypeError` because this particular method receives an extra argument.
`@classmethod` and `@staticmethod` bind differently; they are covered in the
planned lesson on attributes and methods.

## 5. Default and keyword arguments

An initializer can have default arguments just like any other function:

```python
class BankAccount:
    def __init__(self, name, balance=0):
        self.name = name
        self.balance = balance

account1 = BankAccount("Alice")
account2 = BankAccount(balance=5000, name="Bob")
print(account1.balance)  # 0
print(account2.balance)  # 5000
```

If `balance` is omitted, its default is used. Keyword arguments match parameter
names, so their order can differ. For positional-or-keyword parameters, required
parameters must come before parameters with defaults: `name, age=20` is valid,
but `age=20, name` is not. Keyword-only parameters have their own ordering
rules.

## 6. Mutable default arguments

This class looks like it creates a separate course list for each student, but
it does not when the argument is omitted:

```python
class Student:
    def __init__(self, name, courses=[]):
        self.name = name
        self.courses = courses

s1 = Student("Alice")
s2 = Student("Bob")
s1.courses.append("Python")
print(s1.courses)  # ['Python']
print(s2.courses)  # ['Python']
```

Python evaluates the default list when it executes the function definition,
not on every call. Both instances receive a reference to that same list when
`courses` is omitted. Mutating it through one instance affects the other.

Use `None` as a sentinel and create a fresh list when no list was supplied:

```python
class Student:
    def __init__(self, name, courses=None):
        self.name = name
        self.courses = [] if courses is None else courses

s1 = Student("Alice")
s2 = Student("Bob")
s1.courses.append("Python")
print(s1.courses)  # ['Python']
print(s2.courses)  # []
```

This fixes the default case. If a caller explicitly passes the same list to two
students, they still share it. To give each student a separate list even then,
use `self.courses = list(courses) if courses is not None else []`. This is a
**shallow copy**: nested mutable values, if any, can still be shared.

A shared default argument and a mutable class attribute are different sources
of shared state, although both can produce surprisingly similar bugs.

## 7. Validate initial values

Initialization can check values before storing them:

```python
class BankAccount:
    def __init__(self, name, balance=0):
        if not name:
            raise ValueError("Name cannot be empty")
        if balance < 0:
            raise ValueError("Balance cannot be negative")
        self.name = name
        self.balance = balance

account = BankAccount("Alice", 5000)
print(account.balance)  # 5000
# BankAccount("Bob", -500) raises ValueError.
```

If validation raises an exception, the construction call fails instead of
returning a normally initialized account. Checking in `__init__` alone does
not stop later assignment such as `account.balance = -500`. Properties and
other encapsulation techniques can enforce rules on later changes too.

## 8. Alternative ways to create an object

Python does not select among multiple `__init__` definitions based on their
parameter lists. If you define `__init__` twice in the same class, the second
definition replaces the first. For simple alternatives, use defaults:

```python
class Student:
    def __init__(self, name, age=None):
        self.name = name
        self.age = age

print(Student("Alice").age)    # None
print(Student("Bob", 22).age)  # 22
```

For a named alternative, a class method can prepare arguments and call `cls`:

```python
class Student:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    @classmethod
    def from_birth_year(cls, name, birth_year, current_year):
        return cls(name, current_year - birth_year)

s1 = Student("Alice", 20)
s2 = Student.from_birth_year("Bob", 2004, 2026)
print(s1.age)  # 20
print(s2.age)  # 22
```

Here `cls` is the class on which the class method is called. The simple year
subtraction gives an approximate age: a person's birthday may not have occurred
yet this year. We will explore class methods in the next planned lesson.

## 9. `__new__` and `__init__`

| Method | Main role | First argument | Return value |
| --- | --- | --- | --- |
| `__new__` | Creates or returns an object | Class, conventionally `cls` | Usually the new instance |
| `__init__` | Initializes an existing instance | Instance, conventionally `self` | Must be `None` |

```python
class Student:
    def __new__(cls, name):
        print("Step 1: Creating object")
        return super().__new__(cls)

    def __init__(self, name):
        print("Step 2: Initializing object")
        self.name = name

s1 = Student("Alice")
print(s1.name)
```

Output:

```text
Step 1: Creating object
Step 2: Initializing object
Alice
```

Ordinary classes rarely need to override `__new__`. Returning a non-`None`
value from `__init__` raises `TypeError`. If `__new__` returns an object that
is not an instance of the class being called, Python skips that class's
`__init__`; custom metaclasses can also change construction behavior.

## 10. Put it together: a course

```python
class Course:
    def __init__(self, title, students=None):
        if not title:
            raise ValueError("Title is required")
        self.title = title
        self.students = list(students) if students is not None else []

    def enroll(self, student_name):
        if student_name not in self.students:
            self.students.append(student_name)

    def show_students(self):
        print(f"Course: {self.title}")
        for student in self.students:
            print(f"- {student}")

python_course = Course("Python")
java_course = Course("Java")
python_course.enroll("Alice")
python_course.enroll("Bob")
java_course.enroll("Charlie")
python_course.show_students()
java_course.show_students()
```

Each course has its own title and student list. A supplied iterable is copied
into a new list; `enroll` changes only the course on which it is called and
avoids duplicate names. The output lists Alice and Bob under Python and Charlie
under Java.

## Test your understanding

Try these questions before opening their answers:

1. [How does `student.introduce()` receive the student?](../questions/bound-method-self.md)
2. [What happens when objects use a mutable default list?](../questions/mutable-constructor-default.md)
3. [What does `__new__` do?](../questions/new-versus-init.md)

**Next:** [Attributes and Methods in Python](attributes-and-methods.md) covers
instance and class variables, method types, and method binding.
