---
id: lesson-sys-cdn
kind: lesson
topicId: system-design-cdn
title: Edge caching, origin protection, and content freshness
summary: Design CDN cache keys, immutable assets, origin shields, purge behavior, and safe delivery of public and private content.
difficulty: medium
status: published
revision: 1
order: 90
tags: [system-design, cdn, caching]
prerequisiteIds: [lesson-sys-caching-fundamentals]
---

## Why move content to the edge?

A content delivery network serves eligible content from locations closer to users. It reduces network distance, absorbs repeated reads, and shields origin infrastructure. DNS-based routing, anycast, or combinations of mechanisms direct clients to suitable points of presence. The selected location need not be geographically nearest; network health, peering, and capacity also matter.

```text
Browser -> edge cache -> regional / shield cache -> origin application or object store
                hit -> response
                miss ---------------------------> load and populate eligible caches
```

An origin shield concentrates misses from many edges into an intermediate tier. Request collapsing can combine concurrent misses. Neither works unless cache keys and eligibility are configured correctly.

## Define the cache key and eligibility

A cache key often includes host, path, and selected query parameters or headers. Include all representation-changing inputs, but avoid irrelevant high-cardinality values that destroy hit ratio. A tracking query parameter may be ignorable; an image-size parameter is not.

Never allow one authenticated user's response to become another user's cached response. Understand `Authorization`, cookies, `Vary`, and shared-cache directives. Public static assets are usually the safest starting point. Personalized pages may use private browser caching, carefully scoped keys, or no shared caching at all.

Useful HTTP examples:

```http
Cache-Control: public, max-age=31536000, immutable
```

Use this for a content-addressed asset such as `app.a8f913.js` that will never change at that URL. For mutable public catalog data:

```http
Cache-Control: public, max-age=30, s-maxage=120, stale-while-revalidate=30
ETag: "catalog-v42"
```

Here the browser and shared caches have different freshness budgets. Actual directive support and override rules depend on the CDN. Revalidation with `If-None-Match` can return `304 Not Modified`, reducing payload bytes while still requiring a validation exchange.

## Versioning versus purging

Versioned URLs make immutable deployments simple: publish new assets, then update references. Old pages can continue loading old assets until their retention window ends. Deleting old build assets immediately can break clients with cached HTML.

Purging is needed for mutable or removed content, but invalidation is a distributed operation. Define its expected propagation delay and failure response. A long TTL plus “we can always purge” is insufficient for urgent content removal unless that purge behavior is tested.

Negative caching can prevent repeated origin lookups for missing files. Keep its TTL compatible with publishing: an asset requested just before upload should not stay missing for hours.

## Protect and observe the origin

Use origin access controls so attackers cannot bypass edge rate limits by calling a public origin directly. Bound origin concurrency and consider origin authentication. A CDN mitigates some attacks, but a flood of unique uncached URLs can still overload the application.

Track hit ratios by bytes and requests, origin request rate, cache status, regional latency, purge lag, and egress costs. Test an empty edge and a sudden global cache invalidation.

**Exercise:** Design deployment for a documentation site with private account pages. Explain which URLs are immutable, which responses use shared caching, and how a deleted document stops being served within a defined deadline.

Reference: [HTTP caching specification, RFC 9111](https://www.rfc-editor.org/rfc/rfc9111).
