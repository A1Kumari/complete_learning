---
id: ai-prompt-versioning-budget
kind: question
topicId: ai-prompt-engineering
lessonId: lesson-ai-prompt-templates
prompt: What should be versioned to reproduce prompt behavior, and why can naive truncation break the task?
difficulty: medium
status: published
revision: 1
order: 500
tags: [prompting, templates, context]
followUps:
  - Is a prompt-text version sufficient when a model alias changes?
  - What if an invoice total occurs only at the end of the document?
misconception: A request fitting the context window does not prove it retained the required evidence.
---

## Answer

Record instructions/examples, schema, model/configuration, decoding, and context
selection versions with evaluated inputs/outputs under appropriate privacy controls.
Truncation can remove the answer or essential constraints even while preserving valid syntax.

### Supporting reasoning

A changed model or retrieval policy can alter behavior with identical prompt text.
Count actual serialized tokens, reserve output space, and select context deliberately.

### Evaluation rubric

One point each: full configuration versioning; privacy-aware reproducibility;
concrete evidence-loss example; deliberate token/context budgeting.
