---
id: lesson-ai-agent-recovery
kind: lesson
topicId: ai-agents
title: Execution State, Memory, and Recoverable Tool Effects
summary: Separate authoritative run state from conversational memory, reconcile an unknown write outcome, and explain why checkpointing does not imply exactly-once effects.
difficulty: hard
status: published
revision: 1
order: 590
tags: [agents, recovery, memory, checkpoints, idempotency]
conceptIds: [concept-agent-recovery]
prerequisiteIds: [lesson-ai-agent-approval, lesson-ai-context-memory]
---

## Keep different kinds of state distinct

| State | Example | Acceptance rule |
| --- | --- | --- |
| Working execution state | Current node, remaining steps, pending call ID | Controller-owned, versioned, recoverable |
| Conversation memory | User preferences and prior discussion | Scoped, expiring/correctable; not execution proof |
| Evidence memory | Retrieved source IDs, revisions, observations | Provenance and current eligibility checks |
| Effect ledger | Operation intent, committed receipt, unknown outcome | Authoritative reconciliation with effect service |

A summary saying “refund completed” cannot substitute for a confirmed service
receipt. Long-term memory can contain stale or incorrect statements; loading it
does not make those statements authoritative. Isolate users and runs, and ensure
deletion/correction reaches both stored memory and caches.

```text
intent + stable operation ID → effect service → receipt
                 crash/timeout ↘ unknown → query/retry same ID → reconcile
checkpoint → restore controller state, not rewind external world
```

## Recover from success followed by a lost acknowledgment

```python
from copy import deepcopy

service_ledger = {}
def service_refund(operation_id, arguments, lose_ack=False):
    if operation_id in service_ledger:
        previous = service_ledger[operation_id]
        if previous['arguments'] != arguments:
            raise ValueError('idempotency key reused for different action')
        return previous['receipt']
    receipt = {'refund_id': 'refund-1', 'status': 'committed'}
    service_ledger[operation_id] = {'arguments': deepcopy(arguments), 'receipt': receipt}
    if lose_ack:
        raise TimeoutError('effect committed but response lost')
    return receipt

state = {'operation_id': 'op-1', 'status': 'intent',
         'arguments': {'order_id': 'order-7', 'amount_cents': 500}}
try:
    service_refund(state['operation_id'], state['arguments'], lose_ack=True)
except TimeoutError:
    state['status'] = 'unknown'
restored = deepcopy(state)  # Stand-in for restoring a persisted checkpoint.
assert restored['status'] == 'unknown'
receipt = service_refund(restored['operation_id'], restored['arguments'])
restored.update(status='completed', receipt=receipt)
assert len(service_ledger) == 1 and restored['receipt']['status'] == 'committed'
try:
    service_refund('op-1', {'order_id': 'order-7', 'amount_cents': 900})
except ValueError:
    pass
else:
    raise AssertionError('key reuse changed operation')
print('lost acknowledgment reconciled with one effect; changed-payload key reuse rejected')
```

The service ledger represents a service's atomic idempotent effect contract. This
single-process dictionary does not implement distributed concurrency, durable
storage, or retention. Real retry correctness depends on the external service's
key scope, payload rules, persistence, and retry window. If no such support exists,
use a status lookup, deduplication transaction, or explicit manual reconciliation;
do not infer failure from timeout and repeat a write blindly.

## Checkpoints preserve a recovery position

Persist state at meaningful boundaries with run/schema version, transition history,
pending action fingerprints, observation references, and receipts. Restore only
under an authorized identity. Multiple workers need ownership/lease or conditional
state updates so they cannot advance the same action concurrently.

A graph runtime can replay a node after a crash or interrupt. Pure calculations
can often be replayed safely; time, random choices, and remote results must be
recorded or isolated behind replay-aware operations. Side effects may happen again
unless their execution boundary deduplicates them. Neither a checkpoint nor an
at-least-once task runner guarantees exactly-once external effects.

## Use memory without making it the ledger

Keep compact conversational context for the model, while retaining authoritative
machine state outside a lossy summary. A concise observation can point to a larger
immutable result instead of copying every byte into each prompt. Enforce context
and result-size budgets; keep receipt IDs even if verbose tool text is compacted.

Test recovery before/after tool submission, after effect commit but before state
save, during approval, and on duplicate resume. Validate both outcome and trajectory:
did the run finish, were required constraints enforced, and how many effects actually
occurred? Detailed agent evaluation is a later topic; these failure traces make the
controller's recovery contract inspectable now.

## Recall

Which fields would you never reconstruct from a model-generated summary? Why is
retrying with a new operation ID unsafe after an unknown outcome? What can a
checkpoint restore, and what can it not undo?

## References

- [LangGraph: persistence and checkpointer versus store](https://docs.langchain.com/oss/python/langgraph/persistence)
- [LangGraph: replay and side effects around interrupts](https://docs.langchain.com/oss/python/langgraph/interrupts)
