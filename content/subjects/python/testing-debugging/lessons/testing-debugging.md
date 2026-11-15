---
id: lesson-python-testing-debugging
kind: lesson
topicId: python-testing-debugging
title: Testing and Debugging Python
summary: Test behavior, isolate dependencies, and diagnose failures with useful observability.
difficulty: medium
status: published
revision: 1
order: 190
tags: [python, testing, debugging]
prerequisiteIds: [lesson-python-functions-scope]
---

## Tests and fixtures

Write tests around observable behavior, including normal cases, boundaries, and failures. The standard library provides `unittest`; pytest offers fixtures and parametrization when installed. Fixtures manage reusable setup and cleanup. Parameterized cases make input/output expectations explicit.

```python
import pytest

@pytest.mark.parametrize("value, expected", [(0, 0), (3, 6), (-1, -2)])
def test_double(value, expected):
    assert value * 2 == expected
```

Mock slow or nondeterministic boundaries when necessary, but patch the name where the code under test looks it up and avoid asserting incidental implementation details. Keep integration tests for real interactions. Coverage shows which lines ran, not whether assertions are meaningful. Property-based tools such as Hypothesis can generate cases for invariants.

## Debugging and logging

Read the traceback from the failing operation upward, reproduce the issue, and narrow the cause. `breakpoint()` starts the configured debugger; inspect variables and step through the code. Use the `logging` module for structured, leveled diagnostic messages rather than printing sensitive data. Include useful context without logging secrets or personal data unnecessarily.

## Practice

Test a parser against valid, empty, and malformed input. Mock its file boundary and add one integration test with a temporary file.
