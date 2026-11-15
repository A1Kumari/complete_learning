---
id: lesson-devops-container-fundamentals
kind: lesson
topicId: devops-container-fundamentals
title: Containers, isolation, and virtual machines
summary: Understand images, namespaces, control groups, and the isolation tradeoffs between containers and VMs.
status: published
revision: 1
order: 10
tags: [containers, isolation]
---

## Container versus virtual machine

A container is an isolated process or group of processes using the host kernel. An image supplies a filesystem and configuration from which containers are created. A VM runs a guest operating system on virtualized hardware, typically with a stronger hardware-virtualization boundary and its own kernel. VMs can run containers; containers do not require a separate guest kernel per instance.

Linux namespaces isolate views of resources such as process IDs, mounts, and network interfaces. Control groups (cgroups) account for and limit resources such as CPU and memory. Neither mechanism makes untrusted code automatically safe: capabilities, seccomp, user namespaces, filesystem access, kernel vulnerabilities, and runtime configuration matter. Limits and isolation features vary by environment.

## Lifecycle and design

Treat an application container as replaceable. Keep configuration outside the image where appropriate, emit useful logs, handle termination, and store persistent state in an external volume or service. The container stops when its main process exits; backgrounding the application without appropriate supervision can make the container terminate. A restart policy may restore a process but cannot fix a broken dependency or corrupted state.

## Practice

Why are container images portable but not universally executable? The CPU architecture, operating system/kernel compatibility, configuration, and dependencies still matter. Does an image contain running processes? No; a container is a runtime instance of an image.

## Further reading

- [Docker container overview](https://docs.docker.com/get-started/docker-overview/)
