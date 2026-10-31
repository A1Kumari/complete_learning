---
id: lesson-python-oop-inheritance
kind: lesson
topicId: python-oop
title: Inheritance in Python
summary: Build specialized classes, use super and method overriding, and understand multiple inheritance and method resolution order.
difficulty: medium
status: published
revision: 1
order: 60
tags: [python, oop, inheritance, mro]
prerequisiteIds: [lesson-python-oop-encapsulation]
---

## Where this lesson fits

**Intermediate Python · OOP · Lesson 6 of 12**

In [Encapsulation in Python](encapsulation.md), we learned to organize and
protect an object's state through a clear interface. Inheritance lets a class
build on another class. We will begin with simple examples and work toward
multiple inheritance and method resolution order. Examples use Python 3.

## 1. Why use inheritance?

Students and teachers are both people: they have names and ages and can
introduce themselves. Instead of repeating that behavior in each class, we can
put it in a common `Person` class:

```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def introduce(self):
        print(f"My name is {self.name}")

class Student(Person):
    def study(self):
        print(f"{self.name} is studying")

class Teacher(Person):
    def teach(self):
        print(f"{self.name} is teaching")

student = Student("Alice", 20)
teacher = Teacher("Bob", 35)
student.introduce()  # My name is Alice
student.study()      # Alice is studying
teacher.introduce()  # My name is Bob
teacher.teach()      # Bob is teaching
```

`Student` and `Teacher` inherit access to `Person`'s initializer and
`introduce` method, while adding their own behavior. `Person` is the **parent**
(also called a base class or superclass); the others are **children** (derived
classes or subclasses).

## 2. How inherited attributes are found

Inheritance normally does not copy every method into the child class. Python
looks through the class hierarchy when an attribute is requested:

```python
class Animal:
    def eat(self):
        print("Eating food")

class Dog(Animal):
    def bark(self):
        print("Woof!")

dog = Dog()
dog.eat()   # Eating food
dog.bark()  # Woof!
print("eat" in Dog.__dict__)     # False
print("eat" in Animal.__dict__)  # True
```

A child can define an attribute with the same name as one on its parent. Its
value then **shadows** the parent's value when looked up through the child:

```python
class Vehicle:
    wheels = 4

class Bike(Vehicle):
    wheels = 2

print(Vehicle.wheels)  # 4
print(Bike().wheels)   # 2
```

The parent attribute remains unchanged. Instance attributes and descriptors can
also affect attribute lookup, as discussed in earlier lessons.

## 3. Common inheritance structures

These names describe shapes of class relationships; they are not separate
Python language features:

- **Single:** `Dog(Animal)` has one direct parent.
- **Multilevel:** `Dog(Mammal)` and `Mammal(Animal)` form a chain.
- **Hierarchical:** `Dog(Animal)` and `Cat(Animal)` share a parent.
- **Multiple:** `Duck(Flyer, Swimmer)` has two direct parents.
- **Hybrid:** a hierarchy combines patterns, such as a diamond.

For example, a duck can inherit behavior from two small classes:

```python
class Flyer:
    def fly(self):
        print("Flying")

class Swimmer:
    def swim(self):
        print("Swimming")

class Duck(Flyer, Swimmer):
    pass

duck = Duck()
duck.fly()   # Flying
duck.swim()  # Swimming
```

If both parents define the same name, the method resolution order determines
which one is found first.

## 4. Initializers and `super()`

When a child does not define `__init__`, Python can find one on a parent. If
the child defines its own `__init__`, the parent initializer does **not** run
automatically. Call it when its setup is needed:

```python
class Person:
    def __init__(self, name):
        self.name = name

class Student(Person):
    def __init__(self, name, marks):
        super().__init__(name)
        self.marks = marks

s1 = Student("Alice", 90)
print(s1.name, s1.marks)  # Alice 90
```

Without the `super().__init__(name)` call, this `Student` initializer would not
set `name`, and accessing it would raise `AttributeError`. `super()` does not
create a second parent object: the initializer works on the same instance.

In this simple hierarchy `super().__init__(name)` finds `Person.__init__`.
Unlike the explicit call `Person.__init__(self, name)`, `super()` follows the
method resolution order. That difference matters in multiple inheritance.

## 5. Method overriding

A child **overrides** an inherited method by defining its own method with the
same name. It can replace the behavior or extend it with `super()`:

```python
class Animal:
    def speak(self):
        print("Animal makes a sound")

class Dog(Animal):
    def speak(self):
        super().speak()
        print("Woof!")

Dog().speak()
# Animal makes a sound
# Woof!
```

The parent method is still present; overriding does not erase it. Overriding
is different from traditional method **overloading**: defining multiple
methods with the same name in one Python class normally leaves only the last
definition. Defaults, variable arguments, and dispatch tools can provide
different forms of flexibility.

## 6. Multiple inheritance and the diamond

If two parents provide the same method, Python uses the method resolution
order (MRO) to decide where to look. Consider a diamond:

```text
       A
      / \
     B   C
      \ /
       D
```

```python
class A:
    def show(self):
        print("A")

class B(A):
    def show(self):
        print("B")
        super().show()

class C(A):
    def show(self):
        print("C")
        super().show()

class D(B, C):
    pass

print([cls.__name__ for cls in D.__mro__])
# ['D', 'B', 'C', 'A', 'object']
D().show()
# B
# C
# A
```

