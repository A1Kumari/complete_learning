---
id: lesson-devops-docker-security
kind: lesson
topicId: devops-docker-security
title: Optimize and secure container images
summary: Use build stages, dependency controls, and runtime restrictions to reduce image risk and operational cost.
status: published
revision: 1
order: 10
tags: [docker, security]
---

## Build only what you need

Multi-stage builds compile or install dependencies in one stage and copy required artifacts into a smaller runtime stage. This can remove compilers and build-time packages from the final image. Order stable dependency steps before frequently changing source files to improve cache reuse; use `.dockerignore` to keep build context small and avoid sending local credentials or large artifacts.

Use maintained base images, lock dependencies, scan both OS and application packages, and rebuild when security updates are released. A small image is not automatically secure; scanners have incomplete coverage and findings need prioritization. Pinning an image digest improves reproducibility but requires an explicit update process.

## Runtime defenses

Run as a non-root user when the application supports it, drop unneeded capabilities, use a read-only root filesystem where practical, limit resources, and avoid privileged mode or mounting the Docker socket. A container with access to the Docker daemon can often control the host. Supply secrets through a suitable runtime secret mechanism rather than image layers or build arguments; deleting a secret in a later layer does not erase it from earlier layers.

## Practice

Does a multi-stage build eliminate vulnerable application dependencies? No; scan the final artifact and its dependencies. Does setting `USER` guarantee a safe workload? No; it is one layer of defense.

## Further reading

- [Docker build best practices](https://docs.docker.com/build/building/best-practices/)
