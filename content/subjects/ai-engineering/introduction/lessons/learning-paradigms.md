---
id: lesson-learning-paradigms
kind: lesson
topicId: ai-ml-introduction
title: Learning Paradigms
summary: Compare supervised, unsupervised, self-supervised, semi-supervised, and reinforcement learning by their data and feedback signals.
difficulty: medium
status: published
revision: 1
order: 30
tags: [machine-learning, supervised-learning, self-supervised-learning, reinforcement-learning]
conceptIds: [concept-learning-paradigms, concept-self-supervised-learning, concept-ml-problem-formulation]
prerequisiteIds: [lesson-ai-and-ml-foundations, lesson-how-ml-systems-work]
anchors:
  feedback-signals: Classify the feedback signal
  comparison: "Supervised learning: learn from answers"
  self-supervision: "Self-supervised learning: targets constructed from the input"
---

## Classify the feedback signal

The most useful first question is not “what algorithm is popular?” It is “what
feedback does the learner receive?”

| Paradigm | Typical data or feedback | Immediate target? | Example |
| --- | --- | --- | --- |
| Supervised | Inputs paired with labels | Yes, supplied or curated | Predict whether a ticket is billing-related |
| Unsupervised | Inputs without task labels | No prescribed target; discover structure | Cluster customers by behavior |
| Self-supervised | Inputs transformed into targets from themselves | Yes, constructed from data | Predict a masked token or next token |
| Semi-supervised | A small labeled set plus more unlabeled data | Some examples have labels | Classify rare medical images with limited annotation |
| Reinforcement | Actions, environment transitions, rewards | Reward may be delayed | Learn a policy for a robot or game |

These are learning setups, not mutually exclusive product categories. A system can
pretrain with a self-supervised objective, fine-tune with supervised examples, and
optimize a policy or preference objective later.

## Supervised learning: learn from answers

The dataset contains pairs `(x, y)`: input `x` and target `y`. Regression predicts
a numeric value, while classification predicts a category or score. Training finds
parameters that make predictions close to targets under a chosen loss.

```text
(ticket text, billing) ----\
(ticket text, account) -----> model training ---> parameters
(ticket text, access) -----/

new ticket ------------------> parameters ---> category or score
```

The label does not need to be a human's direct opinion, but its construction must be
understood. A “successful recommendation” label based only on clicks may encode
position bias; a “fraud” label may arrive after an investigation delay.

## Unsupervised learning: discover structure

Unsupervised learning starts without the target category the team wants to predict.
Clustering can group similar examples according to a distance or similarity measure.
Dimensionality reduction can produce a compact representation useful for
exploration. The algorithm can expose structure, but a cluster is not automatically
a meaningful business segment. Humans still need to inspect, name, and validate it.

For example, if customers are clustered by purchase frequency and average order
value, one cluster might be “frequent, low-value buyers.” That description is an
interpretation after clustering, not a label the algorithm was given.

## Self-supervised learning: targets constructed from the input

Self-supervised learning creates a prediction task from unlabeled data. A text
corpus can hide a token and ask the model to predict it, or provide a prefix and ask
for the next token. An image can be transformed and the model can predict a relation
between views. The supervision signal is generated from the data itself, not
necessarily annotated by a human.

```text
original sequence:   the cat sat on mat
constructed input:   the cat [MASK] on mat
constructed target:  sat
```

This is distinct from ordinary unsupervised clustering. Both can begin with
unlabeled data, but self-supervision defines an explicit predictive target and loss.
It is also distinct from supervised learning in provenance: the target is derived
from the original example rather than supplied as an external task label.

Large language model pretraining commonly uses a self-supervised next-token
objective. That objective teaches statistical regularities useful for later tasks;
it does not by itself prove that every generated statement is factual or that the
model has the desired instruction-following behavior.

## Semi-supervised learning: combine scarce labels with abundant data

Suppose a company has 500 reviewed support tickets and 500,000 unlabeled tickets.
A semi-supervised method can use both, under assumptions about how unlabeled
examples relate to the labeled task. Methods may use pseudo-labels, consistency
objectives, or representations learned from the unlabeled portion. Pseudo-labels
are predictions, not guaranteed ground truth; treating them as perfect labels can
amplify errors.

Semi-supervised learning is not simply “supervised learning with a larger dataset.”
The unlabeled examples contribute through a specific algorithmic assumption, and the
team must test whether that assumption holds.

## Reinforcement learning: act, observe, receive feedback

An agent observes a state, chooses an action, receives a reward and a next state,
and attempts to learn a policy. Rewards may be delayed, noisy, sparse, or shaped by
an imperfect objective.

```text
state s_t --> policy --> action a_t --> environment
   ^                                      |
   |------------ reward r_t, state s_(t+1)
```

The policy is not the same as a classifier label. It must balance exploration of
unknown actions with exploitation of known good actions. A reward function is also
not automatically a complete definition of what humans want: reward hacking can
produce high reward through an unintended shortcut.

## Worked application: document triage

Given a corpus of incoming documents, choose deliberately:

1. **Known categories and reviewed examples:** supervised classification.
2. **No labels, but a need to inspect themes:** unsupervised clustering.
3. **Millions of documents and a goal of learning text representations:**
   self-supervised pretraining, perhaps followed by supervised fine-tuning.
4. **Only a few reviewed documents and many raw documents:** semi-supervised
   learning may help if its assumptions are validated.
5. **A document-processing workflow that chooses actions and gets a delayed business
   outcome:** a reinforcement-learning formulation might be possible, but a simpler
   supervised or rule-based baseline may be more appropriate.

The same product can use multiple paradigms at different stages. Do not infer the
training setup from the user-facing feature alone.

## Misconceptions to retire

- **“Unlabeled means unsupervised.”** Self-supervised learning also starts with
  unlabeled raw data, but constructs a predictive target.
- **“Self-supervised means no loss or target exists.”** It has a target and objective;
  they are derived from the input.
- **“Reinforcement learning is supervised learning with rewards as labels.”** Rewards
  arrive from interaction and may be delayed; actions also change future states.
- **“More unlabeled data always helps semi-supervised learning.”** It helps only when
  the method's assumptions and data distribution are suitable.

## Active recall

1. For next-token prediction, where does the target come from?
2. Why is a cluster not automatically a business label?
3. For a warehouse robot with sparse delayed rewards, what information is missing
   from an ordinary supervised classification dataset?

## Sources

- [Stanford CS229: supervised, unsupervised, and reinforcement learning](https://cs229.stanford.edu/)
- [Google: What is Machine Learning?](https://developers.google.com/machine-learning/intro-to-ml/what-is-ml)
- [Google ML Crash Course: Intro to Large Language Models](https://developers.google.com/machine-learning/crash-course/llm)
- [Sutton and Barto, Reinforcement Learning: An Introduction](http://incompleteideas.net/book/the-book-2nd.html)
