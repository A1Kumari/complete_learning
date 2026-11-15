---
id: lesson-sys-consistency
kind: lesson
topicId: system-design-consistency
title: Specify the consistency users actually need
summary: Distinguish linearizability, serializability, causal and session guarantees, eventual convergence, and quorum limitations.
difficulty: hard
status: published
revision: 1
order: 130
tags: [system-design, consistency, distributed-systems]
prerequisiteIds: [lesson-sys-database-replication]
---

## A model describes allowed observations

Consistency is not a single fast-versus-safe switch. It describes which histories of reads and writes a system allows. State the operation and scope: a linearizable update to one key is different from a serializable transaction involving several records.

**Linearizability** makes each operation appear to occur at one instant between invocation and response, respecting real-time order. If a write completes before a read begins, that read cannot return an older value within the relevant object history.

**Serializability** makes committed transactions equivalent to some serial order, but does not by itself require that order to respect external real-time ordering. **Strict serializability** combines transaction serializability with real-time ordering.

## Weaker guarantees can still match the product

| Guarantee | User-visible meaning |
| --- | --- |
| Read-your-writes | Your later reads include your acknowledged updates |
| Monotonic reads | Your session does not move backward to older observations |
| Causal consistency | A causally dependent effect is not observed before its cause |
| Eventual consistency | Replicas converge after updates stop, assuming communication and reconciliation succeed |

Eventual consistency alone gives no fixed staleness bound and no promise that every intermediate write will be observed. A service promising “visible within five seconds” needs additional mechanisms and monitoring to enforce that bound.

For a social application, displaying a comment before the post it references violates causality. A delayed like count may be acceptable. Accepting two reservations for the last seat is generally not. Select guarantees per operation rather than assigning an entire product one vague consistency label.

## Quorum arithmetic is necessary but not sufficient

For N replicas, write quorum W and read quorum R satisfying `R + W > N` intersect when membership is fixed and those operations use the same replica set. For N=3, W=2 and R=2 guarantee an overlap of at least one replica.

Overlap alone does not prove linearizability. Concurrent writes, version ordering, sloppy quorums, membership changes, incomplete writes, and how reads choose or repair versions all matter. Use the actual database's consistency protocol instead of deriving product guarantees from a quorum equation alone.

## Handle conflicts explicitly

Last-write-wins using wall-clock timestamps is simple but can discard valid updates and is sensitive to clock skew. An increment represented as “replace count with 11” can overwrite another increment. Atomic counters, compare-and-swap, transactions, or suitable CRDTs can preserve intended semantics under their assumptions.

CRDTs converge by defining merge operations with required algebraic properties. They are not a generic solution for every invariant: a convergent counter can still violate a global stock limit if disconnected replicas independently sell inventory without an allocation protocol.

## Example: profile update versus checkout

A profile update can return a version and let reads require at least that version. Checkout should validate price and stock against an authoritative transaction boundary, even if a cached product page was slightly stale. The user's display path and business decision path do not need identical consistency guarantees.

**Exercise:** Choose guarantees for a username claim, a “liked” indicator, a bank transfer, and a chat conversation. Give an example history that should be allowed and one that should be rejected for each.
