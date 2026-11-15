---
id: lesson-sys-search
kind: lesson
topicId: system-design-search
title: Build an indexing, retrieval, and ranking pipeline
summary: Design a search system with inverted indexes, ingestion, freshness, filters, hybrid retrieval, ranking evaluation, and safe index rebuilds.
difficulty: hard
status: published
revision: 1
order: 330
tags: [system-design, search, indexing]
prerequisiteIds: [lesson-sys-event-driven, lesson-sys-sharding]
---

## Separate indexing from query serving

Search stores are usually derived from authoritative product, document, or content data. An ingestion pipeline transforms source changes into searchable representations, while a query pipeline selects and ranks candidates.

```text
Source database -> outbox / CDC -> normalize -> index writer -> search shards
                                                                  ^
User -> query parsing -> eligibility filters -> retrieve -> rank ---+
                                               -> results / snippets
```

The diagram is conceptual: ranking often happens after candidates return from shards. Define what happens if source data changes faster than the index can ingest it.

## Inverted indexes and analysis

An inverted index maps terms to document postings, often including term frequency and positions. Query terms can intersect or combine postings efficiently instead of scanning every document. Positions support phrase queries; analyzers decide tokenization, case normalization, stemming, and language handling.

Analysis is part of the data contract. A product code like `AB-123` may require exact matching that a natural-language stemmer destroys. Index appropriate fields separately: title text, exact identifiers, categories, price, and availability. Choose BM25-style lexical ranking for term relevance, not as a universal measure of product usefulness.

## Distributed retrieval and ranking

Shard the index so each shard handles a subset of documents. A coordinator fans out a query, receives top candidates, and merges them. More shards add parallelism but also fan-out overhead and tail sensitivity: one slow shard can delay the whole query.

Use bounded candidate counts and ranking stages. A cheap retrieval stage can return hundreds of candidates; a more expensive reranker evaluates a smaller set. Dense vector retrieval can complement lexical search for semantic similarity. Hybrid methods fuse result lists or calibrated scores, but must be evaluated rather than assumed better.

Filters such as tenant, permissions, category, or location belong in the retrieval design. Fetching the top ten globally and filtering afterward can return too few relevant authorized results. For sensitive content, eligibility checks must prevent unauthorized information from leaking through results, snippets, facets, or counts.

## Freshness, deletes, and rebuilds

Carry source versions so delayed updates cannot overwrite newer indexed state. Propagate deletion tombstones and define an index-freshness SLO. A search result is not proof that an item is still purchasable; checkout revalidates authoritative price and inventory.

For a schema or analyzer change, build a new versioned index, backfill it, stream ongoing changes, evaluate correctness and relevance, then switch an alias or routing pointer. Keep a rollback plan and understand which new writes the old index has missed.

## Evaluate relevance and operations separately

Measure Recall@k for candidate coverage and ranking metrics such as MRR or nDCG using labeled queries. Slice by language, rare terms, exact identifiers, and high-value user journeys. Also measure p95/p99 query latency, indexing delay, shard skew, timeout rates, and storage cost.

**Exercise:** Design marketplace search for “waterproof hiking shoes under 100.” Separate text relevance, structured price filtering, inventory freshness, personalization, and checkout correctness. Explain a fallback when the semantic retrieval service is unavailable.
