---
id: lesson-ai-agent-approval
kind: lesson
topicId: ai-agents
title: Bind Human Approval to a Concrete Action
summary: Pause before selected effects, bind decisions to action identity and resource revision, and invalidate approval when the proposal or permission changes.
difficulty: hard
status: published
revision: 1
order: 580
tags: [agents, approval, human-in-the-loop, state]
conceptIds: [concept-agent-approval]
prerequisiteIds: [lesson-ai-agent-tools]
---

## Approval is a scoped state transition

Some applications require confirmation before a particular write. Define that
policy explicitly rather than asking for confirmation on every read. The controller
stores the proposed action, shows its relevant details, waits for an authenticated
decision, then rechecks execution prerequisites. “Yes” without a bound proposal
cannot reliably distinguish the user's intended action from a later modified one.

```text
proposed → policy/ownership validation → waiting_for_approval
           → rejected / expired / cancelled
           → approved → revalidate current state → execute → receipt
```

Approval should cover operation ID, tool, exact arguments, resource/version,
requesting identity, and expiry. If an amount, recipient, or resource version changes,
obtain a decision for the changed proposal. Approval does not override authorization.

## Trace stale and modified decisions

This fixture stores approval records in a trusted in-memory server structure. Its
hash identifies action contents; it is **not** a signed bearer token and must not
be accepted as proof of approval from an untrusted client.

```python
from hashlib import sha256
import json

def fingerprint(action):
    payload = json.dumps(action, sort_keys=True, separators=(',', ':'))
    return sha256(payload.encode()).hexdigest()

action = {'operation_id': 'op-1', 'tenant': 'A', 'tool': 'refund',
          'order_id': 'order-7', 'amount_cents': 500, 'revision': 4}
grant = {'fingerprint': fingerprint(action), 'approver': 'operator-A',
         'expires_at': 100, 'decision': 'approve', 'used': False}

def gate(proposal, approval, now, current_revision, may_refund):
    if not may_refund:
        return 'denied'
    if proposal['revision'] != current_revision:
        return 'stale'
    if approval['decision'] != 'approve':
        return 'rejected'
    if approval['used'] or now >= approval['expires_at']:
        return 'expired_or_used'
    if (approval['approver'] != 'operator-A' or
            approval['fingerprint'] != fingerprint(proposal)):
        return 'mismatch'
    return 'ready'

assert gate(action, grant, 50, 4, True) == 'ready'
assert gate({**action, 'amount_cents': 900}, grant, 50, 4, True) == 'mismatch'
assert gate(action, grant, 100, 4, True) == 'expired_or_used'
assert gate(action, grant, 50, 5, True) == 'stale'
assert gate(action, grant, 50, 4, False) == 'denied'
assert gate(action, {**grant, 'decision': 'reject'}, 50, 4, True) == 'rejected'
print('exact approved action ready; modification, expiry, stale version, revocation, rejection stop')
```

The fixture assumes the authenticated server already established who may approve
for tenant A and validated the action schema. It only demonstrates decision binding,
not a complete refund service. Never trust model-generated `may_refund=True` or an
arbitrary client-provided approval object in a real executor.

## Commit the effect coherently

Once ready, execute through a resource-scoped conditional write and stable operation
ID. Reserve/consume the approval and record the resulting receipt under a strategy
that prevents concurrent double-use. A read-then-write version check in application
code alone races other workers; the effect boundary needs an atomic condition or
equivalent serialized transaction.

If the operation succeeds but acknowledgment is lost, mark the effect as unknown
until a receipt/idempotency lookup resolves it. Consuming a grant before a failed
write can strand a legitimate operation, while consuming it after an unprotected
write can permit duplicate execution. Coordinate approval, operation intent, and
effect recovery rather than treating a boolean flag as the whole workflow.

## Resume and cancellation are first-class paths

Persist enough state to show the exact pending action after a restart. Resume the
same run under an authorized session, not just any user who knows a thread ID.
Allow rejection, cancellation, and expiration to terminate cleanly. A framework's
interrupt mechanism can suspend execution, but the application still owns reviewer
identity, decision scope, current permissions, and effect semantics.

## Recall

Why does changing 500 cents to 900 cents invalidate the decision? What if the user
approved but lost permission before execution? Describe the difference between a
pending action, an approved action, and a confirmed completed action.

## References

- [LangGraph: interrupts, resumption, and replay behavior](https://docs.langchain.com/oss/python/langgraph/interrupts)
- [OpenAI Agents SDK: human-in-the-loop execution](https://openai.github.io/openai-agents-python/human_in_the_loop/)
