---
id: lesson-devops-cloud-storage
kind: lesson
topicId: devops-cloud-storage
title: Cloud storage and managed databases
summary: Select object, block, file, or database storage and plan backup and recovery.
status: published
revision: 1
order: 10
tags: [cloud, storage]
---

## Match the access pattern

Object storage stores objects addressed by keys and accessed through an API; it suits backups, media, and data lakes. Block storage presents a block device for a filesystem or database. Managed file storage exposes shared filesystem semantics. They differ in access methods, latency, consistency guarantees, lifecycle management, and pricing; verify the selected service rather than assuming a local disk interface for object storage.

Managed SQL services provide relational queries and transactions; managed NoSQL services offer different data models and scaling/consistency options. Managed does not mean maintenance-free: schema, query efficiency, access control, capacity, backup, and recovery still require ownership. AWS S3, EBS, RDS, and DynamoDB are examples, not interchangeable products.

## Recovery and lifecycle

Define retention, encryption, access policies, versioning where appropriate, and RPO/RTO. Replication or multi-zone availability helps with some failures but can replicate accidental deletion or corruption. Keep independent backups and test restores. Storage lifecycle transitions and request/egress fees can affect both cost and recovery speed.

## Practice

Why not store a database's live files on any object bucket? The access semantics are different; use a database-supported storage system. Does a snapshot prove a restore will work? No, test restoration and application consistency.

## Further reading

- [Amazon S3 documentation](https://docs.aws.amazon.com/s3/)
