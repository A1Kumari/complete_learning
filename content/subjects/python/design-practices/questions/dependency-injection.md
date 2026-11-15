---
id: python-design-dependency-injection
kind: question
topicId: python-design-practices
lessonId: lesson-python-design-practices
prompt: How can dependency injection make Python code easier to test?
difficulty: medium
status: published
revision: 1
order: 200
tags: [python, design, testing]
---

## Answer

Pass a dependency, such as a callable or service object, into the code instead of constructing it internally. Tests can supply a controlled fake, while production supplies the real implementation. A framework is not required.
