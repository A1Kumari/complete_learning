---
id: lesson-python-oop-composition-relationships
kind: lesson
topicId: python-oop
title: Composition and Object Relationships
summary: Model associations and ownership, delegate work, inject dependencies, and choose composition or inheritance deliberately.
difficulty: medium
status: published
revision: 1
order: 100
tags: [python, oop, composition, relationships]
prerequisiteIds: [lesson-python-oop-abstraction]
---

## Where this lesson fits

**Intermediate Python · OOP · Lesson 10 of 12**

Real applications contain objects that collaborate: customers place orders,
orders contain lines, and services process payments. This lesson builds on
[Abstraction in Python](abstraction.md). Lesson 9, Special Methods, is planned
but not yet published; you do not need it to follow these examples.

## 1. Why objects need relationships

An order is not a kind of product. It contains products and uses their data:

```python
class Product:
    def __init__(self, name, price):
        self.name = name
        self.price = price

class Order:
    def __init__(self, products):
        self.products = list(products)

    def total(self):
        return sum(product.price for product in self.products)

laptop = Product("Laptop", 50000)
mouse = Product("Mouse", 1000)
order = Order([laptop, mouse])
print(order.total())  # 51000
```

`list(products)` creates a new list, not new product objects. The order holds
references to the existing products. Choosing how objects cooperate is as
important as choosing their individual attributes and methods.

## 2. Is-a, has-a, and uses-a

| Relationship | Example | Common modeling approach |
| --- | --- | --- |
| Is-a | A dog is an animal. | Inheritance for a genuine specialization. |
| Has-a | A car has an engine. | An attribute referencing a component. |
| Uses-a | A report generator uses a printer. | Pass or store a dependency. |

These are useful starting questions, not strict rules. A reference alone does
not tell us whether an object owns the referenced object.

## 3. Association

Association is a general relationship or interaction between objects. A
teacher can teach a student without either object being a part of the other:

```python
class Teacher:
    def __init__(self, name):
        self.name = name

    def teach(self, student):
        print(f"{self.name} is teaching {student.name}")

class Student:
    def __init__(self, name):
        self.name = name

teacher = Teacher("Mr. Sharma")
student = Student("Alice")
teacher.teach(student)  # Mr. Sharma is teaching Alice
```

Here the student is passed for one call. The teacher could instead store a
list of students for a longer-lived relationship. Association can be one-way
or two-way and does not by itself imply ownership. Terminology varies: a
temporary use like this is also often called a dependency.

## 4. Aggregation: independent parts

Aggregation describes a whole that groups parts which can exist independently.
Teachers can exist independently of a department and may transfer elsewhere:

```python
class Teacher:
    def __init__(self, name):
        self.name = name

class Department:
    def __init__(self, name, teachers):
        self.name = name
        self.teachers = list(teachers)

t1 = Teacher("Alice")
t2 = Teacher("Bob")
department = Department("Computer Science", [t1, t2])
print([teacher.name for teacher in department.teachers])  # ['Alice', 'Bob']
del department
print(t1.name, t2.name)  # Alice Bob
```

The department's list contains references to the teachers. `del department`
removes that name's reference; it does not necessarily destroy the department
immediately or dictate the lifetime of its teachers.

## 5. Composition: owned components

Composition models a whole that conceptually owns parts of its structure. In
this simple domain, a house creates rooms belonging to that house:

```python
class Room:
    def __init__(self, name):
        self.name = name

    def describe(self):
        print(f"This is the {self.name}")

class House:
    def __init__(self):
        self.bedroom = Room("Bedroom")
        self.kitchen = Room("Kitchen")

    def show_rooms(self):
        self.bedroom.describe()
        self.kitchen.describe()

House().show_rooms()
# This is the Bedroom
# This is the Kitchen
```

The house delegates room-specific behavior to its components. Ownership is a
domain decision, not a special Python keyword or an automatic lifetime rule.

## 6. Ownership and object lifetime

An external reference can keep a component accessible after the name of the
whole is deleted:

```python
class Engine:
    def __init__(self):
        self.power = 150

class Car:
    def __init__(self):
        self.engine = Engine()

car = Car()
engine_ref = car.engine
del car
print(engine_ref.power)  # 150
```

Python manages object lifetime through references and its memory-management
mechanisms. If a business rule requires deleting an order's lines when the
order is deleted, the application or storage system must implement that rule.

| Relationship | Meaning | Example |
| --- | --- | --- |
| Association | Objects interact or are connected. | Teacher teaches student. |
| Aggregation | A whole groups independent parts. | Department has teachers. |
| Composition | A whole conceptually owns components. | Order contains order lines. |

The distinction depends on the domain and ownership contract, not merely on
where an object is constructed. A car engine, for example, may be modeled as
an independent replaceable object in a vehicle-management application. In UML,
association uses a plain line, aggregation a hollow diamond, and composition a
filled diamond; the diamond is at the whole end.

## 7. Putting relationships together: orders

A catalog product can exist independently; an order line belongs to a
particular order and records the price when the line is created:

```python
class Product:
    def __init__(self, name, price):
        if price < 0:
            raise ValueError("Invalid price")
        self.name = name
        self.price = price

class OrderLine:
    def __init__(self, product, quantity):
        if quantity <= 0:
            raise ValueError("Invalid quantity")
        self.product = product
        self.quantity = quantity
        self.unit_price = product.price

    def subtotal(self):
        return self.unit_price * self.quantity

class Order:
    def __init__(self):
        self._lines = []

    def add_product(self, product, quantity):
        self._lines.append(OrderLine(product, quantity))

    def total(self):
        return sum(line.subtotal() for line in self._lines)

laptop = Product("Laptop", 50000)
mouse = Product("Mouse", 1000)
order = Order()
order.add_product(laptop, 1)
order.add_product(mouse, 2)
mouse.price = 1500
print(order.total())  # 52000: existing lines retain their unit prices
```

