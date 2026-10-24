---
id: ai-cnn-convolution-trace
kind: question
topicId: ai-deep-learning
lessonId: lesson-ai-convolutional-networks
prompt: "Trace a convolution for X=[[1,1,4],[2,2,5],[3,3,6]], K=[[-1,1],[-1,1]], stride 1, no padding, and zero bias."
difficulty: medium
frequent: true
status: published
revision: 1
order: 140
tags: [cnn, tensor-shapes, worked-example]
conceptIds: [concept-convolution, concept-receptive-field]
followUps:
  - What output size comes from a 5-by-5 input, kernel 3, stride 2, padding 1, and dilation 1?
  - What changes when dilation is 2 instead of 1?
misconception: Library convolution usually means cross-correlation without reversing the filter; state the convention before calculating.
---

## Answer

The output is `[[0,6],[0,6]]`. Each output is the sum of elementwise patch/filter
products. At top-left: `-1*1 + 1*1 - 1*2 + 1*2 = 0`. At top-right:
`-1*1 + 1*4 - 1*2 + 1*5 = 6`. The lower two windows give 0 and 6 as well.

### Supporting reasoning

There are two valid positions along each axis, producing a 2 × 2 feature map.
For a general axis, effective kernel size is `d*(k-1)+1`, and output size is
`floor((input + 2*p - effective_kernel)/s)+1`. The follow-up gives 3 × 3 outputs
with dilation 1; dilation 2 makes the effective kernel 5 and gives 2 × 2 outputs.
No learning occurs in this fixed-filter calculation.

### Evaluation rubric

- **1 point:** identifies cross-correlation, stride, and zero-bias assumptions.
- **1 point:** shows at least two correct multiply-and-sum calculations.
- **1 point:** gives all four outputs and the 2 × 2 shape.
- **1 point:** handles the shape follow-ups, including floor and effective dilation.

Reject a result based on multiplying the whole 3 × 3 input by a 2 × 2 kernel at once.

### Reference

[Shape and execution trace](../lessons/convolutional-networks.md#convolution-trace).
