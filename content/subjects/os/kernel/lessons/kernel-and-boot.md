---
id: lesson-os-kernel-boot
kind: lesson
topicId: os-kernel
title: The kernel boundary, interrupts, and boot
summary: Trace a system call across privilege levels, distinguish interrupts from exceptions, and follow a typical machine from firmware to user space.
difficulty: medium
status: published
revision: 1
order: 10
tags: [kernel, system-calls, boot]
prerequisiteIds: [lesson-os-processes-threads]
relatedIds: [os-q012, os-q013, os-q029, os-q030]
---

## Why a kernel exists

An operating system multiplexes CPUs, memory, and devices between programs while enforcing protection boundaries. The kernel tracks processes, manages virtual memory, mediates access to files and devices, and handles scheduling. User programs normally run with restricted privileges; kernel code runs with privileges needed to configure hardware and memory mappings. The exact privilege levels and kernel architecture depend on the platform.

The distinction is about **privilege**, not where a program is stored. A program can run a library function entirely in user mode. A system call enters the kernel to request an operation that needs kernel mediation.

## Follow a file read

1. A program calls a library interface such as `read(fd, buffer, count)`. A library may do work or buffering in user space; a call to a library function does not necessarily cause a system call.
2. The system-call wrapper places a call number and arguments according to the platform's ABI and executes a designated entry instruction. The processor switches privilege and enters a kernel-defined handler.
3. The kernel validates the descriptor and user buffer, checks relevant permissions, and tries to satisfy the request. Data may already be cached; otherwise the calling thread may block while I/O completes and another runnable thread can execute.
4. The kernel returns a byte count, end-of-file, or an error; the wrapper exposes the result according to its API. A successful read can return fewer bytes than requested.

A **mode switch** enters or leaves privileged execution. A **context switch** changes the thread running on a CPU. A system call need not cause a context switch, although blocking or preemption can lead to one.

## Interrupts and exceptions

An interrupt usually arrives asynchronously from a device or timer. The CPU enters a handler, and the kernel records or schedules the work needed to respond. A synchronous exception instead results from the current instruction: examples include a page fault or division error. A system-call entry is an intentional synchronous transition; its exact mechanism is architecture-specific.

A page fault is not automatically a crash: the kernel may bring in a valid page and resume the instruction. An invalid access can instead result in a signal such as `SIGSEGV` on Unix-like systems. Interrupts, exceptions, and system calls share the idea of controlled kernel entry but have different causes.

## From power-on to login

In a typical UEFI-based boot, firmware initializes hardware, selects a boot entry, and runs an EFI program such as a bootloader. The bootloader loads the kernel and often an initial RAM filesystem. The kernel initializes core subsystems, discovers devices, uses the initial environment if present to locate and mount the real root filesystem, and starts the first user-space process. That process starts services and eventually a login or graphical session.

Actual boot paths vary: firmware can load a kernel directly, and systems can use different bootloaders, root filesystems, and init systems. Secure Boot, when configured, verifies parts of the boot chain; it does not by itself guarantee that all runtime software is safe.

## Recall and apply

- A cached read enters the kernel: does that imply a context switch? No; the same thread can return directly.
- A timer interrupts a running thread: can the scheduler choose another? Yes, if scheduling policy and state call for it.
- Why validate a user pointer? User space can provide invalid or inaccessible addresses; the kernel must handle them safely.

## Further reading

- [Linux system calls](https://man7.org/linux/man-pages/man2/syscalls.2.html)
- [Linux boot process](https://man7.org/linux/man-pages/man7/boot.7.html)
