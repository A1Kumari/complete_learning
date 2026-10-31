---
id: python-oop-cached-property-stale
kind: question
topicId: python-oop
lessonId: lesson-python-oop-advanced-class-features
prompt: "What happens to a cached property when its underlying data changes without cache invalidation?"
difficulty: easy
frequent: false
status: published
revision: 1
order: 113
tags: [python, oop, properties]
---

## Answer

It may return the previously cached value. Delete the cached attribute or use
another appropriate invalidation strategy before expecting a fresh calculation.
