---
id: sys-design-notification-priorities
kind: question
topicId: system-design-end-to-end
lessonId: lesson-sys-notifications
prompt: "How should a notification platform protect login codes from a large marketing campaign during provider throttling?"
difficulty: hard
status: published
revision: 1
order: 437
tags: [system-design, case-study, notifications]
followUps: ["When can provider failover create duplicate messages?", "Which notification states can the platform truthfully report?"]
---

## Answer

Separate priorities and channel queues, reserve provider/concurrency capacity for urgent transactional work, and throttle or pause bulk campaign expansion. Apply per-tenant quotas so one campaign cannot consume all shared capacity. Track oldest-job age by priority rather than only global queue depth.

Login codes need expiry and maximum delivery age; sending an expired code after a long retry backlog is not success. Use stable delivery identities, bounded retries with jitter, and provider-specific idempotency/reconciliation. Switching providers after an unknown first outcome can duplicate delivery, so distinguish confirmed rejection from uncertainty.

### Evaluation rubric

Require priority isolation, time-sensitive expiry, backpressure, preferences, and truthful status. Provider acceptance is not proof of device delivery or human reading.
