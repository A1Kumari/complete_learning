---
id: ai-rnn-gradient-flow
kind: question
topicId: ai-deep-learning
lessonId: lesson-ai-recurrent-networks
prompt: Why can gradients vanish or explode when training a recurrent model on long sequences?
difficulty: hard
frequent: true
status: published
revision: 1
order: 160
tags: [rnn, gradients, backpropagation]
conceptIds: [concept-recurrent-state, concept-gated-recurrence]
followUps:
  - Does gradient clipping fix vanishing gradients?
  - What trade-off does truncated backpropagation through time introduce?
misconception: Forward information loss and vanishing training gradients are related but are not the same phenomenon.
---

## Answer

Backpropagation through time multiplies local Jacobians across recurrent steps.
Products that contract strongly make distant gradients small; products that amplify
can make gradients unstable or huge. Behavior depends on recurrent parameters,
activations, and the trajectory, not just sequence length.

### Supporting reasoning

For `h_t=tanh(x_t+0.5*h_(t-1))`, the local derivative is
`0.5*(1-h_t^2)`, with magnitude at most 0.5. A 20-step path is therefore at most
`0.5**20 ≈ 9.54e-7`. Vector Jacobian products are more complex than this scalar
example. Clipping bounds large gradients but cannot recreate a vanished signal.
Truncated BPTT saves work while cutting gradient credit assignment beyond a window.

### Evaluation rubric

- **1 point:** names unrolling/BPTT and repeated derivative products.
- **1 point:** explains contraction and amplification with a concrete example.
- **1 point:** qualifies dependence on weights and nonlinearities.
- **1 point:** accurately describes clipping, truncation, or gated alternatives.

Do not give full credit to “long sequences run out of memory” as a gradient mechanism.

### Reference

[Gradient-flow explanation](../lessons/recurrent-networks.md#gradient-flow).
