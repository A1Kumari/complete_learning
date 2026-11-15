---
id: python-typing-runtime-validation
kind: question
topicId: python-typing-validation
lessonId: lesson-python-typing-validation
prompt: Do Python type hints validate data received from an API?
difficulty: easy
status: published
revision: 1
order: 120
tags: [python, typing, validation]
---

## Answer

No. Type hints support documentation and static analysis but generally do not enforce values at runtime. Validate untrusted API data explicitly or with a runtime validation library, including any necessary business rules.
