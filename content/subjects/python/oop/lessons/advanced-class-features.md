---
id: lesson-python-oop-advanced-class-features
kind: lesson
topicId: python-oop
title: Advanced Class Features
summary: Learn when to use dataclasses, slots, properties, descriptors, and mixins to build clear Python classes.
difficulty: hard
status: published
revision: 1
order: 110
tags: [python, oop, dataclasses, descriptors, mixins]
prerequisiteIds: [lesson-python-oop-composition-relationships]
---

## Where this lesson fits

**Intermediate Python · OOP · Lesson 11 of 12**

In [Composition and Object Relationships](composition-object-relationships.md),
we explored how objects collaborate. Now we will look at class features that
reduce repetition, manage attributes, and share behavior. Examples use Python
3.10 or later where `dataclass(slots=True)` and `list[str]` are used.

## 1. Dataclasses

A data-holding class often needs an initializer, a readable representation, and
equality comparisons. `@dataclass` can generate these from annotated fields:

```python
from dataclasses import dataclass

@dataclass
class Student:
    name: str
    age: int
    marks: int

student = Student("Alice", 20, 90)
print(student)  # Student(name='Alice', age=20, marks=90)
print(student == Student("Alice", 20, 90))  # True
```

By default, dataclasses generate `__init__`, `__repr__`, and field-based
`__eq__`. Annotations help readers, editors, and static checkers, but they do
not automatically validate values at runtime. For example, `Student("Alice",
"twenty", 90)` is accepted unless the class adds validation.

Defaults work like function defaults: required positional fields normally come
before fields with defaults, including inherited fields. Keyword-only fields
provide another option when that ordering is inconvenient.

```python
from dataclasses import dataclass

@dataclass
class Student:
    name: str
    marks: int = 0

print(Student("Alice"))    # Student(name='Alice', marks=0)
print(Student("Bob", 90))  # Student(name='Bob', marks=90)
```

## 2. Mutable defaults and factories

Use `field(default_factory=...)` when each instance needs a fresh mutable
default. Modern dataclasses reject common unhashable defaults such as `[]`.

```python
from dataclasses import dataclass, field

@dataclass
class Student:
    name: str
    courses: list[str] = field(default_factory=list)

s1 = Student("Alice")
s2 = Student("Bob")
s1.courses.append("Python")
print(s1.courses)  # ['Python']
print(s2.courses)  # []
```

Pass the callable `list`, not `list()`: the factory is called without arguments
when a default is needed. `dict`, `set`, or a suitable zero-argument function
can be factories too. Explicitly passing the same list to multiple instances
can still make them share it.

## 3. Validation with `__post_init__`

The generated initializer calls `__post_init__` when it is defined, after
assigning fields. Use it for validation or derived initialization:

```python
from dataclasses import dataclass

@dataclass
class Student:
    name: str
    marks: int

    def __post_init__(self):
        if not 0 <= self.marks <= 100:
            raise ValueError("Marks must be between 0 and 100")

print(Student("Alice", 90))  # Student(name='Alice', marks=90)
# Student("Bob", 150) raises ValueError.
```

If you write your own `__init__`, it must call `__post_init__` itself if that
behavior is needed. This range check does not by itself require an integer;
add explicit type validation if your application needs that rule.

## 4. Frozen and ordered dataclasses

`frozen=True` blocks ordinary attribute assignment and deletion, making it
useful for value objects. `replace` creates a new instance with changed fields:

```python
from dataclasses import dataclass, replace

@dataclass(frozen=True)
class Point:
    x: int
    y: int

point = Point(2, 3)
print(replace(point, x=10))  # Point(x=10, y=3)
# point.x = 10 raises FrozenInstanceError.
```

Frozen is not deep immutability: a list stored in a frozen field can still be
mutated. Use immutable fields when the value must not change. Generated hashing
also depends on the dataclass options and on its fields being hashable.

```python
from dataclasses import dataclass

@dataclass(order=True)
class Score:
    marks: int
    attempts: int

print(Score(90, 2) > Score(85, 1))  # True
```

