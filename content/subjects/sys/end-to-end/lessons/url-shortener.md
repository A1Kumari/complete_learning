---
id: lesson-sys-url-shortener
kind: lesson
topicId: system-design-end-to-end
title: Design a URL shortener from API to global redirects
summary: Work through requirements, sizing, alias generation, redirects, cache freshness, analytics, abuse controls, and staged scaling.
difficulty: medium
status: published
revision: 1
order: 350
tags: [system-design, case-study, url-shortener]
prerequisiteIds: [lesson-sys-distributed-caching, lesson-sys-distributed-ids, lesson-sys-sharding]
---

## Scope and success criteria

Support creating a short URL, resolving an alias, expiration, and deletion by its owner. Custom aliases and basic analytics are optional extensions. Prioritize fast, highly available redirects; link creation can tolerate more latency. Define a freshness rule: deleted or changed links must stop using the previous destination within, for example, 30 seconds.

Assume 10 million new links and one billion redirects per day. These are illustrative product assumptions, not benchmarks:

```text
Average creates/s ≈ 116; 5x peak ≈ 580
Average redirects/s ≈ 11,574; 5x peak ≈ 57,870
At 500 bytes/link: 5 GB/day, about 1.825 TB/year before overhead
```

Redirect traffic is skewed: one viral alias can dominate. Model hot keys rather than relying only on average traffic per link.

## APIs and authoritative data

```text
POST /v1/links  { destination, expires_at?, custom_alias? }
  -> 201 { alias, short_url }
GET /{alias} -> redirect, or not-found / expired policy
DELETE /v1/links/{alias} -> idempotent owner-authorized deletion

links(alias PRIMARY KEY, destination, owner_id, created_at,
      expires_at, state, version)
```

Validate supported URL schemes and length. A short-link service does not necessarily need to fetch the destination; if previews or abuse scans fetch it, protect that fetch path from internal-network access and redirects to disallowed addresses. Store ownership separately from public alias knowledge.

## Baseline architecture

```text
Creator -> API -> primary mapping database
                    |-> outbox -> invalidation / analytics pipeline

Visitor -> edge / load balancer -> redirect service -> cache
                                            miss -> mapping store
                                            event -> analytics buffer
```

Keep analytics out of the redirect critical path. Decide whether some click events may be lost during telemetry failure; if not, durable event recording changes latency and cost. Do not silently imply perfect analytics from a best-effort asynchronous send.

## Alias generation

Seven base62 characters provide `62^7`, about 3.52 trillion possible strings. Capacity is not the same as collision safety: random selection can collide well before the namespace is full. Generate with suitable randomness, insert under a unique constraint, and retry collisions within a bound. A sequential ID encoded in base62 is compact but reveals ordering and enables enumeration.

For custom aliases, let the unique constraint decide the race and return conflict to the loser. Never implement uniqueness as “check then insert” without enforcement. Namespace rules must distinguish application routes from public aliases.

## Redirect and cache behavior

Read the cache, then the mapping store on a miss. Check state and expiration before redirecting. Cache misses and expired aliases briefly only if newly created or restored links can become visible within the promised freshness window.

Choose redirect status deliberately. A permanent redirect can be cached by browsers and intermediaries, complicating destination changes or urgent deletion. Temporary redirects with explicit cache policies are often more suitable for mutable aliases. Server cache invalidation alone cannot recall an aggressively cached browser redirect.

Use request coalescing, TTL jitter, and bounded database fallback for viral keys or cache loss. Carry mapping versions in invalidation and population logic when freshness requires protection from stale fills.

## Scale and failure review

Shard mappings by alias when a measured single-store limit justifies it. Replicate reads regionally according to a stated consistency model. A newly created link should not return not-found merely because its local replica is behind; route or wait according to a defined read-after-create contract.

Monitor redirect p99, availability, cache hit ratio, mapping freshness, alias collisions, and analytics lag. Rate-limit creation, detect abusive destinations, and give deletion propagation an observable deadline.

**Practice:** Explain the behavior when creation commits but its HTTP response is lost, when a viral link expires, and when a user deletes a link that a browser already cached as permanent. Identify which guarantees the server can and cannot enforce.
