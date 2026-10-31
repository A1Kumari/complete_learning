---
id: lesson-python-oop-design-principles
kind: lesson
topicId: python-oop
title: OOP Design Principles, SOLID & Best Practices
summary: Apply coupling, cohesion, SOLID, design patterns, and refactoring to build maintainable Python programs.
difficulty: hard
status: published
revision: 1
order: 120
tags: [python, oop, solid, design-patterns]
prerequisiteIds: [lesson-python-oop-advanced-class-features]
---

## Where this lesson fits

**Intermediate Python · OOP · Lesson 12 of 12**

Knowing class syntax is only the start. This final planned lesson brings
together the ideas from [Advanced Class Features](advanced-class-features.md)
and earlier published lessons to help you decide how to organize a program.
Lessons 1 and 9 are still planned and have not yet been published.

## 1. What makes a design maintainable?

Consider an online shop: it calculates prices, takes payment, stores orders,
and notifies customers. One large class could do all of this, but unrelated
changes would repeatedly touch the same code. As needs grow, separate focused
components can make testing and changes easier. A checkout service might
coordinate pricing, payment, and notification without implementing each one.

This does not mean every function needs its own class. Start simply, then
separate responsibilities when doing so makes the design easier to understand.

## 2. Coupling and cohesion

**Coupling** describes dependencies between components. **Cohesion** describes
how closely the responsibilities within a component belong together.

```python
class EmailSender:
    def send(self, message):
        print(f"Email: {message}")

class SMSSender:
    def send(self, message):
        print(f"SMS: {message}")

class OrderService:
    def __init__(self, notifier):
        self.notifier = notifier

    def place_order(self):
        print("Order placed")
        self.notifier.send("Order confirmed")

OrderService(EmailSender()).place_order()
OrderService(SMSSender()).place_order()
# Order placed
# Email: Order confirmed
# Order placed
# SMS: Order confirmed
```

The service is less coupled to a specific sender because the caller supplies
one. It still depends on a compatible `send` operation. Cohesion asks a
different question: do the operations inside each component serve a coherent
purpose? Aim for manageable coupling and focused responsibilities, without
fragmenting the program unnecessarily.

## 3. SOLID at a glance

| Principle | Question |
| --- | --- |
| Single Responsibility | Does this component have a coherent reason to change? |
| Open/Closed | Can expected variations be added without repeatedly rewriting stable code? |
| Liskov Substitution | Can a subtype preserve the promises callers rely on? |
| Interface Segregation | Does a caller depend only on operations it needs? |
| Dependency Inversion | Does important policy depend on suitable contracts rather than unnecessary implementation details? |

These are design guidelines, not a requirement to build elaborate hierarchies
for every program.

## 4. Single Responsibility Principle (SRP)

A component should have a focused responsibility or reason to change. A report
that calculates results, formats HTML, and writes files may change for three
different reasons. Separating those concerns can help:

```python
class Report:
    def __init__(self, values):
        self.values = values

    def average(self):
        return sum(self.values) / len(self.values)

class HTMLFormatter:
    def format(self, report):
        return f"<h1>Average: {report.average()}</h1>"

report = Report([80, 90, 100])
print(HTMLFormatter().format(report))  # <h1>Average: 90.0</h1>
```

The example assumes a nonempty list. A separate file-saving component can deal
with persistence. SRP does not mean one method per class: deposit and withdrawal
methods can both belong to the responsibility of managing an account.

## 5. Open/Closed Principle (OCP)

Make likely variations possible without repeatedly changing stable code. For
example, checkout can delegate discount calculations to an interchangeable
strategy:

```python
class PremiumDiscount:
    def apply(self, amount):
        return amount * 0.9

class FestivalDiscount:
    def apply(self, amount):
        return amount * 0.75

class Checkout:
    def __init__(self, discount):
        self.discount = discount

    def calculate_total(self, amount):
        return self.discount.apply(amount)

print(Checkout(PremiumDiscount()).calculate_total(1000))   # 900.0
print(Checkout(FestivalDiscount()).calculate_total(1000))  # 750.0
```

New compatible strategies can be supplied without changing `Checkout`. OCP
does not forbid fixing or modifying existing code; add extension points when
they address a real or likely need. These simple numeric examples are not a
money-handling implementation.

## 6. Liskov Substitution Principle (LSP)

A subtype should be usable where its parent is expected without breaking the
parent's behavioral promises. A base class that promises every bird can fly
cannot be honored by a penguin. Model the capability separately:

