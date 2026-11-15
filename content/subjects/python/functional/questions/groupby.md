---
id: python-functional-groupby
kind: question
topicId: python-functional
lessonId: lesson-python-functional
prompt: How does itertools.groupby differ from grouping every matching key in a collection?
difficulty: medium
status: published
revision: 1
order: 100
tags: [python, itertools]
---

## Answer

`groupby` groups consecutive items with the same key. Equal keys separated by other keys form separate groups. Sort by the same key first when a single group per key is needed, or collect values in a dictionary.
