---
id: lesson-sys-payments
kind: lesson
topicId: system-design-end-to-end
title: Design payments around idempotency, ledgers, and reconciliation
summary: Handle uncertain provider outcomes, duplicate requests and webhooks, durable accounting, authorization/capture workflows, and restart-safe recovery.
difficulty: hard
status: published
revision: 1
order: 352
tags: [system-design, case-study, payments]
prerequisiteIds: [lesson-sys-transactions, lesson-sys-concurrency, lesson-sys-event-driven]
---

## Correctness requirements come first

Accept payment for an order without creating duplicate charges for the same logical attempt. Track authorization, capture, cancellation, and refund as distinct operations. Use an external payment provider for sensitive card handling through tokenized references rather than storing raw card data in ordinary application records.

Availability is important, but an uncertain payment must not be reported as definitely failed or definitely successful without evidence. Financial reconciliation and auditability are core product functions, not background cleanup.

## APIs and state

```text
POST /v1/payment-attempts
  Idempotency-Key: stable-client-operation
  { order_id, amount_minor_units, currency, payment_method_reference }
GET /v1/payment-attempts/{id}
POST /v1/provider-webhooks

Attempt: CREATED -> SUBMITTED -> AUTHORIZED -> CAPTURED
                            |-> REJECTED
                            |-> UNKNOWN -> reconciled outcome
Refund: separate operation and lifecycle
```

The application computes or validates the payable amount from authoritative order state; it does not trust an arbitrary client-supplied total. Amounts use exact minor units or an appropriate decimal model with currency-specific rules.

## Architecture and ownership

```text
Client -> payment API -> payment database + outbox
                             |-> workflow worker -> provider
Provider -> authenticated webhook -> inbox -> state / ledger transaction
Reconciler -----------------------------> provider status / settlement reports
```

Store attempt ID, request fingerprint, provider idempotency key, provider reference, state/version, and timestamps. Enforce uniqueness for the relevant tenant/idempotency scope. Reusing a key with a different payload must return a conflict rather than creating a new charge.

## The timeout that defines the design

1. Persist the payment attempt and stable provider operation key.
2. Send the provider request outside a long-held database transaction.
3. The provider charges successfully, but the response is lost.
4. Mark the local result unknown or pending, not definitively rejected.
5. Retry only with the same provider idempotency identity within its documented retention contract, or query using the provider reference.
6. Reconcile from an authenticated webhook or status query.

Provider idempotency has a scope and retention window. It is not an eternal guarantee for arbitrary retries. Long-running recovery needs durable references and explicit provider lookup/reconciliation behavior.

## Webhooks are duplicate and out-of-order inputs

Verify provider authentication/signatures against the exact required payload and reject invalid messages. Persist a receipt with a unique provider event ID and apply the corresponding state transition atomically. Acknowledge only after durable acceptance.

Do not let an old authorization event regress a captured payment. Apply a defined state machine and query the provider when messages conflict or lack sufficient ordering information. A webhook receipt alone does not prove that the money reached settlement.

## Ledger and reconciliation

Use an immutable or append-oriented accounting journal with balanced postings per transaction and currency. Record corrections as explicit reversing or adjusting entries, not silent history edits. Balance checks and references to the originating business operation make inconsistencies discoverable.

The exact accounting treatment of authorizations, captures, fees, refunds, and settlements depends on the product and accounting model. Do not treat a mutable `balance` column as a complete financial record. Derived balances can be maintained and verified against the journal.

Run reconciliation against provider transaction and settlement records. Detect missing webhooks, duplicate references, amount mismatches, and stuck unknown attempts. Make repair actions idempotent and auditable, with an operational path for unresolved discrepancies.

## Scale and observe

Partition by merchant or account according to transaction boundaries, while keeping required ledger postings atomic. Set provider concurrency limits, protect critical workers from analytics load, and monitor pending-age distributions, duplicate suppression, reconciliation mismatches, and accepted-to-settled delay.

**Practice:** Walk through a capture timeout followed by two identical webhooks and a delayed “authorized” webhook. Explain the final state, ledger effects, and why no extra charge or ledger posting occurs.
