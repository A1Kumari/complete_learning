---
id: lesson-sys-chat
kind: lesson
topicId: system-design-end-to-end
title: Design chat with durable history and reconnectable delivery
summary: Build a messaging system around conversation-local order, idempotent sends, durable acknowledgements, fan-out, offline replay, and connection gateways.
difficulty: hard
status: published
revision: 1
order: 351
tags: [system-design, case-study, chat]
prerequisiteIds: [lesson-sys-realtime, lesson-sys-stream-processing, lesson-sys-distributed-ids]
---

## Define the delivery contract

Support one-to-one and small-group messages, conversation history, offline users, and delivered/read markers. Defer global full-text search and very large broadcast channels unless required. State whether ordering is conversation-local or global; conversation-local is usually sufficient and far cheaper.

Distinguish **accepted by server**, **delivered to a device**, and **read by a user**. A socket write or push-provider acceptance is not proof of reading. A user's multiple devices also need separate delivery progress before combining it into a user-facing status.

## Sizing assumptions

For 10 million daily active users sending 40 messages/day, average message ingress is about 4,630/s; a 5x peak is about 23,150/s. At 1 KB per message including metadata, raw message growth is about 400 GB/day before replicas and indexes. Attachments belong in object storage with authorized upload/download references.

If two million users are concurrently connected and a connection costs 20 KB of memory, connection state alone is about 40 GB across the gateway fleet. This estimate excludes TLS, runtime, buffers, and operating-system overhead and must be measured.

## Data model and components

```text
conversations(id, type, ...)
memberships(conversation_id, user_id, role, membership_version)
messages(conversation_id, sequence, message_id, sender_id,
         client_message_id, body, created_at)
device_cursors(device_id, conversation_id, last_delivered, last_read)

Client -> WebSocket gateway -> message service -> durable message store
                                   |-> outbox -> fan-out -> online gateways
                                   +-> offline notification workers
```

Partition history by conversation, with additional buckets for very large histories when needed. Index by conversation and sequence for pagination. Authorize membership on sends, subscriptions, and history reads.

## Idempotent send and ordering

The client supplies a stable `client_message_id` per attempted message. Enforce uniqueness in the sender/conversation scope and return the previously accepted message on retry. Assign a sequence through a conversation owner or a storage transaction that orders accepted messages. Wall-clock timestamps and approximately ordered IDs are not enough for authoritative conversation order.

Commit the message and its publication record before acknowledging durable acceptance. If the acknowledgement is lost, the client retries with the same identity. A new identity would create a duplicate logical message.

## Delivery, replay, and fan-out

Connection gateways own sockets, not message durability. Fan-out delivers new-message notifications to online devices; the devices acknowledge application processing separately. After reconnect, a client sends its last durable cursor and fetches missing messages. Deduplicate overlapping live and replay deliveries by message ID or sequence.

For small groups, writing delivery work per member is practical. Huge groups require a different plan: shared history, selective fan-out, and pull-based catch-up avoid one storage write per recipient per message. Presence and typing indicators can be ephemeral and lossy while messages remain durable.

## Failure and resource controls

Bound per-connection outbound buffers and disconnect or resynchronize slow devices. Jitter reconnects after gateway loss. Expire stale routing records and re-check authorization when a user leaves a group; a long-lived socket must not preserve revoked access forever.

Use conversation-scoped ownership and failover to avoid two writers assigning conflicting sequence numbers. During a partition, define whether clients queue drafts locally or receive a retryable error instead of falsely marking messages sent.

Measure send acknowledgement latency, fan-out delay, replay gaps, duplicate suppression, oldest undelivered message, and gateway memory.

**Practice:** Trace a send where the message commits, fan-out succeeds, and the sender's acknowledgement is lost. Show how retry, receiver deduplication, and history pagination still produce one logical message.
