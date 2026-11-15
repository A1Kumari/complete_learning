---
id: lesson-devops-gitlab-jenkins
kind: lesson
topicId: devops-gitlab-jenkins
title: GitLab CI and Jenkins execution models
summary: Compare pipeline definitions, runners, agents, artifacts, and operational responsibilities.
status: published
revision: 1
order: 10
tags: [gitlab, jenkins, cicd]
---

## Two common models

GitLab CI defines jobs and stages in `.gitlab-ci.yml`; GitLab Runner executes eligible jobs on configured executors. Jobs can use dependencies, artifacts, caches, and rules to determine execution. Jenkins commonly defines a pipeline in a `Jenkinsfile`; its controller coordinates work on agents, with functionality extended through plugins. The exact deployment and isolation model depends on configuration.

Both tools can build, test, and deploy the same artifact. Compare availability of hosted runners, integration with source control, operational overhead, plugin maintenance, credential management, policy enforcement, and auditability rather than treating one as inherently more secure.

## Runner and credential boundaries

Untrusted build code executes on the runner or agent. Isolate jobs, scope credentials, avoid sharing sensitive workspaces, and keep runner images and plugins patched. Distinguish cache from a signed or otherwise verified release artifact. Protect deployments and restrict who can modify pipeline definitions; the pipeline itself has production influence.

## Practice

Why is a shared long-lived agent risky? One job may leave files or processes that affect later jobs, particularly if isolation is weak. How do stages differ from artifacts? Stages organize execution; artifacts carry outputs.

## Further reading

- [GitLab CI/CD documentation](https://docs.gitlab.com/ci/)
- [Jenkins Pipeline documentation](https://www.jenkins.io/doc/book/pipeline/)
