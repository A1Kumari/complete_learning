---
id: ai-llm-model-comparison
kind: question
topicId: ai-llm-fundamentals
lessonId: lesson-ai-llm-capabilities-limitations
prompt: Why might you reject a model with a higher aggregate accuracy for a production task?
difficulty: medium
status: published
revision: 1
order: 360
tags: [llm, evaluation, latency]
followUps:
  - What should cost per successful task include?
  - Which versions must be recorded for a reproducible comparison?
misconception: A general benchmark rank or one average metric does not establish product fitness.
---

## Answer

The candidate may fail a critical slice, latency constraint, cost budget, or reliability
requirement. Compare representative paired cases, important failure costs, tail latency,
and cost per accepted outcome, with uncertainty appropriate to sample size.

### Supporting reasoning

Include retries, tools, timeouts, and refusals rather than dropping failures. Record
model, prompt, decoding, context/retrieval, schema, and evaluation versions.

### Evaluation rubric

One point each: concrete nonaggregate constraint; slice/error-cost reasoning;
end-to-end measurements; reproducible configuration and held-out evidence.
