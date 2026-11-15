---
id: lesson-python-design-practices
kind: lesson
topicId: python-design-practices
title: Maintainable Python Design
summary: Apply readable interfaces, composition, dependency injection, and practical quality tools.
difficulty: medium
status: published
revision: 1
order: 200
tags: [python, design]
prerequisiteIds: [lesson-python-oop, lesson-python-testing-debugging]
---

## Design for change

Prefer small functions with clear inputs and outputs, descriptive names, and cohesive modules. PEP 8 provides style guidance; consistency and readability matter more than mechanically following every suggestion. SOLID principles are design heuristics, not a requirement to create a class for every function.

Use composition to combine responsibilities and dependency injection to supply external services. A simple callable or protocol is often enough; introduce patterns when they solve a real problem.

```python
def send_welcome(name, send_message):
    send_message(f"Welcome, {name}!")

messages = []
send_welcome("Ada", messages.append)
assert messages == ["Welcome, Ada!"]
```

## Refactoring and tooling

Refactor in small steps protected by tests, preserving externally visible behavior. Separate domain decisions from I/O boundaries where it improves clarity. Avoid leaking infrastructure details across the entire application.

Ruff can lint and format Python; mypy can check annotated code. Configure tools in `pyproject.toml`, run them in CI, and review their findings rather than treating them as a substitute for design review. Choose a supported Python version and document public APIs and assumptions.

## Practice

Refactor a function that downloads data, calculates a result, and prints it into separately testable operations. Identify where dependencies should be injected.
