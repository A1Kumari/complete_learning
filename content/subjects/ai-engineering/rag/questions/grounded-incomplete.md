---
id: ai-rag-grounded-incomplete
kind: question
topicId: ai-rag
lessonId: lesson-ai-rag-grounding
prompt: Can a RAG answer be grounded but incomplete, or faithfully grounded in a source that is itself wrong?
difficulty: medium
status: published
revision: 1
order: 1070
tags: [rag, groundedness, completeness]
conceptIds: [concept-rag-grounding]
followUps:
  - Where would you look if retrieval contains the exception but the answer omits it?
  - Why is another model's approval not a complete grounding guarantee?
misconception: Faithfulness to selected evidence is not identical to completeness or universal factual truth.
---

## Answer

Yes. “Returns last 30 days” can be supported while omitting the relevant final-sale
exception. An answer can also accurately repeat an erroneous source. Evaluate claim
support, required coverage, and source authority/correctness separately.

### Supporting reasoning

Inspect packing and generation when needed evidence was retrieved but unused.
Conflicting or stale sources need authority and effective-time rules, not averaging
or blind repetition. Model judges need calibration against independent review.

### Evaluation rubric

One point each: supported-but-incomplete example; source-error distinction;
separate acceptance dimensions; concrete failure diagnosis.
