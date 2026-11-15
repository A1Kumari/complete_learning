---
id: lesson-python-modules-packages
kind: lesson
topicId: python-modules-packages
title: Modules, Packages, and Environments
summary: Organize imports and install dependencies in an isolated environment.
difficulty: easy
status: published
revision: 1
order: 50
tags: [python, imports, environments]
prerequisiteIds: [lesson-python-functions-scope]
---

## Modules and packages

A module is typically a `.py` file; a package groups modules under a shared import namespace. Python searches locations on `sys.path`, including the script location and installed packages. Imported modules are cached in `sys.modules`, so their top-level code normally runs once per interpreter. Avoid naming a local file after a standard-library module.

An `__init__.py` file creates a regular package and may expose its public API. Namespace packages can exist without one. Use `if __name__ == "__main__":` to run CLI code only when a module is executed directly, not when imported. `python -m package.module` executes a module using package-aware resolution.

## Isolated environments

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install requests
python -m pip freeze
```

Activation syntax differs on Windows. Calling `.venv/bin/python` directly also works on Unix without activation. Keep dependency declarations in project configuration and pin or lock versions for reproducible deployments; do not commit the environment directory. `pip freeze` describes the current environment, not necessarily the minimal direct dependencies.

## Practice

Create a package containing a reusable function and a `__main__.py` entry point. Install a dependency in a virtual environment and verify the interpreter path.
