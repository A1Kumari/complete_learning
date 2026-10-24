---
id: ai-rag-chunk-boundaries
kind: question
topicId: ai-rag
lessonId: lesson-ai-rag-ingestion
prompt: A return rule is on page one and its final-sale exception is on page two. What ingestion and chunking choices help prevent incomplete answers?
difficulty: medium
status: published
revision: 1
order: 1020
tags: [rag, chunking, ingestion]
conceptIds: [concept-rag-ingestion]
followUps:
  - What trade-offs does overlap introduce?
  - How would you evaluate a proposed chunk size?
misconception: A fixed chunk size is not universally optimal, and successful text extraction does not prove rule context survived.
---

## Answer

Preserve reading order, headings, page locations, and parent relationships. Make
the exception independently retrievable and retain a way to expand to its relevant
parent or neighboring context. Evaluate questions requiring both rule and exception
under the final model budget.

### Supporting reasoning

Tiny chunks may lose conditions; large chunks may crowd out other evidence. Overlap
can reduce boundary misses but adds duplicates. A parser can return many words
while losing the table or heading relationship needed to interpret them.

### Evaluation rubric

One point each: structural parsing; exception retrieval; provenance/parent context;
measured chunking and budget trade-off.
