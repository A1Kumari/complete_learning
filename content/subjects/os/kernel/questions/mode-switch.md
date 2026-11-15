---
id: os-kernel-mode-switch
kind: question
topicId: os-kernel
lessonId: lesson-os-kernel-boot
prompt: "Does every system call cause a context switch? Explain what happens when a cached read succeeds."
difficulty: medium
frequent: false
status: published
revision: 1
order: 10
tags: [kernel, system-calls]
followUps:
  - "How does the answer change if the read must wait for a device?"
misconception: "A privilege-mode transition is not the same as switching to another thread."
---

## Answer

No. A system call enters the kernel from user mode, but the same thread can complete a cached read and return to user mode without another thread running. If the thread blocks for I/O or is preempted, the scheduler can switch to another runnable thread. A cached read can still involve validation and copying; caching does not eliminate the privilege transition.
