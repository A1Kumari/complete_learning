---
id: python-generator-lazy-pipeline-memory
kind: question
topicId: python-iterators-generators
lessonId: lesson-python-generator-expressions-pipelines
prompt: "Why can a lazy pipeline reduce memory use?"
difficulty: easy
frequent: false
status: published
revision: 1
order: 43
tags: [python, generators, pipelines]
---

## Answer

It can process values incrementally without materializing every intermediate
collection. Actual memory use still depends on the source, retained state, and
the final consumer.
