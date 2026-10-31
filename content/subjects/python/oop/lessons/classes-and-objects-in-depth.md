---
id: lesson-python-oop-classes-objects
kind: lesson
topicId: python-oop
title: Classes and Objects in Depth
summary: Understand instance and class attributes, attribute lookup, object identity, and how Python creates and initializes objects.
difficulty: medium
status: published
revision: 1
order: 20
tags: [python, oop, classes, objects]
---

## Where this lesson fits

**Intermediate Python · OOP · Lesson 2 of 12**

This lesson builds on basic classes, objects, `self`, and `__init__`. If those
ideas are new, use the short introduction below before continuing. The earlier
introductory lesson is planned and has not yet been published.

We will look at where attributes live, how Python finds them, and why two
objects can share behavior while keeping separate data. Examples use Python 3.

## 1. Classes and objects

A **class** describes a kind of object. An **instance** is an individual object
created from that class. An **attribute** is a value available through a name
such as `student.name`; a **method** is a function defined on a class that can
be called through an instance.

```python
class Student:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def introduce(self):
        print(f"Hi, I'm {self.name}")

s1 = Student("Alice", 20)
s2 = Student("Bob", 22)
s1.introduce()  # Hi, I'm Alice
s2.introduce()  # Hi, I'm Bob
```

`Student` is the class. `s1` and `s2` refer to two different instances. Each
instance has its own `name` and `age`. The function `introduce` is defined once
on the class; it works with either instance because Python supplies that
instance as `self` when the method is called.

You can think of the arrangement like this:

```text
Student class:  introduce function
       ↑ shared behavior ↑
s1: name = Alice, age = 20
s2: name = Bob,   age = 22
```

Python classes are objects too: the `class` statement creates a class object.
Calling `Student(...)` normally creates and initializes a new instance.

## 2. Where instance attributes live

Most ordinary user-defined instances have an attribute dictionary named
`__dict__`. It shows the instance attributes stored on that object. Continuing
the example above:

```python
print(s1.__dict__)  # {'name': 'Alice', 'age': 20}
print(s2.__dict__)  # {'name': 'Bob', 'age': 22}

s1.name = "Charlie"
print(s1.__dict__)  # {'name': 'Charlie', 'age': 20}
print(s2.name)      # Bob
```

The assignment `self.name = name` normally stores `name` on the individual
instance. Changing `s1.name` does not change `s2.name`.

Ordinary instances also allow new attributes after creation:

```python
s1.city = "Delhi"
print(s1.city)      # Delhi
print(s1.__dict__)  # {'name': 'Charlie', 'age': 20, 'city': 'Delhi'}

# s2.city raises AttributeError: the attribute was added only to s1.
```

For predictable objects, initialize important instance attributes in
`__init__` rather than adding them only in some code paths. Not every object
has an instance `__dict__`: for example, classes using `__slots__` can store
attributes differently. Properties and other descriptors can also customize
what an assignment does.

## 3. Instance attributes and class attributes

An instance attribute holds data for one object. A class attribute is defined
on the class and can be accessed through its instances.

```python
class Student:
    university = "Delhi University"  # class attribute

    def __init__(self, name):
        self.name = name             # instance attribute

s1 = Student("Alice")
s2 = Student("Bob")
print(s1.name, s2.name)              # Alice Bob
print(s1.university, s2.university)  # Delhi University Delhi University
```

Initially neither instance has its own `university`, so both find it on
`Student`. Changing the class attribute changes what they find:

```python
Student.university = "IIT Delhi"
print(s1.university)  # IIT Delhi
print(s2.university)  # IIT Delhi
```

Now assign through just one instance:

```python
s1.university = "Stanford"
print(s1.university)       # Stanford
print(s2.university)       # IIT Delhi
print(Student.university)  # IIT Delhi
print(s1.__dict__)         # {'name': 'Alice', 'university': 'Stanford'}
```

For this ordinary attribute, assignment through `s1` creates an instance
attribute. It **shadows** the class attribute: both values still exist, but
looking through `s1` finds the instance value. Deleting `s1.university` would
make `s1` find `Student.university` again.

