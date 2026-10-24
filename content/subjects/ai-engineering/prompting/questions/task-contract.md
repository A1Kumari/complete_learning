---
id: ai-prompt-task-contract
kind: question
topicId: ai-prompt-engineering
lessonId: lesson-ai-prompt-instruction-design
prompt: How would you repair an ambiguous invoice-extraction prompt?
difficulty: medium
status: published
revision: 1
order: 450
tags: [prompting, instructions]
followUps:
  - How do you distinguish total from subtotal?
  - What should happen when currency is absent?
misconception: A role description such as expert does not substitute for field definitions and evidence rules.
---

## Answer

Specify the extraction objective, source-only evidence, final-total definition,
units/currency, missing-value policy, and output contract. Use null or another
declared abstention path rather than demanding a guessed value.

### Supporting reasoning

Resolve conflicting requirements such as “always output a number” and “never guess.”
Validate structure and source support after generation; test ambiguous/missing cases.

### Evaluation rubric

One point each: explicit task/fields; evidence scope; coherent exception policy;
checkable output and representative evaluation cases.
