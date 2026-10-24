---
id: lesson-ai-architecture-selection
kind: lesson
topicId: ai-deep-learning
title: Choosing Architectures Through Engineering Trade-offs
summary: Compare CNNs, recurrent models, and Transformers using dependence structure, realistic latency and state budgets, baselines, and evaluation evidence.
difficulty: medium
status: published
revision: 1
order: 100
tags: [deep-learning, model-selection, streaming, engineering-tradeoffs]
conceptIds: [concept-architecture-tradeoffs, concept-convolution, concept-recurrent-state, concept-encoder-decoder]
prerequisiteIds: [lesson-ai-convolutional-networks, lesson-ai-recurrent-networks, lesson-ai-encoder-decoder]
anchors:
  comparison: Compare mechanisms rather than brand names
  streaming-case: Work through a streaming speech budget
---

## Start with what must be predicted

Architectures encode assumptions about which observations should interact and how
information moves. Choosing one is a hypothesis about the task, data, and hardware.
You should leave this lesson able to justify candidates, calculate a simple
state/context budget, and design a comparison that could prove your choice wrong.

Ask what the output is, when it must arrive, which inputs are available, how much
history matters, and what failure costs. A label, a per-pixel defect map, and an
open-ended explanation are different tasks even if they share inputs. Architecture
selection also depends on pretrained checkpoints, training data and labels, runtime
support, and operational complexity.

## Compare mechanisms rather than brand names

| Property | CNN | RNN / GRU / LSTM | Standard attention-based Transformer |
| --- | --- | --- | --- |
| Structural bias | Local patterns and shared filters | Ordered updates through recurrent state | Content-dependent token interactions with positional information |
| Distant information | Receptive fields grow through layers, strides, or dilation | Traverses the recurrent state path | Direct interactions within the permitted attention pattern |
| Full-sequence training | Convolutions often parallelize across positions | State updates depend on preceding steps | Known training prefixes can be processed across positions with masking |
| Streaming inference | Causal temporal models can retain bounded history | Natural per-stream state update | Causal attention can use a KV cache; standard full-history caches grow |
| Important limit | Resolution loss and insufficient receptive field | State bottleneck, gradient paths, sequential updates | Long-context compute, cache capacity, and context utilization |

These are tendencies, not universal rankings. Temporal convolutions, efficient
attention, and hybrid models blur the boundaries. A Transformer is attention **plus**
feed-forward transformations, positional information, normalization, residual
connections, and a particular connectivity design—not merely an attention matrix.

## Why attention changed sequence modeling

In an RNN, information from token 1 reaches token 100 through repeated state
updates. Full self-attention lets token 100 read a weighted combination of permitted
token representations in one layer. This shortens paths between positions. With a
known target sequence in teacher-forced training, a causal mask allows parallel
calculation across positions while preventing access to future targets.

This does not make autoregressive generation parallel across unknown future tokens.
The next input token depends on the generated previous token. Nor does a direct
attention path guarantee successful long-range recall. Training, positional design,
attention patterns, and evaluation matter.

For length `n` and width `d`, standard full-attention score/value interactions cost
roughly `O(n²*d)`, excluding projections and feed-forward layers. A naive
implementation materializes `n*n` scores per head; optimized implementations can
avoid storing that whole matrix without eliminating all quadratic arithmetic.
Sparse, local, or other attention variants change the trade-offs. More parallelism
is not the same as lower cost on every workload.

## Worked case: a customer-support platform

The authored module's three workloads need different experiments:

1. **Image-based product damage detection:** start with a pretrained vision/CNN
   encoder. If the output is a defect location rather than a whole-image class,
   use a detection or segmentation head. Measure small-defect recall at a chosen
   false-alarm rate, memory, and mobile-device latency. Control lighting and camera
   differences in the evaluation set.
2. **Streaming IoT anomaly alerts:** compare a statistical/feature baseline, a causal
   1D CNN, and a GRU. Define sampling rate, required history, state reset policy,
   and delayed-label availability. Split by device/time to reduce leakage from
   nearly identical neighboring windows.
3. **Natural-language ticket categorization:** establish a TF-IDF plus logistic
   regression baseline before a pretrained encoder or LLM classifier. Evaluate
   class imbalance, language slices, cost, privacy, and latency. A high-capacity
   generator is not required just because the input is text.

Keep data, metrics, and acceptable error thresholds consistent across candidates.
Use validation data for selection and a held-out evaluation for the final estimate.
Compare several runs if training randomness is material, and inspect error examples
rather than selecting from aggregate scores alone.

## Work through a streaming speech budget

Requirement: each chunk has a 50-ms processing budget, and a prediction may depend
on evidence from 30 seconds earlier. Assume feature extraction produces **50 frames
per second**, and for this illustration **one frame becomes one token**. This is a
budgeting assumption, not a universal speech tokenizer.