## 4. How Python finds an attribute

For the ordinary attributes in these examples, use this simple model for
`s1.university`:

1. Check `s1` for an instance attribute with that name.
2. If there is none, look on `Student` and then its parent classes in method
   resolution order (MRO).
3. If the name cannot be found, raise `AttributeError`.

This is a useful starting model, not the complete lookup algorithm. Some
descriptors, including properties, take priority over the instance dictionary;
custom attribute hooks can change lookup too. We'll explore those later.

## 5. Common mistake: a shared mutable class attribute

A class attribute can refer to a mutable object, such as a list. All instances
that find that class attribute can access the **same list**:

```python
class Student:
    subjects = []

    def __init__(self, name):
        self.name = name

s1 = Student("Alice")
s2 = Student("Bob")
s1.subjects.append("Maths")
print(s1.subjects)  # ['Maths']
print(s2.subjects)  # ['Maths']
```

`append` changes the existing list; it does not assign a new attribute to
`s1`. That is different from `s1.subjects = [...]`, which would ordinarily
create a separate instance attribute and shadow the class attribute.

If each student should have their own subjects, create a list for each one:

```python
class Student:
    def __init__(self, name):
        self.name = name
        self.subjects = []

s1 = Student("Alice")
s2 = Student("Bob")
s1.subjects.append("Maths")
print(s1.subjects)  # ['Maths']
print(s2.subjects)  # []
```

Use instance attributes for individual state. Use class attributes for values
that really belong to the class or are intentionally shared. Shared mutable
state is not automatically wrong, but it should be deliberate.

## 6. Identity and equality

`is` asks whether two references point to the **same object**. `==` asks
whether the objects compare **equal**, according to their equality behavior.

```python
class Student:
    def __init__(self, name):
        self.name = name

s1 = Student("Alice")
s2 = Student("Alice")
s3 = s1

print(s1 is s2)  # False
print(s1 == s2)  # False
print(s3 is s1)  # True
```

`s1` and `s2` are separate instances, even though their names match. This class
does not define custom equality, so its instances use identity-based default
equality. `s3 = s1` does not make a copy: both names refer to the same object.

A class can define `__eq__` to compare values instead. Then two distinct
objects may be equal with `==` while still being different with `is`. Use
`is None` when checking for `None`; do not use `is` as a general replacement
for value comparison.

## 7. What happens when a class is called?

For a normal class, `Student("Alice")` has two main stages:

1. `__new__` creates and returns an instance.
2. `__init__` initializes that instance with the supplied arguments.

```text
Student("Alice") → __new__ creates an instance
                 → __init__ sets its initial attributes
                 → the call returns the instance
```

`__init__` initializes an existing object; it does not create it, and it must
return `None`. You usually only write `__init__`. Custom `__new__` is useful
in special cases, including some immutable types. If `__new__` returns an
object that is not an instance of the class being called, Python does not call
that class's `__init__` on it. A custom metaclass can also change the overall
calling process.

## Check your understanding

What does this print? Try to reason about where each `company` value lives
before running it.

```python
class Employee:
    company = "Google"

    def __init__(self, name):
        self.name = name

e1 = Employee("Alice")
e2 = Employee("Bob")
e1.company = "Microsoft"
Employee.company = "Amazon"
print(e1.company)
print(e2.company)
```

Choices: **A.** Microsoft, Amazon · **B.** Amazon, Amazon · **C.** Microsoft,
Google · **D.** Google, Amazon.

[Check the answer and reasoning](../questions/employee-attribute-shadowing.md).
For more practice, consider what would happen after `del e1.company`.

## Key takeaways

- Instances keep individual state; methods defined on the class provide shared behavior.
- Ordinary instance attributes can shadow class attributes of the same name.
- Mutating a shared class-level list affects everyone using that list.
- `is` checks identity; `==` uses equality behavior.
- `__new__` creates an object and `__init__` normally initializes it.

Continue to [Constructors and `self` in Depth](constructors-and-self.md) for
initialization, method calls, default arguments, and mutable defaults.