```python
class Bird:
    def eat(self):
        print("Eating")

class FlyingBird(Bird):
    def fly(self):
        print("Flying")

class Sparrow(FlyingBird):
    pass

class Penguin(Bird):
    def swim(self):
        print("Swimming")

def make_bird_fly(bird: FlyingBird):
    bird.fly()

make_bird_fly(Sparrow())  # Flying
Penguin().swim()          # Swimming
```

The annotation communicates a requirement to readers and static checkers; it
is not automatically enforced at runtime. LSP is about behavior, not only
matching method names: a subtype should not unexpectedly reject inputs promised
by the parent or violate its results and invariants.

## 7. Interface Segregation Principle (ISP)

Callers should not depend on operations they do not need. A function that only
prints does not need to require scanning and faxing too:

```python
from typing import Protocol

class Printable(Protocol):
    def print_document(self, text: str) -> None:
        ...

class SimplePrinter:
    def print_document(self, text: str) -> None:
        print(text)

def print_report(printer: Printable) -> None:
    printer.print_document("Annual Report")

print_report(SimplePrinter())  # Annual Report
```

The protocol describes the small interface this caller needs. ISP concerns
client-facing interfaces; SRP concerns a component's reasons to change.

## 8. Dependency Inversion Principle (DIP)

High-level policy should depend on appropriate abstractions rather than being
unnecessarily tied to a low-level implementation. Constructor injection is one
way to supply an implementation:

```python
from typing import Protocol

class OrderRepository(Protocol):
    def save(self, order: str) -> None:
        ...

class InMemoryRepository:
    def __init__(self):
        self.orders = []

    def save(self, order: str) -> None:
        self.orders.append(order)

class OrderService:
    def __init__(self, repository: OrderRepository):
        self.repository = repository

    def place_order(self, order: str) -> None:
        self.repository.save(order)

repository = InMemoryRepository()
OrderService(repository).place_order("Order #123")
print(repository.orders)  # ['Order #123']
```

DIP is about dependency direction; dependency injection is a technique for
supplying dependencies. Injecting a concrete object does not automatically
make a design independent of its concrete behavior. Small programs may not
need a formal protocol at all.

## 9. Four useful design patterns

A pattern is a reusable design idea, not a rule that must be applied everywhere.

### Strategy

Choose interchangeable behavior at runtime. The discount example above is a
strategy; a plain function can also be a strategy when an object adds no value.

### Simple factory

Centralize the choice of which object to create:

```python
class EmailSender:
    def send(self, message):
        print(f"Email: {message}")

class SMSSender:
    def send(self, message):
        print(f"SMS: {message}")

def make_sender(kind):
    senders = {"email": EmailSender, "sms": SMSSender}
    if kind not in senders:
        raise ValueError("Unknown notification type")
    return senders[kind]()

make_sender("email").send("Welcome!")  # Email: Welcome!
```

The mapping holds classes; calling the selected class creates an instance.
This simple factory is distinct from the more formal Factory Method pattern.

### Observer

Publish an event to subscribed callbacks without hardcoding each recipient:

```python
class EventPublisher:
    def __init__(self):
        self._observers = []

    def subscribe(self, observer):
        self._observers.append(observer)

    def publish(self, event):
        for observer in self._observers:
            observer(event)

def notify(event):
    print(f"Notification: {event}")

def analytics(event):
    print(f"Analytics: {event}")

publisher = EventPublisher()
publisher.subscribe(notify)
publisher.subscribe(analytics)
publisher.publish("Order placed")
# Notification: Order placed
# Analytics: Order placed
```

This synchronous example lets an observer exception interrupt delivery. A
real event system must define failure handling, ordering, duplicate subscriptions,
and any asynchronous behavior.

### Adapter

Translate an existing interface into one a caller expects:

```python
class ExternalGateway:
    def make_payment(self, amount):
        print(f"Gateway processed Rs {amount}")

class PaymentAdapter:
    def __init__(self, gateway):
        self.gateway = gateway

    def pay(self, amount):
        self.gateway.make_payment(amount)

def checkout(payment, amount):
    payment.pay(amount)

checkout(PaymentAdapter(ExternalGateway()), 500)  # Gateway processed Rs 500
```

The adapter lets checkout use `pay` while the gateway retains `make_payment`.

## 10. Code smells and refactoring

Code smells are signs to investigate, not proof that code is wrong:

| Smell | Possible response |
| --- | --- |
| A god class with unrelated duties | Separate coherent responsibilities. |
| Duplicate logic | Extract a shared function or component. |
| Repeated type-specific branches | Consider a common operation or strategy. |
| Deep inheritance | Consider composition where it fits. |
| Many concrete dependencies | Consider injection and small contracts. |
| Speculative abstraction | Simplify until a real need emerges. |

