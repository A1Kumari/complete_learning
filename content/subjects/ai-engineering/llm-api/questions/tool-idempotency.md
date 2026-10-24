---
id: ai-api-tool-idempotency
kind: question
topicId: ai-llm-api-integration
lessonId: lesson-ai-api-tool-calling
prompt: A refund tool succeeded but the model continuation timed out. Should the application issue the refund again?
difficulty: hard
status: published
revision: 1
order: 420
tags: [llm-api, tool-calling, idempotency]
followUps:
  - Is a model call_id automatically a durable business-operation identifier?
  - Where should deduplication be enforced?
misconception: Retrying the model conversation cannot by itself guarantee exactly-once business effects.
---

## Answer

Reconcile the durable refund operation record first. Reuse a business operation key
and enforce transactional deduplication at the service's side-effect boundary.
A continuation timeout does not undo a completed refund.

### Supporting reasoning

Regeneration can propose a new call ID for the same operation. Conversation correlation
and business idempotency are separate concerns. Preserve the completed result for
safe continuation or an explicit recovery response.

### Evaluation rubric

One point each: ambiguous completion recognized; durable operation ID; correct
deduplication boundary; separate conversation recovery from issuing the write.
