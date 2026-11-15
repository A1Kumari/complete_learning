---
id: python-testing-mock-lookup
kind: question
topicId: python-testing-debugging
lessonId: lesson-python-testing-debugging
prompt: Where should you patch a dependency in a Python unit test?
difficulty: medium
status: published
revision: 1
order: 190
tags: [python, testing, mocking]
---

## Answer

Patch the name where the code under test looks it up, which may differ from the module where the object was originally defined. Keep integration tests for real boundaries and avoid mocking behavior the test is meant to verify.
