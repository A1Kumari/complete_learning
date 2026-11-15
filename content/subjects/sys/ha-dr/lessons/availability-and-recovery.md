---
id: lesson-sys-ha-dr
kind: lesson
topicId: system-design-ha-dr
title: Availability targets, backups, RPO, and RTO
summary: Design for failure domains, calculate error budgets, distinguish replication from recovery, and validate regional failover through restore drills.
difficulty: hard
status: published
revision: 1
order: 220
tags: [system-design, availability, disaster-recovery]
prerequisiteIds: [lesson-sys-database-replication, lesson-sys-reliability]
---

## Define what “available” means

An availability SLI might be the fraction of valid user requests completed successfully within a latency threshold. Exclude or include specific client errors deliberately; do not let a service look healthy by returning fast errors or stale responses outside its contract.

A 99.9% time-based target over a 30-day month permits about 43.2 minutes of unavailability; 99.99% permits about 4.32 minutes. Request-based error budgets depend on traffic instead of elapsed time. The measurement window and success definition belong in the design.

For independent required serial dependencies, a rough combined availability is the product. Two dependencies at 99.9% yield about 99.8001%. Shared infrastructure makes failures correlated, so independence is often an optimistic simplification. Optional features with safe fallbacks need not multiply into the critical path in the same way.

## Redundancy must cross the failure boundary

Two processes on one host do not survive host loss. Two hosts in one zone do not survive that zone's outage. Multiple regions still may share a bad deployment, DNS configuration, identity provider, or corrupted data pipeline.

List the failure domains the system is meant to survive: process, host, rack, zone, region, operator mistake, and data corruption. Keep sufficient spare serving and storage capacity after the intended failure, and test traffic redistribution.

## RPO and RTO describe recovery objectives

- **Recovery point objective (RPO):** Maximum acceptable loss of recent data, expressed as a time interval or equivalent business boundary.
- **Recovery time objective (RTO):** Maximum acceptable time to restore the promised service after disruption.

Asynchronous cross-region replication may support a short RTO but nonzero RPO. Backup-only recovery is often cheaper but slower. “Zero data loss” needs a concrete acknowledged-write durability contract and a supported failure model.

## Recovery strategies

| Strategy | Normal cost | Typical recovery work |
| --- | --- | --- |
| Backup and restore | Lower | Provision, restore data, replay logs, validate, reroute |
| Pilot light | Some core resources running | Scale application and finish recovery |
| Warm standby | Reduced secondary deployment | Scale up, promote, reroute |
| Active-active | Multiple regions serve traffic | Resolve ownership, capacity, and conflict behavior |

Active-active is not automatically the most reliable choice. It adds coordination, conflict, and operational complexity. A well-tested single-writer failover design can be more appropriate.

## A backup is useful only if it restores

Maintain point-in-time recovery where needed, independent copies protected from accidental deletion, and a tested retention policy. Verify encryption keys, credentials, infrastructure definitions, schema compatibility, and application dependencies. A database restored in isolation is not yet a recovered product.

A recovery runbook should identify the decision authority, fencing of the previous writer, promotion criteria, routing change, data verification, degraded mode, and eventual failback. Measure restore time on realistic data volume instead of extrapolating from a tiny test.

**Exercise:** An order service has RPO under one minute and RTO under fifteen minutes. Compare a nightly backup, continuous log shipping, and synchronous replication. Explain which measures protect against zone loss and which protect against a bad migration deleting records.

Reference: [Google SRE service-level objectives](https://sre.google/sre-book/service-level-objectives/).
