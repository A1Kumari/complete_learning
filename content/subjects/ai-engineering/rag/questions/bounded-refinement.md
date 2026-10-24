---
id: ai-rag-bounded-refinement
kind: question
topicId: ai-rag
lessonId: lesson-ai-rag-patterns
prompt: When should a multi-query or agentic RAG refinement loop stop, and why must a hypothetical generated document not become a primary citation?
difficulty: hard
status: published
revision: 1
order: 1090
tags: [rag, agentic-rag, query-expansion]
conceptIds: [concept-rag-patterns]
followUps:
  - How can rewriting change the user's intended query?
  - Which baseline should an advanced pattern be compared against?
misconception: Generating more search text or taking more retrieval steps does not by itself add factual evidence.
---

## Answer

Stop on sufficient supported evidence or explicit limits such as search count,
deadline/cost, repeated queries, or no new usable information. A hypothetical
document is generated search scaffolding; cite the actual eligible source evidence
retrieved with it, not the invented text.

### Supporting reasoning

Query variants can improve vocabulary coverage but may drift from names, negation,
dates, or intent. Compare the bounded system with a two-step baseline using the
same held-out questions, corpus, quality criteria, and latency measurements.

### Evaluation rubric

One point each: support-based stop; hard/progress limits; generated-aid versus
evidence distinction; intent-preservation or baseline comparison.