The order creates its lines; each line references a product. Saving
`unit_price` prevents later catalog price changes from silently changing this
order's total. This teaching example uses simple numeric prices; real money
calculations require an appropriate representation and stronger validation.

## 8. Delegation

Delegation means asking another object to perform work rather than doing all
of it yourself:

```python
class Engine:
    def start(self):
        print("Engine started")

    def stop(self):
        print("Engine stopped")

class Car:
    def __init__(self):
        self.engine = Engine()

    def start(self):
        print("Preparing car...")
        self.engine.start()

    def stop(self):
        self.engine.stop()
        print("Car stopped")

car = Car()
car.start()
car.stop()
# Preparing car...
# Engine started
# Engine stopped
# Car stopped
```

The car manages vehicle-level behavior; the engine handles its own operation.
Separating responsibilities makes components easier to understand and change.

## 9. Dependency injection

Instead of having `Car` always construct a particular engine, supply the
dependency from outside. Supplying it to `__init__` is **constructor injection**:

```python
class PetrolEngine:
    def start(self):
        print("Petrol engine started")

class ElectricMotor:
    def start(self):
        print("Electric motor activated")

class Car:
    def __init__(self, engine):
        self.engine = engine

    def start(self):
        self.engine.start()
        print("Car is ready")

Car(PetrolEngine()).start()
# Petrol engine started
# Car is ready
Car(ElectricMotor()).start()
# Electric motor activated
# Car is ready
```

`Car` expects a compatible `start()` method, so different implementations can
be supplied. A small fake can verify delegation without a real engine:

```python
# Continue with the Car class above.
class FakeEngine:
    def __init__(self):
        self.started = False

    def start(self):
        self.started = True

fake = FakeEngine()
Car(fake).start()    # Car is ready
print(fake.started)  # True
```

Injection describes **how** a dependency is supplied; aggregation and
composition describe the intended ownership relationship. An injected object
may be shared, independently owned, or transferred, depending on the design.

## 10. Relationship cardinality

Cardinality describes how many objects can be related:

- **One-to-one:** a user has one profile, if the domain enforces that rule.
- **One-to-many:** a department has multiple teachers.
- **Many-to-many:** students take multiple courses, each with multiple students.

A reference alone does not enforce uniqueness. For a bidirectional many-to-many
association, both sides must stay consistent:

```python
class Student:
    def __init__(self, name):
        self.name = name
        self.courses = []

class Course:
    def __init__(self, title):
        self.title = title
        self.students = []

    def enroll(self, student):
        if student not in self.students:
            self.students.append(student)
            student.courses.append(self)

alice = Student("Alice")
bob = Student("Bob")
python = Course("Python")
java = Course("Java")
python.enroll(alice)
python.enroll(bob)
java.enroll(alice)
print([student.name for student in python.students])  # ['Alice', 'Bob']
print([course.title for course in alice.courses])    # ['Python', 'Java']
```

In a larger design, protect the lists and centralize both enrollment and
removal so callers cannot easily update only one side.

## 11. Composition versus inheritance

Composition can keep independently varying features separate. A notification
can hold its message and delegate delivery to a supplied sender:

```python
class EmailSender:
    def send(self, message):
        print(f"Email: {message}")

class SMSSender:
    def send(self, message):
        print(f"SMS: {message}")

class Notification:
    def __init__(self, message, sender):
        self.message = message
        self.sender = sender

    def deliver(self):
        self.sender.send(self.message)

Notification("Your order has shipped", EmailSender()).deliver()
Notification("Your code is 123456", SMSSender()).deliver()
# Email: Your order has shipped
# SMS: Your code is 123456
```

This avoids a subclass for every combination of notification content and
delivery method. Inheritance remains appropriate for a real specialization
whose subclasses satisfy the base class's behavioral expectations. Prefer the
relationship that fits the domain and keeps the design understandable.

## 12. Common mistakes

- Calling every stored reference composition without defining ownership.
- Using inheritance only to reuse a method when delegation fits better.
- Hardcoding replaceable dependencies throughout the design.
- Assuming logical ownership automatically controls garbage collection.
- Updating only one side of a bidirectional relationship.
- Creating extra classes where a simple function or data structure is clearer.

## Check your understanding

1. [What relationship fits a department and independent teachers?](../questions/aggregation-teachers.md)
2. [What is delegation?](../questions/delegation.md)
3. [Why use constructor dependency injection?](../questions/dependency-injection.md)
4. [Does composition force component destruction?](../questions/composition-lifetime.md)
5. [What relationship connects students and courses?](../questions/relationship-cardinality.md)

## Coding challenge

Build a university course-management system with `University`, `Department`,
`Professor`, and `Course`:

- A university has multiple departments, and each department offers courses.
- Professors can exist independently and transfer between departments.
- Each course has an assigned professor; a professor can teach multiple courses.

Decide and document which relationships represent ownership, independent
membership, or association. Test a professor transfer and make sure course
relationships remain consistent. As an extra challenge, inject a notification
sender into the university so announcements can use different delivery methods.

**Next:** [Advanced Class Features](advanced-class-features.md) covers
dataclasses, `__slots__`, descriptors, mixins, and related class design.
