---
id: lesson-devops-cicd
kind: lesson
topicId: devops-cicd
title: CI/CD pipelines and release flow
summary: Design a repeatable pipeline from source commit to a verified deployment.
status: published
revision: 1
order: 10
tags: [cicd, delivery]
---

## From change to release

Continuous integration frequently merges changes and automatically builds and tests them. Continuous delivery keeps verified software ready to release, often with a human decision before production. Continuous deployment automatically releases every change that passes the defined checks. Neither implies that tests alone guarantee safety.

A practical pipeline checks out a specific commit, installs pinned dependencies, runs fast checks and relevant tests, builds an artifact, records its identity, and promotes the same artifact through environments. Deployment then verifies health and user-facing behavior. Avoid rebuilding separately for production: changing dependencies can produce a different artifact from the one tested.

## Design for failure

Use isolated runners, least-privilege credentials, timeouts, logs, and bounded retries for transient failures. Cache dependencies to speed builds, but do not treat a cache as a trusted release artifact. Keep secrets out of logs and do not expose privileged credentials to untrusted pull-request code. A rollback plan must consider database migrations and external side effects, not only application versions.

## Practice

Why deploy by digest rather than a mutable tag? It identifies the tested artifact. Why is a green build insufficient? Tests may miss production traffic, configuration, data, or dependency failures; observe the release after deployment.

## Further reading

- [Continuous integration guidance](https://martinfowler.com/articles/continuousIntegration.html)
