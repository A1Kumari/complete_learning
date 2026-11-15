---
id: lesson-devops-github-actions
kind: lesson
topicId: devops-github-actions
title: GitHub Actions workflows and runners
summary: Understand workflow events, jobs, runners, artifacts, credentials, and reusable automation.
status: published
revision: 1
order: 10
tags: [github-actions, cicd]
---

## Workflow execution

A workflow is a YAML definition triggered by events such as pushes, pull requests, schedules, or manual dispatch. It contains jobs; each job runs on a runner and contains steps. Jobs run independently unless connected with `needs`. Artifacts transfer build outputs between jobs or retain them for inspection; caches accelerate dependency reuse but should not be treated as authoritative artifacts.

GitHub-hosted runners are provisioned for jobs; self-hosted runners require management and isolation, particularly when running untrusted code. Set explicit timeouts and narrow `permissions` for the workflow token. Protect deployment environments and use short-lived cloud credentials via OIDC where supported, with restrictions on repository, branch, and environment claims.

## Secure workflow design

Pin third-party actions to a verified full commit SHA for stronger supply-chain control, and update deliberately. Do not interpolate untrusted event text directly into shell commands; pass it through an environment variable and quote it. Pull requests from forks have different token and secret availability; do not use privileged triggers to check out and execute untrusted pull-request code. Reusable workflows centralize policy, but their permissions and inputs still require review.

## Practice

Why might a job fail to see a file produced by a different job? Jobs can run on separate machines; upload and download an artifact. Does a successful test job imply a deployment used the same artifact? Only if the workflow explicitly promotes it.

## Further reading

- [GitHub Actions documentation](https://docs.github.com/en/actions)