`D` does not define `show`, so lookup finds `B.show` first. Inside `B.show`,
`super().show()` continues **after B** in the MRO of this `D` instance, so it
finds `C.show`, not necessarily B's direct parent `A`. The next `super()` then
finds `A.show`. This cooperative chain works because the participating methods
call `super()` and accept compatible arguments.

Python calculates the MRO using **C3 linearization**. At a high level, it
keeps subclasses before their parents and respects the declared order of
direct bases consistently. If the constraints cannot be satisfied, defining
the class raises `TypeError`. Use `D.__mro__` or `D.mro()` to inspect the order;
ordinary Python 3 class hierarchies end with `object`.

## 7. `isinstance` and `issubclass`

```python
class Animal:
    pass

class Dog(Animal):
    pass

dog = Dog()
print(isinstance(dog, Dog))      # True
print(isinstance(dog, Animal))   # True
print(isinstance(dog, str))      # False
print(issubclass(Dog, Animal))   # True
print(issubclass(Animal, Dog))   # False
print(issubclass(Dog, Dog))      # True
```

`isinstance` asks about an object; `issubclass` asks about classes. In more
advanced cases, abstract base classes and metaclasses can customize these
checks, so they are not limited to a simple visible inheritance chain.

## 8. Class attributes and inheritance

Assigning an attribute on a child class normally shadows the parent value:

```python
class Animal:
    category = "Living Being"

class Dog(Animal):
    pass

print(Dog.category)       # Living Being
Dog.category = "Domestic Animal"
print(Dog.category)       # Domestic Animal
print(Animal.category)    # Living Being
```

Mutation is different from assignment. Here both classes initially find the
same list, so appending through `Dog` changes the list stored on `Animal`:

```python
class Animal:
    traits = []

class Dog(Animal):
    pass

Dog.traits.append("Loyal")
print(Dog.traits)     # ['Loyal']
print(Animal.traits)  # ['Loyal']
```

Remember also that an identifier such as `__value` inside a class definition
is name-mangled using that class's name. A child using the same spelling
normally gets a different mangled name; this prevents accidental collisions,
not deliberate access.

## 9. Inheritance or composition?

Inheritance is often appropriate for a genuine **is-a** relationship: a dog
is an animal. Composition is often clearer for a **has-a** or collaboration
relationship: a car has an engine; it is not a kind of engine.

```python
class Engine:
    def start(self):
        print("Engine started")

class Car:
    def __init__(self, engine):
        self.engine = engine

    def start_car(self):
        self.engine.start()
        print("Car is ready")

car = Car(Engine())
car.start_car()
# Engine started
# Car is ready
```

Passing the engine in makes it possible to provide another compatible engine.
Use inheritance when the child can reasonably fulfill the parent's expected
behavior, and consider composition when objects contain or collaborate with
one another. Composition will be explored further in a later lesson.

## 10. Practical example: employees and managers

```python
class Employee:
    company = "TechCorp"

    def __init__(self, name, salary):
        if salary < 0:
            raise ValueError("Invalid salary")
        self.name = name
        self.salary = salary

    def show_details(self):
        print(f"Name: {self.name}")
        print(f"Salary: {self.salary}")

    def annual_salary(self):
        return self.salary * 12

class Manager(Employee):
    def __init__(self, name, salary, department):
        super().__init__(name, salary)
        self.department = department

    def show_details(self):
        super().show_details()
        print(f"Department: {self.department}")

    def conduct_meeting(self):
        print(f"{self.name} is conducting a meeting")

employee = Employee("Alice", 50000)
manager = Manager("Bob", 80000, "Engineering")
employee.show_details()
print("---")
manager.show_details()
print(manager.annual_salary())
manager.conduct_meeting()
```

Output:

```text
Name: Alice
Salary: 50000
---
Name: Bob
Salary: 80000
Department: Engineering
960000
Bob is conducting a meeting
```

The manager initializer delegates shared setup and validation to `Employee`,
then adds `department`. Its `show_details` override extends the parent's
implementation, while `annual_salary` is inherited unchanged. The example
assumes salary represents a monthly amount and uses simplified numeric values.

## 11. Common mistakes

- Overriding `__init__` without performing parent setup needed by inherited methods.
- Assuming `super()` always means the direct parent rather than the next class in the MRO.
- Using inheritance solely to reuse a few functions when composition is clearer.
- Building deep hierarchies that are difficult to understand or maintain.
- Assuming an override changes the method stored on the parent class.

## Check your understanding

1. [Does a child initializer automatically run its parent's initializer?](../questions/inherited-initializer.md)
2. [What is the MRO of a simple diamond?](../questions/diamond-mro.md)
3. [Where can `super()` go in a diamond?](../questions/cooperative-super.md)
4. [Which relationship fits composition?](../questions/inheritance-composition.md)

## Coding challenge

Create a `LibraryItem` base class with a title, publication year, and
`display_info()` method. Add `Book` with an author and `Magazine` with an
issue number. Both subclasses should call `super()` during initialization and
override `display_info()` to include their extra information.

As an extra challenge, write a function that accepts either item and calls
`display_info()` without checking its exact type. Verify that each subclass
shows both the shared and its own fields.

**Next:** [Polymorphism in Python](polymorphism.md) covers overriding, duck
typing, polymorphic functions, and operator overloading.
