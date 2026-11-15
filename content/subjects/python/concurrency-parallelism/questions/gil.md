---
id: python-concurrency-gil
kind: question
topicId: python-concurrency-parallelism
lessonId: lesson-python-concurrency-parallelism
prompt: Does the GIL make shared mutable state safe, and when might processes help?
difficulty: hard
status: published
revision: 1
order: 130
tags: [python, concurrency, gil]
misconception: The GIL does not make arbitrary multi-step operations atomic.
---

## Answer

No. Multi-step operations can interleave, so protect shared invariants with synchronization. In conventional GIL-enabled CPython, processes can parallelize CPU-bound Python work, at the cost of separate memory and communication overhead. Free-threaded builds and other implementations differ.
