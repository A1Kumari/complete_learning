---
id: os-memory-tlb-fault
kind: question
topicId: os-memory
lessonId: lesson-os-virtual-memory
prompt: "How does a TLB miss differ from a page fault? Does either necessarily require disk I/O?"
difficulty: medium
frequent: false
status: published
revision: 1
order: 10
tags: [memory, paging]
followUps:
  - "Give an example of a valid page fault handled without a disk read."
---

## Answer

A TLB miss means the translation is not cached; a page-table lookup can still find a valid resident mapping. A page fault means the current access cannot proceed under the present mapping and requires OS handling. Neither necessarily reads disk: a fault can allocate a zero-filled page or resolve copy-on-write, while a nonresident file or swapped page may require storage I/O. Invalid accesses can instead fail.
