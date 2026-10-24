---
id: lesson-ai-dense-retrieval
kind: lesson
topicId: ai-retrieval-systems
title: Dense Retrieval Using Embeddings
summary: Build a dense retrieval mental model, understand query-document vector matching, and identify where semantic search misses exact evidence.
difficulty: medium
status: published
revision: 1
order: 485
tags: [retrieval, dense-retrieval, embeddings]
prerequisiteIds: [lesson-ai-embedding-metrics, lesson-ai-search-fundamentals]
---

## Meaning rather than shared words

Dense retrieval embeds a query and documents into the same vector space, then ranks by
a similarity metric. `How do I get money back?` may find a document titled `Refund
policy` even without the word `refund` in the query.

## The trade-off

Dense models can capture paraphrase and multilingual relationships, but may blur exact
identifiers, negation, versions, and rare names. ANN search adds a second concern:
the index may fail to return a vector that is truly near the query. Measure index
recall against exact search separately from relevance recall against labels.

## Combine deliberately

Use dense retrieval as one candidate generator, preserve document IDs and scores, and
compare it with lexical retrieval on query slices. Hybrid retrieval is useful when
both semantic paraphrase and exact terms matter; it is not a guarantee that either
component is well calibrated.

## Recall

Why might dense retrieval miss a product code that lexical search finds immediately?
What is the difference between ANN recall and relevance recall?
