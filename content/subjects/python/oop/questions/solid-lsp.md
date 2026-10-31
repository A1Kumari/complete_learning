---
id: python-oop-solid-lsp
kind: question
topicId: python-oop
lessonId: lesson-python-oop-design-principles
prompt: "Which SOLID principle may be violated when a subtype rejects inputs its parent promises to accept?"
difficulty: medium
frequent: false
status: published
revision: 1
order: 122
tags: [python, oop, solid]
---

## Answer

The Liskov Substitution Principle: the subtype may not preserve the behavioral
contract expected by callers of the parent type.
