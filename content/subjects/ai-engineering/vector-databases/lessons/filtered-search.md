---
id: lesson-ai-filtered-vector-search
kind: lesson
topicId: ai-vector-databases
title: Metadata Filters and Per-Tenant Retrieval
summary: Distinguish filtered nearest neighbors from post-filtered global results, trace candidate starvation, and enforce tenant and version eligibility.
difficulty: hard
status: published
revision: 1
order: 460
tags: [vector-databases, filtering, multitenancy, metadata]
conceptIds: [concept-filtered-vector-search]
prerequisiteIds: [lesson-ai-approximate-indexes]
---

## Similarity cannot encode eligibility reliably

A query may be close to an obsolete policy or another tenant's document. Eligibility
must come from explicit predicates, such as tenant, access groups, effective date,
language, or active revision. Derive access constraints from authenticated server
state, not a client-supplied tenant string accepted without verification.

The desired query is **top-k among eligible records**. This differs from fetching
the global top-k and deleting ineligible results afterward.

```text
trusted request identity → mandatory eligibility predicate
query vector + predicate → filtered candidate search → current eligibility check
                                              → permitted IDs and content
```

Keep access-sensitive candidates out of downstream rerankers, model prompts, and
user-visible diagnostics. Metadata filtering is a mechanism within an authorization
design; its existence does not automatically make every application query authorized.

## Trace candidate starvation

```python
records = [
    {'id': 'other', 'tenant': 'B', 'active': True, 'score': .99},
    {'id': 'old', 'tenant': 'A', 'active': False, 'score': .98},
    {'id': 'current', 'tenant': 'A', 'active': True, 'score': .90},
    {'id': 'guide', 'tenant': 'A', 'active': True, 'score': .80},
]
def eligible(record, tenant):
    return record['tenant'] == tenant and record['active']

ranked = sorted(records, key=lambda r: (-r['score'], r['id']))
postfiltered = [r['id'] for r in ranked[:2] if eligible(r, 'A')]
prefiltered = [r['id'] for r in ranked if eligible(r, 'A')][:2]
assert postfiltered == []
assert prefiltered == ['current', 'guide']
assert [r for r in records if eligible(r, 'C')] == []
print('global top-2 then filter: empty; eligible top-2: current, guide')
```

These are fixed similarity scores, not live encoder results. Oversampling more than
k global candidates may help post-filtering, but no fixed small multiplier ensures
k eligible matches under arbitrary selectivity. Returning fewer results should be
an explicit outcome, not a reason to relax tenant constraints.

## Understand execution plans

**Prefiltering** establishes eligibility before candidate selection, often using
metadata indexes or partitions. **Integrated filtering** incorporates predicates
within ANN traversal or candidate acceptance. **Post-filtering** filters an already
limited shortlist. Product terminology varies; inspect actual query semantics and
measure filtered recall rather than assuming a label proves exact filtered top-k.

Selective filters may make an exact scan over eligible vectors cheaper than ANN.
Graph traversal needs care: forbidden output nodes and traversable internal nodes
are different implementation concepts. Removing every ineligible navigation node
can disconnect paths, while accepting only eligible outputs may still require
more exploration. Leave traversal details to a documented engine strategy and
verify observable eligibility and recall.

Index frequently filtered metadata fields. Test conjunctions and disjunctions:
`tenant=A AND active=true AND group in permitted_groups` must not become
`tenant=A OR group=public` by accidental boolean composition. When records have
arrays of objects, check whether conditions bind to the same nested object.

## Updates and isolation strategies

A shared collection with indexed tenant predicates can simplify operations but
requires mandatory constraints everywhere. Per-tenant partitions or collections
offer different isolation and scaling trade-offs, at the cost of many small
indexes, routing, or operational overhead. Choose based on tenant sizes, skew,
management cost, and the store's supported isolation features.

Permission changes can race search results. Revalidate current access before
returning source content, and define how revocation propagates to caches and
replicas. For historical questions, apply the requested effective interval rather
than blindly selecting the newest document. Missing required identity metadata
should produce a rejected request or no results under the declared policy.

## Recall and application

Reproduce the example with an oversampling limit of three. Does it return two
eligible records? Design checks for two tenants with identical text, permission
revocation during a request, empty tenant collections, and very selective dates.

## References

- [Qdrant: filtering, boolean clauses, and payload indexes](https://qdrant.tech/documentation/concepts/filtering/)
- [Qdrant: multitenancy strategies](https://qdrant.tech/documentation/guides/multitenancy/)