Refactoring improves internal structure while preserving observable behavior.
First understand existing behavior, write tests for important cases, make small
changes, and rerun the tests. Ordinary conditionals and simple functions are
often clearer than an unnecessary pattern.

## 11. Practical project: extensible checkout

This self-contained example combines immutable data, protocols, a discount
strategy, and injected payment and notification components. The payment is
simulated; values are `Decimal` to avoid binary floating-point money arithmetic.

```python
from dataclasses import dataclass
from decimal import Decimal
from typing import Protocol

@dataclass(frozen=True)
class Product:
    name: str
    price: Decimal

    def __post_init__(self):
        if self.price < 0:
            raise ValueError("Negative price")

@dataclass(frozen=True)
class CartItem:
    product: Product
    quantity: int

    def __post_init__(self):
        if self.quantity <= 0:
            raise ValueError("Invalid quantity")

class Discount(Protocol):
    def apply(self, amount: Decimal) -> Decimal:
        ...

class PaymentProcessor(Protocol):
    def pay(self, amount: Decimal) -> None:
        ...

class Notifier(Protocol):
    def send(self, message: str) -> None:
        ...

class PercentageDiscount:
    def __init__(self, percent: Decimal):
        if not Decimal("0") <= percent <= Decimal("100"):
            raise ValueError("Invalid discount")
        self.percent = percent

    def apply(self, amount: Decimal) -> Decimal:
        return amount * (Decimal("1") - self.percent / Decimal("100"))

class SimulatedPayment:
    def pay(self, amount: Decimal) -> None:
        print(f"Simulated payment: Rs {amount:.2f}")

class ConsoleNotifier:
    def send(self, message: str) -> None:
        print(f"Notification: {message}")

class CheckoutService:
    def __init__(self, discount: Discount, payment: PaymentProcessor, notifier: Notifier):
        self.discount = discount
        self.payment = payment
        self.notifier = notifier

    def checkout(self, items: list[CartItem]) -> Decimal:
        subtotal = sum((item.product.price * item.quantity for item in items), Decimal("0"))
        total = self.discount.apply(subtotal)
        self.payment.pay(total)
        self.notifier.send("Order confirmed")
        return total

items = [CartItem(Product("Laptop", Decimal("50000")), 1),
         CartItem(Product("Mouse", Decimal("1000")), 2)]
service = CheckoutService(PercentageDiscount(Decimal("10")),
                          SimulatedPayment(), ConsoleNotifier())
total = service.checkout(items)
print(f"Final total: Rs {total:.2f}")
# Simulated payment: Rs 46800.00
# Notification: Order confirmed
# Final total: Rs 46800.00
```

The service coordinates work through small contracts; the concrete components
can be replaced. `Decimal` alone does not define a currency's rounding policy;
real systems must choose explicit rounding and validate types and amounts.
Actual payments also need statuses, persistence, idempotency, and failure
recovery. A successful method return in this teaching example is not a real
payment confirmation.

## 12. Approach a design problem

Start with the behavior and rules: for a library, identify books, members,
loans, and borrowing rules. Decide who owns each responsibility and which
objects collaborate. Introduce replaceable policies or storage interfaces when
the requirements justify them. Test the important behavior, especially errors
and boundaries, before extracting components or changing the structure.

## Final knowledge check

1. [Which principle concerns unrelated responsibilities?](../questions/solid-srp.md)
2. [Which principle supports adding a payment implementation without rewriting checkout?](../questions/solid-ocp.md)
3. [Which principle concerns a subtype rejecting valid parent inputs?](../questions/solid-lsp.md)
4. [Which principle favors a focused printing interface?](../questions/solid-isp.md)
5. [Which principle favors a repository contract over a concrete database dependency?](../questions/solid-dip.md)

## Final coding challenge

Design a library system with books and members that supports borrowing and
returning, rejects unavailable books, and allows different borrowing policies.
Make notification delivery and storage replaceable. Use composition,
encapsulation, and protocols where they genuinely help; avoid unnecessary
layers. Add a fake repository and notifier to test successful borrowing,
unavailable books, returns, and policy limits without external services.

## Continue learning

This is the final planned OOP lesson, but the topic is still in progress:
Lessons 1 and 9 have not yet been published. The next curriculum topic,
**Python Data Model**, explores identity, references, equality, hashing,
attribute lookup, and object protocols.
