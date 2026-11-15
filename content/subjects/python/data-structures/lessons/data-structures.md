---
id: lesson-python-data-structures
kind: lesson
topicId: python-data-structures
title: Built-in Collections
summary: Choose Python collections and reason about slicing, sorting, mutation, and copying.
difficulty: easy
status: published
revision: 1
order: 30
tags: [python, collections]
prerequisiteIds: [lesson-python-fundamentals]
---

## Choose a collection

Strings are immutable Unicode text. Lists are mutable ordered sequences; tuples are immutable sequences whose contents may themselves be mutable. Dictionaries map hashable keys to values and preserve insertion order. Sets contain unique hashable values and support union and intersection.

```python
words = ["pear", "apple", "pear"]
counts = {word: words.count(word) for word in set(words)}
print(sorted(counts.items(), key=lambda pair: pair[1], reverse=True))
```

For large inputs, use `collections.Counter(words)` instead of repeatedly scanning with `count`. Dictionary and set lookups are typically average O(1), not a worst-case guarantee. List append is amortized O(1); inserting near the front generally moves elements.

## Slicing and sorting

`items[start:stop:step]` creates a new sequence of the same kind for lists, tuples, and strings. The stop index is exclusive; negative indexes count from the end. `sorted(items)` returns a new list; `list.sort()` changes the list in place and returns `None`. Both are stable.

## Mutation and copies

Assignment creates another reference, not a copy. `list.copy()` and slicing are shallow copies: nested objects are still shared. Use `copy.deepcopy` when independent nested objects are needed and copying is appropriate. Comprehensions offer concise transformations, but use ordinary loops when they are easier to read.

## Practice

Count words with a dictionary, sort by descending frequency, and demonstrate the difference between a shallow copy and an independent nested list.
