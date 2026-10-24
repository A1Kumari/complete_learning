---
id: lesson-ai-embedding-evaluation-migration
kind: lesson
topicId: ai-embeddings
title: Embedding Evaluation, Drift, and Safe Migration
summary: Compute small retrieval metrics, separate relevance quality from vector health, and migrate model/preprocessing versions without mixing incompatible spaces.
difficulty: medium
status: published
revision: 1
order: 370
tags: [embeddings, evaluation, drift, model-migration, python]
conceptIds: [concept-embedding-evaluation, concept-embedding-input-contracts]
prerequisiteIds: [lesson-ai-embedding-metrics, lesson-ai-embedding-input-contracts]
---

## Pick evaluation that matches the consumer

An embedding can be used for retrieval, clustering, classification features, or
duplicate detection. A similarity benchmark is useful evidence about one task,
not proof of quality across all uses. Choose relevant datasets/slices, corpus size,
query distribution, and errors the application actually cares about.

```text
reviewed queries + relevance judgments
                    ↓ old and candidate encoder contracts
             separate compatible vector spaces
                    ↓ same corpus / evaluation protocol
        quality + slices + latency + cost → staged migration
```

For retrieval, recall@k measures how much of the known relevant set appears in the
first k unique results. Reciprocal rank is `1/rank` of the first relevant result,
or zero if none is returned; MRR averages that across queries. Relevance labels
may be incomplete, so do not silently treat every unjudged document as known bad
without documenting the evaluation assumption.

## Calculate a paired comparison

Two queries each have one known relevant document. Baseline ranks them first and
third; candidate ranks them second and first. At k=2, baseline recall is 0.5,
candidate recall is 1.0. MRR moves from `(1 + 1/3)/2 ≈ 0.6667` to
`(1/2 + 1)/2 = 0.75`. These are fictional rankings to demonstrate the metric,
not results from a trained model.

```python
def metrics(rankings, relevant, k):
    recalls, reciprocal = [], []
    for query, gold in relevant.items():
        if not gold:
            raise ValueError('no-answer cases need a separate acceptance metric')
        # Count documents once even if an adapter accidentally returns duplicates.
        ranked = list(dict.fromkeys(rankings.get(query, [])))
        recalls.append(len(set(ranked[:k]) & gold) / len(gold))
        first = next((i for i, doc in enumerate(ranked, 1) if doc in gold), None)
        reciprocal.append(0. if first is None else 1 / first)
    return sum(recalls) / len(recalls), sum(reciprocal) / len(reciprocal)

gold = {'q1': {'a'}, 'q2': {'b'}}
old = {'q1': ['a', 'x'], 'q2': ['x', 'y', 'b']}
new = {'q1': ['x', 'a'], 'q2': ['b', 'x']}
old_scores = metrics(old, gold, 2)
new_scores = metrics(new, gold, 2)
assert old_scores[0] == .5 and new_scores[0] == 1.
assert abs(old_scores[1] - 2/3) < 1e-12 and new_scores[1] == .75
assert metrics({'q1': ['a', 'a']}, {'q1': {'a'}}, 2) == (1., 1.)
print(tuple(round(x, 4) for x in old_scores), tuple(round(x, 4) for x in new_scores))
```

This toy dataset is too small for a confident production quality claim. Include
real held-out queries, multilingual/domain slices, exact identifiers, no-answer
cases, and uncertainty where sample sizes are small. Tune thresholds on validation
data rather than the final comparison set. Keep the corpus and permission filter
consistent when comparing encoder quality.

## Separate encoder drift from data drift

An encoder/preprocessing change can move representations even when source text is
unchanged. A corpus/query change can reduce relevance with unchanged weights.
Monitor nonfinite vectors, dimensions, norms, empty/truncated inputs, source and
preprocessing revisions, and actual task outcomes. Score distribution drift is a
signal to investigate, not proof of degraded relevance. Stable average norms do
not prove quality either.

Public leaderboard averages can hide a weak target language or miss exact-code
lookup needs. Record embedding latency, throughput, token limits, vector storage,
and operational cost along with task scores. One million 768-dimensional float32
vectors alone require `1,000,000*768*4 = 3,072,000,000` bytes, excluding indexes
and metadata. Hardware, precision, and service limits affect the practical choice.

## Migration without mixing spaces

Version the complete encoder contract: model/tokenizer revisions, input formatting,
pooling, normalization, truncation/chunking, dimension, and precision. Build a
separate candidate vector collection from source records, generate candidate
queries with the same contract, and compare in shadow or offline mode. Same width
does not imply compatible coordinates.

Keep updates/deletions synchronized during backfill. At cutover, route query
encoder and document collection together; a new query encoder against old vectors
is not a valid test of the new system. Retain a rollback route until the candidate
meets release criteria, and refresh thresholds rather than assuming old cosine
cutoffs transfer. Approximate-index tuning and consistency details belong to the
later Vector Databases topic.

## Recall

Calculate both metric pairs before running code. Why does a model change require
more than checking vector dimension? Name evidence that distinguishes a corpus
change from a preprocessing regression. Explain why a no-answer query needs a
separate abstention metric rather than recall with a zero-sized relevant set.

## Verified references

- [MTEB paper: multi-task embedding evaluation](https://arxiv.org/abs/2210.07316)
- [Sentence Transformers similarity and scoring conventions](https://www.sbert.net/docs/sentence_transformer/usage/semantic_textual_similarity.html)
- [Multilingual E5 model card: task/language performance and preprocessing](https://huggingface.co/intfloat/multilingual-e5-base)
