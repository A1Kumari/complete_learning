---
id: lesson-os-virtual-memory
kind: lesson
topicId: os-memory
title: Virtual memory, paging, and memory pressure
summary: Translate virtual addresses, trace page faults and copy-on-write, and compare page replacement under memory pressure.
difficulty: medium
status: published
revision: 1
order: 10
tags: [memory, paging, performance]
prerequisiteIds: [lesson-os-processes-threads]
relatedIds: [os-q014, os-q015, os-q016, os-q017, os-q018, os-q019, os-q020, os-q028]
---

## Address spaces and mappings

Each process uses virtual addresses. The memory management unit (MMU) translates them using mappings established by the kernel, with permission bits controlling access. Different processes can map the same physical memory intentionally, for example for shared memory or shared libraries; isolation is enforced by mappings and permissions, not by requiring every physical page to be unique.

With 4 KiB pages, a virtual address consists of a page number and a 12-bit offset. For example, address `0x1234` is virtual page `0x1` plus offset `0x234`. If that page maps to physical frame `0xA`, the physical address is `0xA234`. The offset stays unchanged. Page sizes and address layouts vary by architecture.

## Page tables, TLBs, and faults

Page tables map virtual pages to frames and record permissions and other state. Multilevel tables avoid allocating lower-level tables for large unused regions of sparse address spaces. The TLB caches recent translations; on a miss the processor or OS performs a page-table lookup depending on architecture. A TLB miss is not necessarily a page fault: the mapping can be valid but absent from the TLB.

A page fault happens when the current access cannot proceed under the present mapping. The kernel may allocate a zero-filled page, load a file-backed page, restore a swapped page, or handle copy-on-write. If the address or operation is invalid, the kernel reports a failure, often delivering a signal to the process. Page faults are therefore normal in many workloads; a high rate alone does not prove disk I/O.

## Demand paging and copy-on-write

Demand paging delays loading or allocating pages until needed; operating systems may also prefetch pages. After a typical Unix `fork()`, parent and child initially have separate address spaces that can reference the same physical pages with copy-on-write protection. When either writes a shared private page, the kernel makes a private copy as needed and resumes the write. Explicitly shared mappings have different semantics. Copy-on-write saves unnecessary copying, but page-table setup, faults, and later copies still cost time and memory.

## Replacement and working sets

When memory is under pressure, the OS can reclaim clean file-backed pages and reload them later; dirty pages may need writeback, and anonymous memory may be swapped if swap is available. FIFO selects the oldest resident page; LRU selects the least recently used; clock approximates recency using reference information. Exact LRU tracking can be costly. FIFO can exhibit Belady's anomaly: increasing the number of frames can increase faults for some reference sequences.

A **working set** is the set of pages actively used over a chosen interval. When the active working sets exceed available memory, excessive reclaim and refaulting can cause thrashing. Investigate memory pressure, major and minor fault rates, swap activity, and latency together; high CPU or I/O alone is not conclusive. Reduce the active workload or memory footprint, add capacity, or adjust resource limits based on evidence.

Paging uses fixed-size pages, which can waste space within an allocated page. Classical segmentation uses variable-sized logical regions and can suffer external fragmentation. Modern systems commonly use paging, but hardware and OS designs vary.

## Memory-mapped files

`mmap()` maps a file into virtual memory. Access can fault pages into memory without a separate `read()` for each access. Shared mappings can propagate changes to the underlying file; private mappings use copy-on-write and do not update the file through those writes. Mapping is not a blanket guarantee of zero copying, speed, or durable storage: synchronization, writeback, and error handling remain important.

## Check yourself

Does a TLB miss imply a disk read? No. Can a valid fault be handled without reading disk? Yes, for example a newly allocated zero-filled page. Does increasing RAM always reduce FIFO faults? No; Belady's anomaly is a counterexample.

## Further reading

- [Linux memory management concepts](https://docs.kernel.org/admin-guide/mm/concepts.html)
- [Linux mmap](https://man7.org/linux/man-pages/man2/mmap.2.html)
