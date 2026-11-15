---
id: lesson-devops-docker
kind: lesson
topicId: devops-docker
title: Build and run Docker images
summary: Follow an image from Dockerfile through build, registry, and container execution.
status: published
revision: 1
order: 10
tags: [docker, images]
---

## Image to container

A Dockerfile describes build steps. Docker builds an image from layers and configuration; a registry stores images under names, tags, and immutable content digests. A tag can move to a different image, so record the digest for reproducible deployments. `docker build -t example-app:local .` builds from the current build context; `.dockerignore` excludes irrelevant or sensitive files from that context.

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app.py .
USER 10001
CMD ["python", "app.py"]
```

This illustrative image assumes the named files exist and the application can run as UID 10001. For production, use an approved, maintained base image, pinned dependencies, and a suitable digest-pinning/update policy. Copy dependency manifests before source to improve caching when only application code changes.

## Run and inspect

`docker run --name example-app example-app:local` starts a container; `docker ps -a`, `docker logs example-app`, and `docker inspect example-app` help diagnose it. `docker stop` requests termination and later force-kills after a timeout. `docker rm` removes the container, not the image; data in its writable layer is not a durable storage strategy. Publishing ports and mounting volumes are explicit choices.

## Practice

Why might changing `app.py` not reinstall dependencies? An earlier dependency layer can be reused. Why is `latest` insufficient to identify exactly what ran? It is a mutable tag.

## Further reading

- [Dockerfile reference](https://docs.docker.com/reference/dockerfile/)
