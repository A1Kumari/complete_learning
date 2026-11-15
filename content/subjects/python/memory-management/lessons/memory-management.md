---
id: lesson-python-memory-management
kind: lesson
topicId: python-memory-management
title: Object Lifetimes and Memory
summary: Understand references, garbage collection, weak references, and memory investigation.
difficulty: hard
status: published
revision: 1
order: 150
tags: [python, memory]
prerequisiteIds: [lesson-python-data-model]
---

## References and collection

Names and containers hold references to objects. In CPython, reference counting usually reclaims objects when their reference count reaches zero, while a cyclic garbage collector finds unreachable reference cycles. This is an implementation detail; other Python implementations need not release objects immediately.

`del name` removes one binding, not necessarily the object. A reachable cache or global collection can retain objects indefinitely even when the application no longer needs them. Use context managers for timely resource cleanup rather than relying on object finalization.

## Measuring retention

```python
import tracemalloc

tracemalloc.start()
before = tracemalloc.take_snapshot()
values = [str(i) for i in range(10000)]
after = tracemalloc.take_snapshot()
for stat in after.compare_to(before, "lineno")[:3]:
    print(stat)
```

Snapshots compare traced Python allocation sites; they do not account for all native memory or prove a leak. Take repeated measurements under representative workloads and inspect retained references. `weakref` can reference supported objects without keeping them alive; not all built-in objects support weak references.

`__slots__` can reduce per-instance overhead by restricting instance attributes, but affects inheritance, weak references, and dynamic attributes. Measure before adding it.

## Practice

Create a bounded cache, compare allocation snapshots across repeated operations, and explain why removing one name might not free an object.
