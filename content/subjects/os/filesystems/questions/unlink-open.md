---
id: os-files-unlink-open
kind: question
topicId: os-filesystems
lessonId: lesson-os-files-durability
prompt: "Why might deleting a large file fail to free disk space immediately?"
difficulty: medium
frequent: false
status: published
revision: 1
order: 10
tags: [filesystems, inodes]
followUps:
  - "What happens if another hard link still exists?"
---

## Answer

Deleting a name unlinks a directory entry. If a process still has the file open, the filesystem can retain its inode and data until the last open reference is closed. Another hard link also keeps the file named and its data reachable. Investigate open deleted files and remaining links before assuming a storage accounting error.
