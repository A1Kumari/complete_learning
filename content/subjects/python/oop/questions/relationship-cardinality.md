---
id: python-oop-relationship-cardinality
kind: question
topicId: python-oop
lessonId: lesson-python-oop-composition-relationships
prompt: "What cardinality describes students who can take many courses and courses that can have many students?"
difficulty: easy
frequent: false
status: published
revision: 1
order: 104
tags: [python, oop, relationships]
---

## Answer

Many-to-many. If both students and courses store the relationship, updates to
both sides should be coordinated to prevent inconsistent state.
