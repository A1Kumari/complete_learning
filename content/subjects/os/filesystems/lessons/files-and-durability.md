---
id: lesson-os-files-durability
kind: lesson
topicId: os-filesystems
title: Files, descriptors, and crash durability
summary: Follow names through directories to file metadata, understand shared file offsets, and distinguish filesystem recovery from durable application data.
difficulty: medium
status: published
revision: 1
order: 10
tags: [filesystems, storage, durability]
prerequisiteIds: [lesson-os-kernel-boot]
relatedIds: [os-q022, os-q023, os-q024, os-q025]
---

## Names and file identity

In a Unix-style filesystem, a directory maps names to inode numbers. An inode represents a file's metadata and describes how to locate its contents. It commonly stores ownership, permissions, size, and timestamps; which timestamps exist depends on the filesystem. The inode does not contain the directory entry's filename.

A hard link is another directory entry for the same inode on the same filesystem. Removing one name does not remove another. A symbolic link is a separate filesystem object containing a path; it can point across filesystems or become dangling if its target disappears. Ordinary applications generally cannot create hard links to directories.

Unlinking the last name does not necessarily reclaim a file immediately: open references can keep it accessible until they are closed. This explains why deleting a large log file that a process still has open might not immediately free its space. Filesystems can also run out of inodes while data blocks remain available.

## File descriptors and offsets

`open()` returns a process-local integer descriptor. It refers to an open file description in the kernel, which includes the current file offset and status flags. The underlying file has its own filesystem metadata. Two independent `open()` calls generally create separate open file descriptions and offsets; `dup()` and descriptors inherited across `fork()` refer to the same open file description and share its offset.

For example, if parent and child share an inherited descriptor and the parent reads 4 bytes, the shared offset normally advances by 4 before the child's next read. Scheduling determines which operation happens first. `pread()` takes an explicit offset and does not change the shared file offset. Pipes are streams and do not have ordinary seekable file offsets.

## Buffering is not durability

A successful `write()` usually means the kernel accepted bytes, not necessarily that they survived a sudden power loss. Library buffers add another layer: flush them before asking the OS to synchronize the file. `fsync()` requests that file data and relevant metadata reach persistent storage, subject to filesystem and hardware guarantees; check errors. If creating or renaming a file, syncing the containing directory may also be required for the directory entry to survive a crash.

A common update pattern on a suitable local filesystem is: write a temporary file in the target directory, flush and `fsync` it, rename it over the destination, then `fsync` the directory. Atomic rename and crash guarantees have platform and filesystem constraints; handle errors and verify the guarantees of the deployed environment.

## Journaling and recovery

A journal records filesystem updates so recovery can replay committed work after a crash. Journaling improves structural consistency, but journal modes differ in whether and when file data is journaled. It does not guarantee that every recent application write is durable or eliminate the need for backups. A filesystem can recover cleanly while an application loses its last unsynchronized update.

## Practice

Why does a hard link survive deletion of the original name? Both names refer to the same inode. Why can two processes unexpectedly share a read offset? Their descriptors may refer to the same open file description. Does a successful write prove data is on stable storage? No.

## Further reading

- [Linux open and open file descriptions](https://man7.org/linux/man-pages/man2/open.2.html)
- [Linux fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)
- [Linux unlink](https://man7.org/linux/man-pages/man2/unlink.2.html)
