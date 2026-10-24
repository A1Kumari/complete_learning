---
id: ai-rag-chunk-identity
kind: question
topicId: ai-rag
lessonId: lesson-ai-rag-ingestion
prompt: Why should RAG chunks retain source revision and location, and why does inserting newly generated chunk IDs not complete a document update?
difficulty: medium
status: published
revision: 1
order: 1030
tags: [rag, provenance, lifecycle]
conceptIds: [concept-rag-ingestion]
followUps:
  - What offset problem can whitespace normalization cause?
  - What should a revision manifest contain?
misconception: Upserting new chunks does not automatically retire old chunks from a previous segmentation.
---

## Answer

Revision and location make citations reconstructable and let the system verify
which policy version supported a claim. An update needs an active revision manifest
and cleanup or serving exclusion of obsolete chunk IDs, not just insertion of the
new segmentation.

### Supporting reasoning

Changing boundaries can create entirely new identities while old chunks remain
searchable. Normalization can change character offsets, so preserve coordinate
semantics or a mapping to the original source for precise highlighting.

### Evaluation rubric

One point each: reconstructable provenance; version-aware support; obsolete-chunk
handling; manifest or offset qualification.
