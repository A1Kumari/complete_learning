---
id: lesson-ai-retrieval-reranking
kind: lesson
topicId: ai-retrieval-systems
title: Candidate Generation and Cross-Encoder Reranking
summary: Separate retrieval depth from final result count, explain joint query-document scoring, and identify errors a reranker cannot repair.
difficulty: medium
status: published
revision: 1
order: 500
tags: [retrieval, reranking, cross-encoder, latency]
conceptIds: [concept-retrieval-reranking]
prerequisiteIds: [lesson-ai-hybrid-retrieval]
---

## Spend expensive scoring on a shortlist

A first-stage retriever aims to find a broad candidate set cheaply. A cross-encoder
processes a query and a candidate together, allowing token-level interactions
between them before producing a relevance score. It can distinguish close topical
matches that independently encoded vectors blur, but improvement depends on its
training and input coverage.

```text
eligible corpus → lexical/dense candidates (depth N)
               → fused/deduplicated shortlist (depth M)
               → joint query-document scoring → final top-k, with k <= M
```

Bi-encoder document embeddings are reusable across queries. Cross-encoder scores
depend on each query-document pair, so they generally cannot be precomputed once
per document for arbitrary future queries. Some models output logits and others
bounded scores; neither format is automatically a calibrated probability of
factual support.

## Trace reordering and the candidate ceiling

The following adapter uses fixed scores standing in for a model. It verifies
selection and candidate limits without downloading a checkpoint. It does not
simulate the transformer's actual language understanding.

```python
docs = {'A': 'reset password account', 'B': 'recover login credentials',
        'C': 'error zx-42 connection', 'D': 'password password security guide'}
query = 'How can I reset my password?'
pair_scores = {(query, 'A'): .95, (query, 'B'): .90,
               (query, 'C'): .01, (query, 'D'): .20}
def rerank(query, candidates, k):
    if len(candidates) != len(set(candidates)):
        raise ValueError('duplicate candidate IDs')
    if type(k) is not int or k < 1:
        raise ValueError('positive integer k required')
    for doc in candidates:
        assert doc in docs
    return sorted(candidates, key=lambda doc: (-pair_scores[query, doc], doc))[:k]

assert rerank(query, ['D', 'A', 'B'], 2) == ['A', 'B']
assert rerank(query, ['D', 'B'], 2) == ['B', 'D']
assert 'A' not in rerank(query, ['D', 'B'], 2)
assert rerank(query, [], 2) == []
print('reranked: A, B; missing candidate A cannot be recovered')
```

The lexical baseline for “password” favors D, while these illustrative joint
scores favor the action-oriented A and B. Removing A upstream makes it impossible
for this reranker to return A, regardless of its hypothetical score. Final recall
cannot exceed the relevant coverage of the actual shortlist being reranked.

## Budget lengths, pairs, and time

Choose branch depths, fused shortlist M, and final k independently. Increasing M
may improve relevant coverage but increases pair scoring and queueing. Document
length and query length affect runtime and input truncation. If the decisive
paragraph is cut off, more scoring compute does not restore its missing text.
Choose chunk boundaries, field allocation, and truncation strategy deliberately.

Batch pair scoring where the serving stack benefits, and measure p50/p95
end-to-end latency under expected concurrency. A timeout fallback can return the
already eligible fused ranking with an explicit degraded path. Do not silently
pretend unscored candidates received model scores, or merge raw reranker logits
and unrelated retriever scores without a justified policy.

## Inspect failure at the correct stage

For each labeled query, save eligible candidate IDs after retrieval, fusion, and
reranking, plus versioned configurations. If a relevant result was never in the
shortlist, inspect retrieval coverage, filtering, and fusion truncation. If it was
present but demoted, inspect pair input truncation, model/domain fit, and score
direction. A reranker cannot fix missing permissions metadata, stale source text,
or factual errors in the documents.

Use deduplication and, where useful, document diversity so final k is not consumed
by near-identical chunks. Evaluate diversity policies against multi-part questions:
deduplicating too aggressively can remove separate necessary evidence.

## Recall

Why do a bi-encoder and a cross-encoder have different query-time costs? Where
would you look if Recall@100 is high before fusion but low in the rerank shortlist?
What should a result mean when the reranker times out halfway through a batch?

## References

- [Sentence Transformers: retrieve-and-rerank pipeline](https://www.sbert.net/examples/sentence_transformer/applications/retrieve_rerank/README.html)
- [Sentence Transformers: cross-encoder versus bi-encoder](https://www.sbert.net/examples/cross_encoder/applications/README.html)
