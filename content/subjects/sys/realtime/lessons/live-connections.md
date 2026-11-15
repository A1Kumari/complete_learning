---
id: lesson-sys-realtime
kind: lesson
topicId: system-design-realtime
title: WebSockets, server-sent events, and reconnectable delivery
summary: Choose a live transport and design connection ownership, durable replay, heartbeats, backpressure, and multi-instance fan-out.
difficulty: medium
status: published
revision: 1
order: 250
tags: [system-design, realtime, websockets]
prerequisiteIds: [lesson-sys-service-communication, lesson-sys-message-queues]
---

## Start with direction and recovery requirements

“Real time” needs a latency target and a delivery contract. A stock ticker, collaborative editor, chat system, and payment-status page have different traffic and correctness needs. Decide whether the client must send frequent messages, whether updates can be dropped, and whether disconnected users need replay.

| Transport | Interaction | Appropriate use |
| --- | --- | --- |
| Periodic polling | Repeated ordinary requests | Infrequent updates, simple clients |
| Long polling | Server waits before replying; client reconnects | Compatibility when persistent streaming is difficult |
| Server-sent events | Server-to-client event stream over HTTP | Notifications, job progress, live feeds |
| WebSocket | Bidirectional message connection | Chat, collaboration, interactive sessions |

SSE does not prevent the client from sending separate HTTP requests. WebSocket does not itself supply durable messages, reconnection history, authentication policy, or application-level acknowledgements.

## Separate connection ownership from message ownership

```text
Client -> connection gateway A
              |-> authentication / subscription checks
              |-> live connection registry
Message service -> durable message log -> fan-out -> gateway A -> client
```

A gateway owns an in-memory socket. The message service owns durable conversation history. If the gateway crashes, the client reconnects elsewhere and resumes from a durable cursor. Sticky routing can improve locality but is not a durability strategy.

Registries mapping users to gateways need expiry and stale-entry handling. If delivery to a recorded gateway fails, the durable message remains available for later retrieval. Presence is usually approximate soft state; do not confuse “currently connected” with “has received this message.”

## Reconnection requires application protocol

Assign stable event IDs or conversation sequence numbers. The client records its last processed position and requests replay after reconnecting. Delivery may overlap, so deduplicate by event ID. If history retention has expired, return a clear resynchronization instruction rather than pretending no updates were missed.

SSE supports event IDs and the `Last-Event-ID` reconnect mechanism, but the server still needs retained history and authorization checks. In WebSocket applications, design the resume handshake explicitly.

## Bound slow consumers

Every connection consumes memory, file descriptors, and heartbeat traffic. Estimate idle and active connection costs separately from message throughput. Use bounded outbound buffers. A client that cannot keep up should receive a resync signal, lose droppable updates, or disconnect according to product semantics; it must not cause an unbounded server queue.

Use ping/pong or heartbeats with timeouts appropriate for mobile networks and proxy idle limits. Jitter reconnects after a widespread outage to avoid a connection storm. Graceful deployments should drain sockets or instruct clients to reconnect before termination.

## Security and observability

Authenticate the handshake and authorize every subscription and sensitive message. Handle token expiry and revoked membership during a long-lived session. Validate message size, schema, and rate limits; transport establishment is not permanent authorization.

Measure active connections, reconnect rate, heartbeat failures, fan-out latency, per-client buffer size, and replay gaps.

**Exercise:** Design live order status updates with SSE. Explain how a mobile app catches up after being offline for an hour and how the server prevents a user from subscribing to another user's order.
