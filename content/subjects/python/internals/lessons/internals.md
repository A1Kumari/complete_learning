---
id: lesson-python-internals
kind: lesson
topicId: python-internals
title: Inside the Python Interpreter
summary: Follow source code through compilation, bytecode execution, frames, and imports.
difficulty: hard
status: published
revision: 1
order: 160
tags: [python, cpython, internals]
prerequisiteIds: [lesson-python-modules-packages]
---

## Source to execution

CPython parses source, compiles it into code objects containing bytecode, and executes that bytecode using its interpreter. A function call creates an execution frame containing its local execution state. `dis` displays bytecode for investigation, but opcodes and optimization strategies change across Python releases.

```python
import dis

def total(a, b):
    return a + b

dis.dis(total)
```

Compilation to bytecode does not mean Python has the same execution model as a native ahead-of-time compiled program. Recent CPython versions specialize some operations adaptively; behavior and implementation details vary by version and build.

## Imports and implementations

The import system checks `sys.modules`, then uses finders and loaders to locate and initialize a module. Bytecode caches such as `__pycache__` can avoid recompilation; they do not store a module's runtime state. Circular imports can observe a partially initialized module.

CPython is the reference implementation, not the language itself. PyPy and other implementations can differ in garbage collection, performance, and execution strategy. Depend on documented language behavior unless a CPython-specific tradeoff is intentional and tested.

## Practice

Disassemble a small function in your installed Python version and explain why its exact instructions should not be treated as a stable public API.
