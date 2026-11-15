---
id: python-memory-references
kind: question
topicId: python-memory-management
lessonId: lesson-python-memory-management
prompt: Does deleting a variable guarantee that its object is immediately freed?
difficulty: medium
status: published
revision: 1
order: 150
tags: [python, memory]
---

## Answer

No. `del` removes a binding; other references may still keep the object alive. Collection timing depends on the implementation and cycles. Use context managers for deterministic cleanup of external resources.
