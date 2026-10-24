---
id: ai-rnn-state-update
kind: question
topicId: ai-deep-learning
lessonId: lesson-ai-recurrent-networks
prompt: What makes an RNN recurrent, and how does its hidden state differ from its parameters?
difficulty: medium
frequent: true
status: published
revision: 1
order: 150
tags: [rnn, inference, streaming]
conceptIds: [concept-recurrent-state]
followUps:
  - Trace h=tanh(x+0.5*h) for inputs [1,0,1] and initial state zero.
  - When should a streaming application reset hidden state?
misconception: Updating a hidden state during inference does not mean updating the learned recurrence weights.
---

## Answer

An RNN computes each state from the current input and previous state, using the same
learned weights at successive steps. The hidden state is a changing activation that
summarizes the observed prefix; the parameters define the update and normally stay
fixed during inference.

### Supporting reasoning

For `h_t = tanh(W_x*x_t + W_h*h_(t-1) + b)`, state links time steps rather than
just stacking independent feed-forward layers. The scalar trace rounds to 0.7616,
0.3634, and 0.8280. Carry state across chunks of one stream and reset at genuine
sequence boundaries; do not mix device/user states. A bidirectional RNN can also
use future context and is not automatically a zero-lookahead streaming model.

### Evaluation rubric

- **1 point:** specifies dependence on previous state and current input.
- **1 point:** explains parameter reuse and state/parameter distinction.
- **1 point:** traces the three states correctly or supplies correct shape reasoning.
- **1 point:** identifies a practical reset, isolation, or causality concern.

“An RNN remembers everything” is insufficient and incorrect as a guarantee.

### Reference

[PyTorch RNN](https://docs.pytorch.org/docs/stable/generated/torch.nn.RNN.html)
and the [state trace](../lessons/recurrent-networks.md#state-trace).
