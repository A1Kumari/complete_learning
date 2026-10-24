---
id: ai-prompt-instruction-authority
kind: question
topicId: ai-prompt-engineering
lessonId: lesson-ai-prompt-instruction-design
prompt: How should application instructions and retrieved document text differ in a prompt?
difficulty: medium
status: published
revision: 1
order: 460
tags: [prompting, context, authorization]
followUps:
  - Do delimiters make prompt injection impossible?
  - Where must access permissions be enforced?
misconception: Untrusted document content does not gain developer authority merely by appearing in context.
---

## Answer

Place application requirements in the provider's intended high-authority channel and
identify retrieved text as data/evidence. Do not promote document instructions into
application rules. Enforce access and tool permissions in server code.

### Supporting reasoning

Role separation and delimiters help communicate boundaries but do not form a secure
sandbox. Validate output and actions even when the prompt requests good behavior.

### Evaluation rubric

One point each: authority/data distinction; appropriate request channels;
delimiter limitation; application-owned authorization.
