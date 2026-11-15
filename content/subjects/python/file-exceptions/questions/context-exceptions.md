---
id: python-files-cleanup-exceptions
kind: question
topicId: python-file-exceptions
lessonId: lesson-python-file-exceptions
prompt: How do you ensure a file closes when parsing it raises an exception?
difficulty: easy
status: published
revision: 1
order: 60
tags: [python, files, exceptions]
---

## Answer

Open it with a `with` statement. The file context manager closes the handle on leaving the block even if parsing fails. Catch specific recoverable exceptions outside the block and preserve the cause when translating an error.
