---
id: lesson-ai-rag-architecture
kind: lesson
topicId: ai-rag
title: The Complete RAG Architecture
summary: Trace one company-document assistant through offline indexing and online query, retrieval, generation, and validation paths.
difficulty: easy
status: published
revision: 1
order: 515
tags: [rag, architecture, pipelines]
prerequisiteIds: [lesson-ai-why-rag]
---

## Two connected pipelines

The offline path turns source documents into searchable records. The online path uses
a question to select eligible records and generate a response.

```text
offline: files → parse → chunks + provenance → embeddings/index
online:  question → retrieve → select evidence → prompt → answer/checks
```

For a company policy assistant, an updated PDF should be parsed and indexed without
blocking every user query. Each chunk needs a document ID, version, page or section,
tenant, access scope, and content hash. The online request should authenticate the
caller before retrieval, not after generation.

## Start with a small vertical slice

Load three documents, split them, use exact or lexical search, pass the top two
eligible passages to a model, and return citations. Only after this path works should
you add embeddings, rerankers, query rewriting, or agents. A small end-to-end system
reveals missing metadata earlier than a polished index with no answer checks.

## Recall

Which metadata must travel from ingestion to the final citation? Why should access
control happen before evidence enters the prompt?

Continue to [document ingestion and chunking](ingestion-and-chunking.md).
