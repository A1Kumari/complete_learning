---
id: ai-gated-recurrent-memory
kind: question
topicId: ai-deep-learning
lessonId: lesson-ai-recurrent-networks
prompt: Why do LSTMs use gates, and what limits remain compared with a vanilla RNN?
difficulty: medium
frequent: true
status: published
revision: 1
order: 170
tags: [rnn, lstm, gru]
conceptIds: [concept-gated-recurrence]
followUps:
  - Calculate the new cell for old cell 2, forget gate 0.9, input gate 0.2, and candidate 0.5.
  - How is a GRU's state organization different?
misconception: Gated recurrence improves selective retention and gradient flow but does not guarantee unlimited memory or parallel updates across time.
---

## Answer

LSTM gates control retention, writing, and exposure of cell content. An additive
cell-state path can preserve useful information and learning signals more easily
than repeated vanilla tanh updates. LSTMs still have finite state, learned retention
behavior, and sequential dependencies; gates do not solve every long-range task.

### Supporting reasoning

In a common modern LSTM, `c_t = f_t ⊙ c_(t-1) + i_t ⊙ g_t` and
`h_t = o_t ⊙ tanh(c_t)`. The example gives `c_t=1.9`. Gates are learned sigmoid
outputs, not fixed human-selected switches. A GRU has a single hidden state and
reset/update gating rather than a separate LSTM cell. Gate conventions and runtime
performance vary, so compare implementations and actual workloads.

### Evaluation rubric

- **1 point:** names retention, writing, and output control.
- **1 point:** explains the additive cell path or computes the example.
- **1 point:** distinguishes LSTM cell/hidden state from GRU state.
- **1 point:** states a remaining limit without promising infinite memory.

### Reference

[PyTorch LSTM](https://docs.pytorch.org/docs/stable/generated/torch.nn.LSTM.html)
and the [gate worked example](../lessons/recurrent-networks.md#gates).
