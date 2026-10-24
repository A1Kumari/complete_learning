---
id: ai-retrieval-reranker-ceiling
kind: question
topicId: ai-retrieval-systems
lessonId: lesson-ai-retrieval-reranking
prompt: Why use a cross-encoder after a bi-encoder or lexical retriever, and can it fix a relevant document missing from the shortlist?
difficulty: medium
status: published
revision: 1
order: 980
tags: [retrieval, cross-encoder, reranking]
conceptIds: [concept-retrieval-reranking]
followUps:
  - Why are cross-encoder relevance scores not reusable for every future query?
  - Can a bounded score be assumed to be a calibrated probability of factual support?
misconception: Better pairwise ranking cannot overcome a missing candidate.
---

## Answer

A cross-encoder jointly processes the query and each candidate, allowing detailed
token interactions that can improve ordering. Restricting it to a shortlist limits
expensive pair scoring. It cannot return a relevant document absent from that
shortlist; improve upstream candidate coverage to repair that failure.

### Supporting reasoning

Bi-encoder document vectors can be precomputed independently of the query. Joint
pair scores depend on both inputs. Cross-encoder quality depends on domain fit and
input truncation, and its score is not automatically factual-support probability.

### Evaluation rubric

One point each: joint interaction mechanism; shortlist cost rationale; candidate
ceiling; precomputation or input/score qualification.
