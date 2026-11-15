---
id: lesson-devops-linux
kind: lesson
topicId: devops-linux
title: Linux files, permissions, and administration
summary: Navigate a Linux host, interpret ownership and permissions, and manage access deliberately.
status: published
revision: 1
order: 10
tags: [linux, permissions]
---

## The system and filesystem

The kernel manages processes, memory, and devices; the shell interprets commands. Files are organized beneath `/`: common locations include `/etc` for configuration, `/var/log` for logs, `/home` for users, and `/tmp` for temporary files. A mount attaches a filesystem at a directory; a path need not correspond to the same physical disk as its parent.

Use `pwd`, `ls -la`, `cd`, and `stat` to inspect; `df -h` reports filesystem capacity while `du -sh directory` estimates space used by a directory. A filesystem can also run out of inodes; inspect with `df -i`. `man command` documents local options.

## Permissions and identity

For a regular file, `r`, `w`, and `x` mean read, modify, and execute; for a directory they mean list names, modify entries, and traverse. `ls -l` shows permissions for owner, group, and others: `-rw-r-----` grants owner read/write and group read. Parent directories need execute permission for traversal. ACLs, mounts, and security modules can add restrictions.

`id` shows identity and groups. `chmod` changes mode; `chown` changes ownership when authorized. Prefer a dedicated service user and the minimum permissions needed. `sudo` runs an authorized command with elevated privileges; verify the command and target before using it.

## Practice

Why can a user read a file's permissions but fail to open it? A parent directory may lack execute permission or another control may deny access. Why can `df` show full while `du` misses space? Deleted files still held open are one possibility.

## Further reading

- [Linux filesystem hierarchy](https://man7.org/linux/man-pages/man7/hier.7.html)
- [Linux permissions](https://man7.org/linux/man-pages/man7/path_resolution.7.html)
