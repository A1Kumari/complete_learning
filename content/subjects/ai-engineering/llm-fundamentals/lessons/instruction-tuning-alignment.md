---
id: lesson-ai-instruction-tuning-alignment
kind: lesson
topicId: ai-llm-fundamentals
title: Instruction Tuning and Preference Alignment
summary: Compare pretraining, supervised fine-tuning, reward-model RLHF, and DPO using data formats, objectives, and realistic limitations.
difficulty: medium
status: published
revision: 1
order: 140
tags: [llm, fine-tuning, alignment, dpo]
conceptIds: [concept-language-modeling, concept-preference-optimization]
prerequisiteIds: [lesson-ai-language-model-pretraining]
---

## Why continuation is not the whole product

A pretrained model predicts continuations, but an assistant must also respond to
instructions, use a requested format, acknowledge missing information, and follow
the application's behavior requirements. Post-training adapts that behavior.
It does not turn a probabilistic generator into a guaranteed source of truth.

```text
corpus → predictive pretraining → base parameters
                                   ↓ curated demonstrations
                              supervised fine-tuning
                                   ↓ preference optimization (possible stage)
                              deployed assistant
```

This is a common conceptual sequence, not a mandatory recipe for every provider.
Methods can be combined, repeated, or augmented with other objectives.

## Supervised fine-tuning

SFT uses examples such as an instruction, context, and a desired response. The
objective commonly increases the probability of reference response tokens.
Implementations may mask prompt tokens so that loss is computed on assistant
responses only. The format and masking matter: training on the wrong role or on
private input fields can teach undesirable behavior or expose data.

For “extract invoice currency,” a demonstration could map “Total EUR 12” to
`{"currency":"EUR"}`. That teaches a mapping and format; it does not ensure the
same behavior on an unfamiliar invoice layout. Reserve held-out vendors, languages,
and missing-value cases for evaluation.

## Preference data and reward-model RLHF

Preference examples compare two or more answers to the same prompt. In a common
RLHF pipeline, annotators rank answers, a reward model learns those rankings, and
a policy optimizer updates the language model to increase estimated reward while
constraining departure from a reference policy, often with a KL-related penalty.
The reward model is a proxy for annotator judgments, not an oracle for truth.

If annotators systematically prefer confident longer answers, optimization can
reward verbosity or confidence even when content is unsupported. Ranking guidance,
annotator disagreement, task slices, and adversarial evaluation are substantive
parts of the method, not administrative details.

## DPO intuition with a numerical comparison

Direct Preference Optimization uses chosen/rejected pairs to optimize a
classification-like preference objective relative to a reference model. It avoids
the separate reward-model-plus-online-RL loop of that common RLHF recipe.

An illustrative DPO margin is:

```text
margin = beta * ((log pi(chosen) - log pi_ref(chosen))
              - (log pi(rejected) - log pi_ref(rejected)))
loss = -log(sigmoid(margin))
```

Here `pi` is the policy, `pi_ref` a fixed reference, and log probabilities are for
responses conditioned on the same prompt. Larger positive margins favor the chosen
answer relative to the reference. Sequence length handling and implementation
variants need careful inspection in real training.

```python
import math

def preference_loss(chosen_logp, rejected_logp, chosen_ref, rejected_ref, beta):
    margin = beta * ((chosen_logp - chosen_ref) - (rejected_logp - rejected_ref))
    # Stable log(1 + exp(-margin)).
    return max(0., -margin) + math.log1p(math.exp(-abs(margin)))

baseline = preference_loss(-2., -3., -2., -3., 1.)
improved = preference_loss(-1.5, -3.5, -2., -3., 1.)
assert math.isclose(baseline, math.log(2))
assert improved < baseline
print(round(baseline, 4), round(improved, 4))
```

Expected losses: `0.6931 0.3133`. These supplied log probabilities illustrate the
objective; the code does not train a language model or prove the chosen answer right.

## Choose intervention from failure evidence

Use clearer prompts for underspecified instructions, retrieval for missing/current
evidence, SFT for repeatable task behavior with suitable demonstrations, and
preference optimization when well-defined comparative judgments address the actual
failure. None removes the need for held-out evaluation. Post-training may also
trade off capabilities or overfit narrow formats.

**Misconceptions:** DPO is not simply “RLHF without data”; it needs preference
information. SFT is not the same objective as broad pretraining, even when both use
token cross-entropy. Alignment is not universal agreement with every user request.
Inference-time examples usually change context rather than weights.

## Recall

Describe the datasets for pretraining, SFT, and preference optimization. Identify
which of those has external response judgments. Then explain why optimizing a
preference score can increase confidence without improving factual accuracy.

## Verified references

- [Rafailov et al., Direct Preference Optimization](https://arxiv.org/abs/2305.18290)
- [Ouyang et al., Training language models to follow instructions with human feedback](https://arxiv.org/abs/2203.02155)
