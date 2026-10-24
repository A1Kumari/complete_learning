---
id: lesson-ai-retrieval-evaluation
kind: lesson
topicId: ai-retrieval-systems
title: Evaluate Retrieval and Diagnose Query-Slice Failures
summary: Calculate relevance Recall, MRR, and graded nDCG, distinguish them from ANN agreement, and compare retrieval stages on held-out query slices.
difficulty: hard
status: published
revision: 1
order: 510
tags: [retrieval, evaluation, recall, mrr, ndcg]
conceptIds: [concept-retrieval-evaluation]
prerequisiteIds: [lesson-ai-retrieval-reranking]
---

## Specify what a good result means

Create queries and relevance judgments for a fixed corpus snapshot. Define the
retrieval unit—document, passage, or chunk—and whether several chunks count as the
same relevant source. Labelers need the user's intent and effective time, not just
shared keywords. Use representative queries covering exact IDs, paraphrases,
languages, rare terminology, permission scopes, and no-answer cases.

ANN agreement measures approximation relative to exact vector neighbors. **Relevance
metrics** compare results with human/task judgments. A perfect ANN index can rank
the wrong source first if its embedding metric poorly reflects the user's need.

## Three metrics answer different questions

- **Recall@k:** fraction of known relevant items found in the first k. Useful for
  candidate coverage, especially when several sources are needed.
- **MRR@k:** mean reciprocal rank of the first relevant hit, with zero when none
  occurs by k. Useful when finding one good answer early is valuable.
- **nDCG@k:** discounted graded relevance divided by the ideal discounted gain.
  Useful when strongly relevant items should outrank partly relevant ones.

Here `gain = 2^grade - 1` and discount at one-based rank r is `log2(r+1)`. Grade
zero is nonrelevant. Other gain choices are valid if declared consistently.

## Work through a graded ranking

For labels A=3, B=1, C=0 and ranking `[C,B,A]`, the top two contain one of the two
relevant documents: Recall@2=0.5, reciprocal rank=0.5. DCG@2 is `1/log2(3)`;
ideal DCG@2 is `7 + 1/log2(3)`, so nDCG@2 is about 0.0827.

```python
from math import log2

def metrics(ranking, grades, k):
    if type(k) is not int or k < 1 or len(ranking) != len(set(ranking)):
        raise ValueError('positive k and unique result IDs required')
    if not set(ranking) <= grades.keys():
        raise ValueError('unjudged result requires an explicit labeling policy')
    relevant = {doc for doc, grade in grades.items() if grade > 0}
    if not relevant:
        return None  # Handle no-answer queries in a separate evaluation slice.
    top = ranking[:k]
    recall = len(set(top) & relevant) / len(relevant)
    rr = next((1/r for r, doc in enumerate(top, 1) if doc in relevant), 0.)
    dcg = sum((2**grades[doc]-1)/log2(r+1) for r, doc in enumerate(top, 1))
    ideal = sorted(grades.values(), reverse=True)[:k]
    idcg = sum((2**grade-1)/log2(r+1) for r, grade in enumerate(ideal, 1))
    return recall, rr, dcg/idcg

grades = {'A': 3, 'B': 1, 'C': 0}
poor = metrics(['C', 'B', 'A'], grades, 2)
good = metrics(['A', 'B', 'C'], grades, 2)
assert tuple(round(x, 4) for x in poor) == (.5, .5, .0827)
assert good == (1., 1., 1.)
assert metrics([], grades, 2) == (0., 0., 0.)
assert metrics(['C'], {'C': 0}, 2) is None
print('before: 0.5000, 0.5000, 0.0827; after: 1.0000, 1.0000, 1.0000')
```

This computes per-query reciprocal rank; MRR averages that value across evaluated
queries. Average other per-query metrics using a declared macro or traffic-weighted
policy. Do not accidentally count duplicate IDs as multiple relevant hits.

## Make judgment limitations visible

In realistic corpora, relevance judgments are incomplete. Treating every unjudged
item as nonrelevant can penalize a system that discovers valid new results. Pool
candidates from competing systems for review, document the judgment policy, and
keep the final held-out set separate from parameter tuning. Queries with no known
relevant items have an undefined recall denominator; evaluate no-answer behavior
with a declared false-positive/abstention measure instead of assigning recall 1.

## Compare stages and slices

```text
query set + corpus + judgments
  → lexical / dense / hybrid candidate coverage
  → fused shortlist coverage → reranked order quality
  → query-slice metrics + latency + freshness failures
```

For an exact error-code miss, inspect analyzer output, exact fields, dense rank,
fusion depth, and whether the correct document reached the reranker. For a
paraphrase miss, inspect encoder fit and lexical expansion. For a recently changed
policy, inspect indexing lag and version selection before altering ranking.

Report per-slice query counts and uncertainty; one exact-ID query is not a stable
estimate for that population. A broad candidate-recall increase can still reduce
top-k usefulness after reranking or exceed latency budgets. Compare quality and
operating cost together. This module evaluates retrieval; downstream answer
groundedness, citation support, and generation failures belong to RAG evaluation.

## Recall and application

Can MRR improve while multi-source Recall@k falls? Can nDCG improve without changing
which relevant IDs were retrieved? Design an ablation comparing lexical, dense,
fusion, and reranking with the same eligibility policy and final k.

## References

- [Stanford IR book: ranked retrieval evaluation](https://nlp.stanford.edu/IR-book/html/htmledition/evaluation-of-ranked-retrieval-results-1.html)
- [BEIR: heterogeneous retrieval evaluation](https://arxiv.org/abs/2104.08663)
