---
id: ai-rag-evidence-packing
kind: question
topicId: ai-rag
lessonId: lesson-ai-rag-pipeline
prompt: Retrieval found a relevant document, but no source text fit into the model request. What should the RAG pipeline report and inspect?
difficulty: medium
status: published
revision: 1
order: 1050
tags: [rag, context-budget, abstention]
conceptIds: [concept-rag-pipeline]
followUps:
  - Which overhead besides source text belongs in the budget?
  - Does no-evidence prove the corpus has no relevant source?
misconception: A retrieved candidate is not necessarily evidence actually delivered to the generator.
---

## Answer

Return an explicit insufficient/no-evidence outcome or use a declared refinement
path. Inspect request overhead, chunk size, duplicates, reserved output capacity,
and the actual model tokenizer. Do not accept an unsupported answer simply because
retrieval succeeded upstream.

### Supporting reasoning

Instructions, history, tool schemas, source labels, and the user's question consume
input capacity. A no-evidence result can arise from packing or retrieval failure,
so it does not establish corpus absence.

### Evaluation rubric

One point each: explicit insufficiency; delivered-versus-retrieved distinction;
full-request budget; tokenizer or diagnostic-stage qualification.
