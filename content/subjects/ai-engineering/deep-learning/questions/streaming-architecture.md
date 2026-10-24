---
id: ai-streaming-architecture-choice
kind: question
topicId: ai-deep-learning
lessonId: lesson-ai-architecture-selection
prompt: How would you choose between a CNN, GRU, and Transformer for real-time telemetry or speech with a 50-ms chunk budget and 30-second dependencies?
difficulty: hard
frequent: true
status: published
revision: 1
order: 200
tags: [model-selection, streaming, latency]
conceptIds: [concept-architecture-tradeoffs, concept-recurrent-state, concept-receptive-field]
followUps:
  - How do recurrent-state memory and a full-history attention cache scale?
  - Does fast model execution rule out excessive lookahead latency?
misconception: A model family is only a candidate; its name does not establish latency, retained information, or quality.
---

## Answer

Define required outputs, history, causal/lookahead constraints, error costs, and target
hardware first. Compare a simple baseline, a causal temporal CNN with sufficient
receptive field, a GRU with persistent state, and causal/chunked attention with an
explicit cache budget. Test long-delay examples and measure end-to-end tail latency,
memory, and task quality on realistic streams.

### Supporting reasoning

A GRU compresses history into bounded state but may lose an important distant detail.
Full-history standard attention retains growing key/value storage and incurs
history-dependent work; cache eviction can remove relevant evidence. A CNN's receptive
field and buffering must cover the required history. Lookahead and chunk accumulation
add latency separately from compute. State resets and per-stream isolation must match
deployment.

### Evaluation rubric

- **1 point:** clarifies causal inputs, lookahead, and the 30-second requirement.
- **1 point:** compares state, receptive field, and cache rather than only accuracy.
- **1 point:** measures end-to-end p95/p99 latency and memory on target hardware.
- **1 point:** proposes a baseline and a realistic quality test that could change the choice.

Award no full score to an unconditional “always Transformer” or “always GRU.”

### Reference

[Worked speech budget](../lessons/architecture-selection.md#streaming-case).