Thirty seconds corresponds to `30*50 = 1,500` tokens. With a simplified standard
cache storing both keys and values at width 256, 6 layers, and 2 bytes per element:

```text
KV bytes = 2 * layers * tokens * width * bytes_per_element
         = 2 * 6 * 1500 * 256 * 2
         = 9,216,000 bytes ≈ 8.79 MiB per stream
```

For an ordinary LSTM with 6 layers and width 256, persistent hidden **and** cell
states would take `2*6*256*2 = 6,144` bytes, or 6 KiB. A comparably shaped GRU has
one persistent state per layer. These counts exclude parameters, intermediate
activations, preprocessing buffers, runtime workspace, and all serving overhead.
Grouped-query attention and reduced cache precision can change the KV formula.
Fixed recurrent-state size also does not guarantee retention of a detail 1,500
steps ago.

```python
frames_per_second, seconds = 50, 30
layers, width, bytes_per_element = 6, 256, 2
tokens = frames_per_second * seconds
kv_bytes = 2 * layers * tokens * width * bytes_per_element
lstm_bytes = 2 * layers * width * bytes_per_element
assert tokens == 1500 and kv_bytes == 9_216_000
assert lstm_bytes == 6144
print("tokens:", tokens)
print("KV MiB:", round(kv_bytes / (1024 ** 2), 2))
print("LSTM KiB:", lstm_bytes / 1024)
```

Expected output: 1,500 tokens, 8.79 MiB KV storage, and 6.0 KiB LSTM state.
This is arithmetic, not a latency benchmark or an assertion of equal quality.

An illustrative end-to-end chunk budget might allocate 8 ms to feature extraction,
28 ms to model execution, 4 ms to postprocessing, and 10 ms to scheduling/transport.
That totals 50 ms with no spare capacity. Measure tail latency under real concurrent
load; averages alone can hide failures. Buffering future audio adds **algorithmic
lookahead latency** even if the model executes quickly. Clarify whether the product's
50-ms promise includes capture, chunk accumulation, networking, and lookahead.

Candidate comparisons should therefore include:

- an LSTM/GRU with persistent per-stream state and realistic resets;
- a causal temporal CNN with an explicit receptive-field/history budget;
- a causal/chunked Transformer with bounded cache and a documented eviction policy.

Test whether each can use the long-delay cue, not just recognize isolated chunks.
A cache eviction that removes required evidence is a quality decision, not a free
memory optimization. Select the least costly system that meets the measured quality
and latency requirements; do not name a winner from the architecture family alone.

## A repeatable decision process

1. Define the output, labels, error costs, quality metric, and operating threshold.
2. Record modality, sequence length, sampling rate, and expected dependencies.
3. Establish a rule, statistical, or classical-model baseline where appropriate.
4. Choose a small set of candidates with a reason for each inductive bias.
5. Fix the data split and preprocessing; prevent future or duplicate information
   from leaking into the features or evaluation.
6. Measure quality by important slices and realistic failure conditions.
7. Benchmark end-to-end latency, throughput, memory, and energy/cost on target hardware.
8. Inspect errors and deployment complexity, then choose and document the trade-off.

For security and interpretability, evaluate the complete system: switching from a
CNN to an LLM does not enforce access controls or make explanations reliable.

## Interview exercise and self-marking

Answer the 50-ms speech question without naming a model in your first sentence.
Then explain what you would measure and which two candidates you would compare.

Award yourself one point for each: (1) causal inputs and lookahead; (2) 30-second
dependency; (3) recurrent state versus KV cache; (4) hardware and tail latency;
(5) realistic quality benchmark; (6) a baseline and a condition that would change
your choice. A slogan such as “Transformers are always better” earns none of these.

## Synthesis and verified references

CNN: local filters and weight sharing. RNN: recurrent state and sequential updates.
Encoder: representation role. Decoder: output/reconstruction role. Transformer:
attention-based connectivity with additional architectural components. Match these
mechanisms to data and constraints, then verify experimentally.

- [Vaswani et al., Attention Is All You Need, sections 3–4](https://arxiv.org/html/1706.03762v7): full-sequence parallelism, interaction paths, and complexity comparisons.
- [PyTorch RNN reference](https://docs.pytorch.org/docs/stable/generated/torch.nn.RNN.html): recurrent hidden states and sequence/batch conventions.
- [PyTorch LSTM reference](https://docs.pytorch.org/docs/stable/generated/torch.nn.LSTM.html): distinct hidden and cell states.
- [Stanford CS231n](https://cs231n.github.io/convolutional-networks/): local filters, receptive fields, spatial-resolution trade-offs.

Detailed Transformer lessons are the next roadmap topic and will be authored only
after this module's review.
