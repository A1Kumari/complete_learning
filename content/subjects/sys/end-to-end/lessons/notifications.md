---
id: lesson-sys-notifications
kind: lesson
topicId: system-design-end-to-end
title: Design a multi-channel notification platform
summary: Build durable notification acceptance, preference-aware fan-out, provider workers, bounded retries, delivery tracking, and deduplication.
difficulty: hard
status: published
revision: 1
order: 353
tags: [system-design, case-study, notifications]
prerequisiteIds: [lesson-sys-message-queues, lesson-sys-rate-limiting, lesson-sys-reliability]
---

## Scope the product and delivery meaning

Support transactional email, SMS, and push notifications with templates, user preferences, scheduled delivery, and status tracking. Separate urgent transactional work from bulk marketing. Define whether “delivered” means accepted by your queue, accepted by a provider, delivered to a device, or opened by a person; these are different states.

Assume 100 million notification requests/day, about 1,157/s average, with a 10x campaign peak. One request can fan out to several recipients and channels, so derive actual delivery-job rate from the fan-out distribution. A campaign to ten million users is not one unit of work just because one API call initiated it.

## Architecture

```text
Business event / API -> notification service -> database + outbox
                                               |
                              preference / template expansion
                                               |
                         priority + channel queues
                          |        |        |
                        email     SMS      push workers -> providers
                                               ^
                               callbacks -> durable status inbox
```

Persist a notification ID and stable delivery IDs, such as `(business_event, recipient, channel, template_version)`, under appropriate uniqueness constraints. Store the template version used so retries do not silently change content after a template deployment.

## Preference and scheduling decisions

Check channel eligibility, consent where required by the product, unsubscribe state, locale, time zone, and quiet hours. Decide whether preferences are re-evaluated at actual send time, especially for delayed campaigns. Avoid embedding a recipient list forever in a queue if later permission changes must be respected.

Use a durable scheduler for future work, with bounded lookahead and idempotent claiming. A process-local sleep for a notification scheduled next week does not survive restart. Convert user-local schedules with an explicit daylight-saving policy.

## Provider interaction and uncertainty

A worker claims a delivery, sends it with a stable provider idempotency reference when supported, records the response, and acknowledges work. If the provider accepted the message but the response was lost, a retry can send it twice. Not every provider supports exactly-once effects; state the residual risk and reconcile provider references when possible.

Fallback to a second provider can also duplicate delivery if the first outcome is unknown. Switch only under a defined policy, distinguishing confirmed rejection from uncertainty. Do not label queue-level at-least-once processing as duplicate-free human notification delivery.

## Retry and overload policy

Separate transient throttling from permanent invalid addresses or unsubscribed users. Use exponential backoff with jitter, maximum age, maximum attempts, and a dead-letter workflow. A password-reset link that expires in ten minutes should not be delivered from a three-hour backlog.

Maintain per-provider and per-tenant rate limits, channel concurrency limits, and priority isolation. Marketing traffic must not consume all SMS capacity needed for login codes. Backpressure can pause expansion of bulk campaigns rather than generating millions of immediately unserviceable jobs.

## Status and operations

Authenticate and deduplicate provider callbacks. Track accepted, attempted, provider-accepted, delivered, failed, and expired states without treating them as interchangeable. Callbacks can arrive late or out of order; apply a state machine with provider-specific semantics.

Monitor oldest-job age by priority, send latency, provider error codes, bounce rate, duplicate rate, cost per channel, and template failures. Keep sensitive message contents out of ordinary logs and use defined retention for delivery records.

**Practice:** Design a priority policy for one-time passcodes and weekly newsletters during a provider outage. Explain queue placement, expiry, fallback, deduplication, and what the user-facing status page can truthfully claim.
