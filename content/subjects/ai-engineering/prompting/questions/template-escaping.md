---
id: ai-prompt-template-boundaries
kind: question
topicId: ai-prompt-engineering
lessonId: lesson-ai-prompt-templates
prompt: Does JSON-escaping a document in a prompt prevent prompt injection?
difficulty: medium
status: published
revision: 1
order: 490
tags: [prompting, templates, context]
followUps:
  - Why avoid user-controlled text in developer instructions?
  - Why allowlist trusted configuration such as locale?
misconception: Serialization safety and semantic instruction-following boundaries are separate concerns.
---

## Answer

JSON escaping prevents the value from breaking the JSON envelope's syntax. It does
not guarantee the model ignores malicious natural-language instructions inside that
value. Keep data separate, allowlist trusted options, and enforce permissions externally.

### Supporting reasoning

A valid JSON string can still contain “ignore previous instructions.” Server-side
authorization and accepted-output checks remain necessary.

### Evaluation rubric

One point each: escaping purpose; remaining semantic risk; channel/configuration
separation; independent application enforcement.
