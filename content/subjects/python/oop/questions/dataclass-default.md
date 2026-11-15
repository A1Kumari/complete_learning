---
id: python-oop-dataclass-default
kind: question
topicId: python-oop
lessonId: lesson-python-oop
prompt: Why use default_factory for a mutable dataclass field?
difficulty: medium
status: published
revision: 1
order: 70
tags: [python, oop, dataclasses]
---

## Answer

`field(default_factory=list)` calls the factory for each new instance, providing independent lists. Reusing one mutable object would make changes visible across instances; dataclasses reject many common mutable defaults.
