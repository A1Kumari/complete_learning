---
id: lesson-sys-news-feed
kind: lesson
topicId: system-design-end-to-end
title: Design a news feed with hybrid fan-out and stable pagination
summary: Compare write-time and read-time fan-out, handle celebrity skew, rank bounded candidates, enforce privacy, and paginate a changing feed.
difficulty: hard
status: published
revision: 1
order: 354
tags: [system-design, case-study, news-feed]
prerequisiteIds: [lesson-sys-sharding, lesson-sys-event-driven, lesson-sys-search]
---

## Requirements and workload

Support creating posts, following users, reading a home feed, and deleting or restricting content. Begin with a chronological feed, then introduce ranking if required. State a freshness target for new posts and a stricter policy for privacy revocation or deletion.

Assume 10 million daily active users, 2 posts per active user per day, and 20 feed opens. This gives about 231 posts/s and 2,315 feed reads/s on average, before peak factors. With 200 followers per ordinary author, naive write fan-out averages about 46,200 feed-entry writes/s. A single author with ten million followers changes the burst profile dramatically.

## Data and service boundaries

```text
posts(id, author_id, created_at, visibility, state, content_reference)
follows(follower_id, followee_id, ...)
feed_entries(user_id, rank_or_time, post_id, source_version)

Post API -> authoritative post store + outbox -> fan-out workers
                                               -> per-user feed indexes
Feed API -> candidate sources -> visibility filters -> rank -> hydrate -> response
```

Store media in object storage behind a CDN. Feed entries can hold post IDs and ranking metadata instead of copying the entire post body, reducing update and deletion duplication. Hydration fetches current eligible content in batches.

## Fan-out on write versus fan-out on read

**Write-time fan-out** inserts a new post ID into followers' feed indexes. Feed reads are fast, but storage writes grow with follower count and many entries may never be read.

**Read-time fan-out** fetches recent posts from followed authors and merges them when a user opens the feed. Posting is cheaper, but read cost grows with follow count and can produce many storage requests.

A **hybrid** approach pushes ordinary authors' posts while pulling high-fan-out authors at read time. Choose thresholds from workload and cost measurements, not a fixed celebrity number. Active-user-focused fan-out can reduce wasted writes, with a catch-up path for returning users.

## Candidate retrieval and ranking

Bound each source's candidate set. Merge precomputed feed entries, recent high-fan-out author posts, and any recommended content. Deduplicate by post ID, filter permissions and blocks, score, and hydrate a bounded page. Ranking failures can fall back to chronological order if the product allows it.

Ranking is a separate system from durable posting. A model service outage should not lose posts. Measure relevance and engagement with careful evaluation while protecting latency and diversity constraints.

## Pagination in a changing collection

Offset pagination can skip or duplicate items as new posts arrive. For chronological feeds, use a cursor containing `(created_at, post_id)` with a unique tie-breaker and an index matching the order. A session cutoff can keep newly arriving posts above the current browsing session.

For dynamically ranked feeds, a score-only cursor is unstable if scores change. Use a feed snapshot/session token or accept and document approximate pagination with deduplication. An opaque cursor is an encoding, not a guarantee of stable semantics.

## Deletion, privacy, and failure

Asynchronous fan-out can leave old entries after a post is deleted or made private. Re-check visibility during hydration and propagate deletion/version events to derived stores. Caches, counts, snippets, and recommendations all need the same eligibility boundary; removing the primary post alone is not enough.

Make fan-out resumable with per-event progress and idempotent feed insertion. A retry must not add the same post twice. During queue lag, show a defined stale feed or pull recent authoritative content within bounded budgets rather than launching unlimited fan-out queries.

Monitor post-to-feed freshness, fan-out backlog age, hot-author impact, read p99, duplicate suppression, visibility-filter drops, and storage amplification.

**Practice:** A celebrity posts while fan-out workers are delayed and one viewer blocks that celebrity. Trace how the feed remains responsive and how the block is enforced even if an old feed entry or cache still exists.
