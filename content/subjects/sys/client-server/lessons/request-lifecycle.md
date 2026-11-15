---
id: lesson-sys-client-server
kind: lesson
topicId: system-design-client-server
title: Follow a request through a client-server system
summary: Understand DNS, connections, proxies, application instances, state ownership, connection pools, and pagination contracts.
difficulty: easy
status: published
revision: 1
order: 30
tags: [system-design, http, architecture]
prerequisiteIds: [lesson-sys-foundations]
---

## The request lifecycle

When a user opens an application, the browser resolves its hostname, establishes a connection when needed, negotiates TLS, and sends an HTTP request. DNS answers and connections can be reused, so not every request pays every setup cost. HTTP/2 multiplexes streams over a connection; HTTP/3 uses QUIC rather than TCP.

```text
Client -> DNS resolution
Client -> edge / reverse proxy -> application instance
                                      |-> cache
                                      |-> database connection pool -> database
                                      +-> durable queue -> background worker
```

A reverse proxy acts on behalf of servers, handling routing, TLS termination, or caching. A forward proxy acts on behalf of clients. Neither automatically provides application authorization: a user who reaches a service must still be allowed to access the requested resource.

## Stateless does not mean no state exists

A stateless application instance does not require the next request to return to that same instance to recover essential session state. It can still use caches, database connections, and temporary memory. Authoritative state lives in a database or another intentionally managed service.

For example, storing a shopping cart only in one worker's memory makes restart and load balancing correctness problems. Store the cart durably by user ID; keep a local cache only as an optimization. A signed session token can avoid a central lookup for some claims, but revocation, expiry, and authorization changes still need a policy.

Stateful services are sometimes necessary: a WebSocket server owns live connections, and a database owns persistent records. The design must explain reconnection, failover, routing, and recovery instead of pretending all state can disappear.

## Bound connection pools and work queues

A database pool reuses authenticated connections and limits concurrency. Pool size must be budgeted across the fleet: 40 application instances with pools of 30 can attempt 1,200 database connections. Increasing application replicas without changing this budget can overload the database.

Set acquisition timeouts, query timeouts, and limits on waiting requests. An unbounded queue hides overload as rising latency and memory usage. Avoid holding a database transaction open while waiting for an external payment call; the transaction can retain locks while the remote service stalls.

## API contracts make the architecture usable

For a create operation, specify validation, authentication, idempotency, the acknowledgement point, and error outcomes. For list operations, bound response size and define sorting.

```sql
SELECT id, created_at, title
FROM posts
WHERE (created_at, id) < (:cursor_time, :cursor_id)
ORDER BY created_at DESC, id DESC
LIMIT 21;
```

With an index on `(created_at DESC, id DESC)`, a keyset cursor avoids scanning and discarding a huge offset. Fetching 21 rows for a 20-row page indicates whether another page exists. Encode both sort values in the cursor and validate it. Keyset pagination does not create snapshot isolation: deletions and updates to sort keys still affect traversal. Use immutable ordering keys or an explicit snapshot boundary when the product needs stable results.

## Failure walkthrough

If the client times out after a create request, the server may already have committed it. Retrying with a new identity can duplicate the operation. Return a stable operation ID and let the client retry with the original idempotency key or query status. Network failure creates uncertainty about the result, not proof of rollback.

**Exercise:** Trace a login followed by a cart update across two instances. Identify every piece of state, its owner, and what the user sees if one instance restarts between requests.
