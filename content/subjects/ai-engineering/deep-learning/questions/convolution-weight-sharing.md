---
id: ai-cnn-weight-sharing
kind: question
topicId: ai-deep-learning
lessonId: lesson-ai-convolutional-networks
prompt: What does weight sharing mean in convolution, and what assumption does it encode?
difficulty: medium
frequent: true
status: published
revision: 1
order: 130
tags: [cnn, parameter-sharing]
conceptIds: [concept-convolution, concept-architecture-tradeoffs]
followUps:
  - How many parameters does a 3-by-3 convolution from 3 to 16 channels have, including biases?
  - Does increasing image resolution change this layer's parameter count or activation memory?
misconception: Shared filters encourage translation equivariance; they do not guarantee that a complete CNN is invariant to all translations.
---

## Answer

One output channel reuses its filter weights at every spatial position. This assumes
that the same local pattern can be useful at different positions, reducing parameters
and encoding a locality/translation-related inductive bias. Different output channels
normally have different filters.

### Supporting reasoning

For an ordinary 3-to-16-channel 3 × 3 convolution, weights number
`3*3*3*16 = 432`, plus 16 biases, or **448** parameters. Spatial resolution changes
the number of activations and computations, not that count. A locally connected
layer without sharing would learn a separate set of weights at each location.
Grouped or depthwise convolutions change channel connectivity and the count.

### Evaluation rubric

- **1 point:** explains reuse across positions rather than merely “saves memory.”
- **1 point:** connects sharing and locality to a useful task assumption.
- **1 point:** calculates 448 parameters and distinguishes parameters from activations.
- **1 point:** qualifies equivariance versus invariance or grouped-channel exceptions.

An answer calling all output filters identical needs correction.

### Reference

[PyTorch Conv2d](https://docs.pytorch.org/docs/stable/generated/torch.nn.Conv2d.html)
and the [worked lesson](../lessons/convolutional-networks.md).
