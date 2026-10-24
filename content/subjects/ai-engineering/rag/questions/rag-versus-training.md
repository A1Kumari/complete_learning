---
id: ai-rag-versus-training
kind: question
topicId: ai-rag
lessonId: lesson-ai-rag-pipeline
prompt: How does RAG differ from fine-tuning, and does a retrieval-backed answer require a vector database?
difficulty: easy
frequent: true
status: published
revision: 1
order: 1040
tags: [rag, architecture]
conceptIds: [concept-rag-pipeline]
followUps:
  - Can a fine-tuned model still benefit from retrieval?
  - What data must be included in a permission-sensitive answer cache key?
misconception: Supplying retrieved context does not update model weights, and vectors are only one retrieval option.
---

## Answer

RAG retrieves external evidence at request time and supplies it to generation.
Fine-tuning changes model parameters through training. They can be combined.
Retrieval can use lexical search, SQL, APIs, or vectors; no vector database is
required by the RAG concept.

### Supporting reasoning

Retrieval can expose current, attributable records without retraining for each
update. It still needs access, freshness, and evidence-use checks. Fine-tuning can
improve behavior without guaranteeing up-to-date source-grounded facts.

### Evaluation rubric

One point each: request-time evidence; parameter training distinction;
nonvector retrieval option; complementary use or freshness qualification.
