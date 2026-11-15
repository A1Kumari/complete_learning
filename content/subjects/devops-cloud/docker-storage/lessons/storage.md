---
id: lesson-devops-docker-storage
kind: lesson
topicId: devops-docker-storage
title: Docker volumes and bind mounts
summary: Choose persistent storage and understand mount paths, permissions, backup, and container replacement.
status: published
revision: 1
order: 10
tags: [docker, storage]
---

## Writable layers are temporary

Each container gets a writable layer. Removing the container removes that layer, so do not rely on it for durable database data. A Docker-managed named volume exists independently of the container; a bind mount exposes a chosen host path. Both can persist across container replacement, but persistence on one host is not disaster recovery.

For example, `docker run --mount type=volume,src=app-data,dst=/data IMAGE` mounts a named volume. The application must write to `/data` and have suitable permissions. A bind mount is useful for local source development but couples behavior to host paths and access controls. Mounting over a container path hides the image's existing files at that path. Initialization behavior for empty volumes differs from bind mounts and must be understood for the image.

## Operate state deliberately

Database backups should use the database's supported consistent-backup procedure; copying live files blindly may produce an inconsistent restore. Test restoring the backup on a separate system. Check volume ownership, available space, retention, and the effect of cleanup commands before removing volumes. Encryption and access controls are separate from using a volume.

## Practice

Will rebuilding an image preserve a database written into the old container layer? No. Does a named volume automatically protect against host loss? No; use an independent tested backup strategy.

## Further reading

- [Docker volumes](https://docs.docker.com/engine/storage/volumes/)
