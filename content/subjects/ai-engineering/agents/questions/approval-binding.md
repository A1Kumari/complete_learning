---
id: ai-agent-approval-binding
kind: question
topicId: ai-agents
lessonId: lesson-ai-agent-approval
prompt: A user approved a 500-cent refund, then the plan changes it to 900 cents before execution. Can the old approval authorize the new proposal?
difficulty: medium
status: published
revision: 1
order: 1140
tags: [agents, approval, action-identity]
conceptIds: [concept-agent-approval]
followUps:
  - Which other fields should an approval bind?
  - Is a publicly computable action hash proof that a reviewer approved it?
misconception: A general approval flag is not blanket permission for later modified actions.
---

## Answer

No. Approval should bind the exact action, including amount, target, operation ID,
identity/scope, and resource version, with expiry and reviewer authorization.
Changing a bound field invalidates the old decision and requires a decision for
the new proposal under the application's policy.

### Supporting reasoning

A hash identifies action content but does not authenticate approval. Store approval
in trusted server state or use an appropriately authenticated representation. The
executor must still check current permissions and business conditions.

### Evaluation rubric

One point each: invalidates modified action; concrete bound fields; authenticated
approval origin; independent execution checks.
