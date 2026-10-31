---
id: python-generator-file-memory
kind: question
topicId: python-iterators-generators
lessonId: lesson-python-generator-functions
prompt: "Why can a generator help process a large file with less memory?"
difficulty: easy
frequent: false
status: published
revision: 1
order: 34
tags: [python, generators, files]
---

## Answer

It can produce matching lines incrementally rather than materializing the
entire file or output. Memory still depends on buffering, line sizes, retained
state, and how the consumer uses the results.
