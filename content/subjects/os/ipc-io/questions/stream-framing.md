---
id: os-ipc-stream-framing
kind: question
topicId: os-ipc-io
lessonId: lesson-os-ipc-io
prompt: "Why does an application protocol over a stream socket need framing?"
difficulty: medium
frequent: false
status: published
revision: 1
order: 10
tags: [ipc, sockets]
followUps:
  - "How would you handle a partial header or an oversized message?"
---

## Answer

A stream delivers ordered bytes rather than preserving the sender's write boundaries. One read may return part of a message or bytes from several messages. Define framing, for example a bounded length prefix, and loop until the header and body are complete or an error or end-of-file occurs. Validate the length before allocating a buffer and handle partial writes too.
