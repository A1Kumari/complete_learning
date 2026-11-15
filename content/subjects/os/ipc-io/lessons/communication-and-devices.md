---
id: lesson-os-ipc-io
kind: lesson
topicId: os-ipc-io
title: Interprocess communication and device I/O
summary: Compare pipes, sockets, queues, and shared memory, then trace polling, interrupts, and DMA through an I/O operation.
difficulty: medium
status: published
revision: 1
order: 10
tags: [ipc, io, devices]
prerequisiteIds: [lesson-os-kernel-boot, lesson-os-synchronization]
relatedIds: [os-q026, os-q027, os-q028]
---

## Communication across process boundaries

Separate processes normally have separate address spaces. IPC gives them an explicit way to exchange data or coordinate. Choose based on message boundaries, latency, failure handling, and whether communication must cross machines.

| Mechanism | Model | Design considerations |
| --- | --- | --- |
| Pipe | Usually a one-way byte stream | Reads need framing; inherited or passed descriptors can connect processes. Named FIFOs have filesystem names. |
| Unix-domain socket | Local bidirectional communication | Stream sockets need framing; other socket types can preserve message boundaries. |
| Network socket | Communication between endpoints, possibly on different hosts | Handle partial reads and writes, disconnects, timeouts, and protocol framing. |
| Message queue | Discrete messages managed by a queue implementation | Capacity, blocking behavior, ordering, and persistence depend on the API. |
| Shared memory | Multiple processes map the same memory | Avoids copying the payload through each message, but requires synchronization, a shared layout, and lifetime management. |

An anonymous pipe is not limited to parent and child: related processes can inherit its descriptors and unrelated processes can receive descriptors through suitable mechanisms. Closing unused pipe ends matters; a reader observes end-of-file only after all write ends have closed and buffered bytes are consumed.

## Frame, bound, and recover

A stream does not preserve application message boundaries. A receiver might get half a header, multiple messages in one read, or an end-of-file. Use an explicit protocol, such as a fixed-size length header followed by exactly that many bytes, and enforce a maximum message size. The reader loops until it receives the complete frame or detects an error; the writer also handles partial writes.

Bound queues and buffers to avoid unlimited memory growth. Decide whether a producer blocks, retries, drops work, or receives an error when full. If a consumer crashes after accepting a message, delivery and retry semantics depend on the queue and application protocol: retries can create duplicates, so operations may need idempotency or deduplication.

Shared memory avoids repeated kernel-mediated payload copies after setup, but it is not automatically faster for every workload. Processes still need synchronization, and the protocol must define initialization, ownership, cleanup, and behavior when a participant dies.

## How devices signal progress

**Polling** checks device state repeatedly; it can reduce latency at the expense of CPU time. **Interrupts** notify the CPU about an event so it can perform other work while waiting, although interrupt handling has overhead. Real systems sometimes combine the two, including polling in high-throughput paths.

With **direct memory access** (DMA), the kernel configures a device or DMA engine to transfer data between a device and memory without the CPU copying each byte. The device commonly signals completion with an interrupt, but batching, multiple interrupts, or polling are also possible. DMA requires appropriate buffer lifetime, address mapping, and synchronization; it is not simply unrestricted access to arbitrary process memory.

## Trace a read

A process requests a file read. If the data is cached, the kernel can copy or otherwise supply it without a device operation. On a cache miss, the kernel can submit a request to storage and block the thread. The device transfers data, often using DMA, and completion is reported. The kernel makes the thread runnable; after scheduling, the call returns. Exact caching and I/O paths depend on the OS and API.

## Check yourself

Does one socket `read()` equal one application message? Not for a byte stream. Can a message queue operation block? Yes, depending on the API, flags, and queue state. Does DMA replace interrupts? No; they often work together.

## Further reading

- [Linux pipes and FIFOs](https://man7.org/linux/man-pages/man7/pipe.7.html)
- [Linux Unix-domain sockets](https://man7.org/linux/man-pages/man7/unix.7.html)
- [Linux DMA API guide](https://docs.kernel.org/core-api/dma-api-howto.html)
