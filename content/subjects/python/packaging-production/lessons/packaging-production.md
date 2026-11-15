---
id: lesson-python-packaging-production
kind: lesson
topicId: python-packaging-production
title: Packaging and Production Delivery
summary: Package Python projects, manage configuration, and ship repeatable deployments.
difficulty: medium
status: published
revision: 1
order: 210
tags: [python, packaging, deployment]
prerequisiteIds: [lesson-python-modules-packages, lesson-python-testing-debugging]
---

## Package a project

`pyproject.toml` declares project metadata and a build backend. A wheel is an installable distribution; a source distribution contains source from which a package can be built. Build and test artifacts in a clean environment before publishing to an index such as PyPI. Use semantic versioning or another documented policy consistently.

```toml
[build-system]
requires = ["setuptools>=61"]
build-backend = "setuptools.build_meta"

[project]
name = "example-tool"
version = "0.1.0"
requires-python = ">=3.10"

[project.scripts]
example-tool = "example_tool.cli:main"
```

Install a build frontend separately and run `python -m build` to produce artifacts. Check packaging configuration and package discovery for your chosen backend. Entry points let an installer create a CLI command.

## Configure and deploy

Keep configuration separate from code, validate it at startup, and obtain secrets from a suitable secret store or environment rather than committing them. Pin or lock deployment dependencies, use a supported interpreter, and test the exact artifact to be deployed. Log operational events without credentials or sensitive payloads.

CI should install dependencies, run tests and quality checks, build the artifact, and verify it in a clean environment. Deploy with a rollback plan and monitor errors, latency, and resource use. Treat untrusted input and deserialization as security boundaries.

## Practice

Package a small CLI, install its wheel into a fresh virtual environment, and run it with a required configuration value missing.