Ordering compares included fields in declaration order and requires equality
generation. `field(compare=False)` excludes a field from generated comparison;
`field(repr=False)` excludes it from the representation. Other useful options
include `eq=False`, `repr=False`, `slots=True`, and `kw_only=True`. See the
[dataclasses documentation](https://docs.python.org/3/library/dataclasses.html)
for version-specific details.

## 5. `__slots__`

Ordinary instances commonly have a `__dict__` and accept new attributes.
Slots declare storage for specific names and can avoid that dictionary:

```python
class Student:
    __slots__ = ("name", "age")

    def __init__(self, name, age):
        self.name = name
        self.age = age

student = Student("Alice", 20)
print(student.name, student.age)  # Alice 20
# student.city = "Delhi" and student.__dict__ raise AttributeError here.
```

Slot values are not stored in a dictionary named `__slots__`. For many small
instances, avoiding per-instance dictionaries can save memory, but measure the
actual workload. Slots restrict flexibility; weak references may need a
`__weakref__` slot, and some libraries expect `__dict__`.

Inheritance matters: a subclass that does not declare slots can gain an
instance dictionary, and a base class may already provide one. Dataclasses can
generate slotted classes with `@dataclass(slots=True)`; this option returns a
new class object. Consult the [data model reference](https://docs.python.org/3/reference/datamodel.html#slots)
for details and inheritance restrictions.

## 6. Properties backed by one value

Properties can present different views of one underlying value without storing
inconsistent copies:

```python
class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius

    @property
    def celsius(self):
        return self._celsius

    @celsius.setter
    def celsius(self, value):
        if value < -273.15:
            raise ValueError("Below absolute zero")
        self._celsius = value

    @property
    def fahrenheit(self):
        return self._celsius * 9 / 5 + 32

    @fahrenheit.setter
    def fahrenheit(self, value):
        self.celsius = (value - 32) * 5 / 9

temp = Temperature(20)
print(temp.celsius, temp.fahrenheit)  # 20 68.0
temp.fahrenheit = 212
print(temp.celsius)  # 100.0
```

The Fahrenheit setter goes through the Celsius setter, so both paths use the
same validation. Floating-point conversion can introduce small rounding errors.

## 7. Cached properties

`functools.cached_property` stores the computed result on the instance after
the first access. It can become stale if its inputs change:

```python
from functools import cached_property

class DataAnalysis:
    def __init__(self, numbers):
        self.numbers = list(numbers)

    @cached_property
    def total(self):
        print("Calculating total...")
        return sum(self.numbers)

analysis = DataAnalysis([10, 20, 30])
print(analysis.total)  # Calculates, then prints 60.
print(analysis.total)  # 60, using the cached value.
analysis.numbers.append(40)
print(analysis.total)  # 60: the cache is stale.
del analysis.total
print(analysis.total)  # Calculates again, then prints 100.
```

Unlike a regular property, the standard cached property writes to an instance
dictionary, so it generally cannot be used with slots-only instances lacking
`__dict__`. Use it when inputs are stable or you can reliably invalidate the
cache. Concurrent first accesses may calculate more than once; do not assume
the getter runs exactly once across threads.

## 8. Descriptors

A descriptor is an object that implements descriptor methods, usually stored
as a class attribute. It can provide reusable attribute behavior:

| Method | Role |
| --- | --- |
| `__get__(self, instance, owner)` | Read the managed attribute. |
| `__set__(self, instance, value)` | Assign the managed attribute. |
| `__delete__(self, instance)` | Delete the managed attribute. |
| `__set_name__(self, owner, name)` | Receive its name when the owning class is created. |

`__set_name__` is a class-creation notification hook, not itself one of the
three methods that make an object a descriptor. Here is reusable non-negative
validation for two different attributes:

```python
class NonNegative:
    def __set_name__(self, owner, name):
        self.storage_name = "_" + name

    def __get__(self, instance, owner):
        if instance is None:
            return self
        return getattr(instance, self.storage_name)

    def __set__(self, instance, value):
        if value < 0:
            raise ValueError("Value cannot be negative")
        setattr(instance, self.storage_name, value)

class Product:
    price = NonNegative()

    def __init__(self, name, price):
        self.name = name
        self.price = price

class Employee:
    salary = NonNegative()

    def __init__(self, name, salary):
        self.name = name
        self.salary = salary

product = Product("Laptop", 50000)
employee = Employee("Alice", 80000)
print(product.price)    # 50000
print(employee.salary)  # 80000
# product.price = -100 raises ValueError.
```

The descriptor is shared by instances of its owning class, while each value is
stored on the individual instance as `_price` or `_salary`. The two classes use
separate descriptor instances. Storing under the managed name itself would
trigger the descriptor again and cause recursion. This simple example assumes
numeric values and available instance storage; reusable production descriptors
need an appropriate storage strategy and input contract.

## 9. Data and non-data descriptor precedence

A **data descriptor** defines `__set__` or `__delete__`; a **non-data
descriptor** defines `__get__` without either. Under standard instance lookup,
Python first finds the relevant class attribute in the MRO. A readable data
descriptor takes priority over an instance dictionary entry; otherwise the
instance dictionary comes before a non-data descriptor or ordinary class value.
If lookup fails, `__getattr__` may provide a fallback. Custom attribute hooks
can change this behavior.

Ordinary functions in classes are non-data descriptors, so an instance
attribute can shadow a method. A property is a data descriptor:

```python
class Student:
    @property
    def age(self):
        return 20

student = Student()
student.__dict__["age"] = 99
print(student.age)  # 20: the property takes precedence.
# student.age = 21 raises AttributeError because there is no setter.
```

Descriptors also help explain bound methods, class methods, static methods,
properties, and cached properties. See the [Descriptor Guide](https://docs.python.org/3/howto/descriptor.html)
for the full lookup rules.

## 10. Mixins

A mixin is an ordinary class designed to contribute a small, reusable behavior.
There is no special `mixin` keyword:

```python
class LoggingMixin:
    def log(self, message):
        print(f"[{type(self).__name__}] {message}")

class Employee(LoggingMixin):
    def __init__(self, name):
        self.name = name

class Product(LoggingMixin):
    def __init__(self, name):
        self.name = name

Employee("Alice").log("Employee created")  # [Employee] Employee created
Product("Laptop").log("Product created")   # [Product] Product created
```

Mixins commonly participate in multiple inheritance. A cooperative mixin can
add behavior and delegate to the next implementation in the MRO:

```python
class AuditMixin:
    def save(self):
        print("Audit: save requested")
        return super().save()

class FileStorage:
    def save(self):
        print("Data saved to disk")

class AuditedStorage(AuditMixin, FileStorage):
    pass

AuditedStorage().save()
# Audit: save requested
# Data saved to disk
```

`AuditMixin` assumes a later class provides a compatible `save`. If none does,
the call fails. Keep mixins focused, document their requirements, and check MRO
and `super()` cooperation. Composition may be simpler for complex behavior.

## 11. Putting it together: a shopping cart

```python
from dataclasses import dataclass

@dataclass(frozen=True, slots=True)
class Product:
    name: str
    price: int

    def __post_init__(self):
        if self.price < 0:
            raise ValueError("Price cannot be negative")

@dataclass(frozen=True, slots=True)
class CartLine:
    product: Product
    quantity: int

    def __post_init__(self):
        if self.quantity <= 0:
            raise ValueError("Quantity must be positive")

    @property
    def subtotal(self):
        return self.product.price * self.quantity

class LoggingMixin:
    def log(self, message):
        print(f"[LOG] {message}")

class ShoppingCart(LoggingMixin):
    def __init__(self):
        self._lines = []

    def add(self, product, quantity):
        self._lines.append(CartLine(product, quantity))
        self.log(f"Added {quantity} x {product.name}")

    @property
    def total(self):
        return sum(line.subtotal for line in self._lines)

    def __len__(self):
        return len(self._lines)

cart = ShoppingCart()
cart.add(Product("Laptop", 50000), 1)
cart.add(Product("Mouse", 1000), 2)
print(f"Cart lines: {len(cart)}")
print(f"Total: {cart.total}")
# [LOG] Added 1 x Laptop
# [LOG] Added 2 x Mouse
# Cart lines: 2
# Total: 52000
```

Frozen dataclasses model product and line values; the cart remains mutable.
The cart owns lines and asks each for its subtotal. No custom descriptor is
needed: `__post_init__` handles these initial checks. This simplified example
assumes suitable numeric inputs; production code needs appropriate money
representation, inventory rules, and stronger validation.

## 12. Choosing a feature

| Need | Consider |
| --- | --- |
| Structured data and generated methods | `@dataclass` |
| Fresh mutable default | `field(default_factory=...)` |
| Initial validation | `__post_init__` or validated properties |
| Prevent ordinary reassignment | `frozen=True` |
| Many small instances with predictable storage | Measure `__slots__` |
| Calculated or validated attribute | `@property` |
| Expensive result with stable inputs | `@cached_property` and cache invalidation |
| Reusable attribute-access behavior | Descriptor |
| Small shared capability | Mixin |

Avoid assuming annotations validate types, frozen means deeply immutable, or
slots always improve performance. Use the simplest mechanism that fits.

## Check your understanding

1. [Why use `default_factory=list`?](../questions/dataclass-default-factory.md)
2. [What can slots improve?](../questions/slots-memory.md)
3. [Which attribute takes precedence over an instance dictionary?](../questions/descriptor-precedence.md)
4. [What happens when a cached property's input changes?](../questions/cached-property-stale.md)
5. [What is a mixin for?](../questions/mixin-purpose.md)

## Coding challenge

Create a frozen, slotted `Student` dataclass with roll number, name, and marks.
Validate marks between 0 and 100 and expose a computed `grade` property. Build
a mutable `Classroom` that adds students and exposes average marks as a
property. Decide what an empty classroom's average should mean and test that
case. Optionally add a focused `LoggingMixin` to record additions.

Think about whether caching the average is appropriate when students can be
added: if you cache it, define and test an invalidation strategy.

**Next:** [OOP Design Principles, SOLID & Best Practices](oop-design-principles.md)
covers coupling, cohesion, design patterns, and refactoring.
