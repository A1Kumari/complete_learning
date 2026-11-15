---
id: lesson-python-file-exceptions
kind: lesson
topicId: python-file-exceptions
title: Files and Exceptions
summary: Read and write common formats while handling failures and resource cleanup.
difficulty: easy
status: published
revision: 1
order: 60
tags: [python, files, exceptions]
prerequisiteIds: [lesson-python-functions-scope]
---

## Paths and files

Use `pathlib.Path` to compose paths. Open text files with an explicit encoding and a context manager, which closes the file even if an exception occurs. Modes include `r` for reading, `w` for truncating or creating, and `a` for appending. For large files, iterate line by line rather than reading everything at once.

```python
from pathlib import Path
import json

path = Path("settings.json")
try:
    with path.open(encoding="utf-8") as stream:
        config = json.load(stream)
except FileNotFoundError:
    config = {}
except json.JSONDecodeError as exc:
    raise ValueError("Invalid settings file") from exc
```

`json.dump` and `json.load` serialize JSON-compatible values; they do not validate an application's schema. For CSV, use the `csv` module and open files with `newline=""` so it can handle line endings and quoted fields correctly.

## Handling errors

Catch specific exceptions where you can recover or add context. `else` runs after a successful `try`; `finally` runs during cleanup whether or not an exception occurs. Define a custom exception by subclassing `Exception`, and use `raise NewError(...) from exc` to preserve the cause. Do not silently swallow unexpected exceptions.

## Practice

Read a CSV of prices, report invalid rows with their line numbers, and ensure the file closes on failure.
