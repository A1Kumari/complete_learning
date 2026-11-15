---
id: lesson-devops-docker-networking
kind: lesson
topicId: devops-docker-networking
title: Docker networking and port publishing
summary: Connect containers using bridge networks, service DNS, and correctly scoped host ports.
status: published
revision: 1
order: 10
tags: [docker, networking]
---

## Network boundaries

A user-defined bridge network allows containers on one Docker host to communicate and provides name resolution for container names or aliases. Inside a container, `localhost` refers to that container's network namespace, not the host or a neighboring container. Containers on a shared network should address a peer by its service name and container port.

`docker run -p 127.0.0.1:8080:80 image` publishes host loopback port 8080 to container port 80. Binding to all interfaces can expose a service beyond the host; check Docker and firewall behavior for the platform. `EXPOSE` documents intended ports but does not itself publish them. Host networking shares the host network namespace where supported; it changes isolation and port-conflict behavior.

## Diagnose connectivity

Check the application's listening address and port, the containers' network membership (`docker network inspect`), DNS, host port mapping (`docker port`), and any firewall or cloud rules. An application bound only to container loopback may be inaccessible through a published port. A name resolving successfully does not prove the service is ready or accepting connections.

## Practice

Two Compose services communicate on the same network: should the client use `localhost` or the service name? Use the service name and internal port. Is publishing a database port necessary for another container on the same network? Generally no.

## Further reading

- [Docker networking](https://docs.docker.com/engine/network/)
