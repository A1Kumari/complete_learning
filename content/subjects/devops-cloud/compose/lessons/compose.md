---
id: lesson-devops-compose
kind: lesson
topicId: devops-compose
title: Compose a multi-container application
summary: Define related services, networks, volumes, and startup behavior with Docker Compose.
status: published
revision: 1
order: 10
tags: [docker, compose]
---

## Describe the application

Compose defines services and their configuration in a YAML file. Services normally share a project network and discover one another by service name. This example runs a web server locally with its port bound to loopback:

```yaml
services:
  web:
    image: nginx:1.27-alpine
    ports:
      - "127.0.0.1:8080:80"
```

`docker compose config` renders and validates the merged configuration; `docker compose up -d` starts it, `docker compose logs web` shows output, and `docker compose down` stops and removes project containers and networks. Data volumes have separate lifecycle rules; commands that remove volumes can destroy local state. Image tags can move; pin and update dependencies deliberately.

## Dependencies and configuration

Use service names and internal ports for service-to-service communication. `depends_on` can express startup ordering; depending on its condition and healthcheck configuration, it does not by itself prove the application is ready or stays healthy. Clients should handle retries and dependency failures. Environment variables are useful for configuration but can be exposed through process or container inspection; use a suitable secret mechanism for sensitive values.

## Practice

If a database starts before the API but is still initializing, why can the API fail? Process startup is not readiness. Add an appropriate health check and robust client retry behavior.

## Further reading

- [Compose specification](https://docs.docker.com/compose/compose-file/)
