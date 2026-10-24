---
id: lesson-ai-and-ml-foundations
kind: lesson
topicId: ai-ml-introduction
title: What Are AI, Machine Learning, and Deep Learning?
summary: Build precise working definitions for AI, machine learning, deep learning, and generative versus discriminative systems.
difficulty: easy
status: published
revision: 1
order: 10
tags: [ai, machine-learning, deep-learning, generative-ai]
conceptIds: [concept-ai-ml-dl, concept-ml-problem-formulation]
anchors:
  definitions: Start with the problem, not the buzzword
  worked-example: "Worked example: classify an unfamiliar product"
  misconceptions: Misconceptions to retire
---

## Start with the problem, not the buzzword

AI is a broad engineering goal: build systems that perform tasks associated with
capabilities such as perception, language use, planning, decision-making, or
generation. The label does not identify one algorithm, training method, or level of
reliability. A rules engine, a search system, and a neural network can all be called
AI systems in different contexts.

Machine learning (ML) is a family of methods in which a model learns a useful
relationship from data rather than having every decision explicitly written as a
rule. In the supervised case, examples contain inputs and target outputs. Training
uses those examples to choose parameter values; later inference applies the learned
parameters to new inputs.

Deep learning is ML built with models containing many learned layers, most commonly
neural networks. It is not a synonym for all ML: a linear model, decision tree, or
k-means model can be ML without being deep learning.

```text
Artificial intelligence
|-- rule-based and search systems
|-- machine learning
|   |-- classical models
|   `-- deep learning
`-- other approaches and combinations
```

These sets overlap in practice. A production assistant may combine retrieval,
rules, a neural language model, and human approval. Calling the whole product “AI”
does not tell you which component learned from data.

## Rules versus learned behavior

Consider email triage. A rule-based system might say:

```text
if sender_domain == "example.test" and subject contains "invoice":
    route to accounts-payable
else:
    route to general-inbox
```

The rule is inspectable and deterministic, but someone must anticipate the useful
signals and maintain exceptions. An ML classifier could receive message features
and labels such as `spam` or `not-spam`, then learn parameters that map features to
a score. It can discover combinations that were not manually enumerated, but it
also inherits defects in the data and needs evaluation and monitoring.

Neither approach is automatically superior. Rules are often preferable for a small,
stable, safety-critical policy. ML is useful when the mapping is difficult to state
as rules, examples are available, and some uncertainty is acceptable.

## Generative and discriminative tasks

The distinction is about the output task, not whether a model is “smart.” A
discriminative system estimates a decision or conditional prediction, such as:

```text
document -> probability(document is a contract) -> route / do not route
```

A generative system models how to produce new data or content, such as generating a
summary, image, or next token. A language model can generate text, but the complete
application may still use discriminative components for moderation, routing, or
classification.

| Task | Input | Output | Typical setup |
| --- | --- | --- | --- |
| Document classification | Document text | Category or score | Supervised discriminative |
| Customer clustering | Customer features | Groups discovered from data | Unsupervised |
| Text completion | Context tokens | New token sequence | Generative, often self-supervised pretraining |
| Fraud decision | Transaction features | Risk score and decision | Supervised discriminative |

“Generative” does not mean “truthful.” A generator produces likely-looking outputs
under its learned distribution; correctness requires task-specific checks and
ground truth where the application needs it.

## Worked example: classify an unfamiliar product

Suppose a support product reads a ticket and suggests a reply. Use this sequence:

1. **Input:** ticket text, account metadata, and perhaps retrieved policy documents.
2. **Output:** a draft reply plus an escalation decision.
3. **Learned component:** a language model may generate the draft; a separate
   classifier or rule may decide whether escalation is mandatory.
4. **Training signal:** historical replies, reviewed examples, preference judgments,
   or a constructed next-token objective. These signals are not interchangeable.
5. **Failure boundary:** the model can produce fluent but unsupported text, while a
   rule can enforce that high-severity tickets require a human.

The product is an AI system, but “AI” alone is not a sufficient technical design.
The useful description names the inputs, outputs, learned components, authority
boundaries, and evaluation method.

## Misconceptions to retire

- **“AI means a neural network.”** AI is a broad category; neural networks are one
  family of ML models.
- **“Deep learning is just ML with more data.”** Depth refers to model structure.
  More data can help, but architecture, objective, compute, and data quality also
  matter.
- **“Generative models understand or know facts.”** They can model patterns and
  produce useful text without guaranteeing grounded truth.
- **“If a rule is written by a developer, it is not AI.”** Rule-based systems have
  historically been included within AI; the important engineering question is what
  mechanism supplies the behavior.

## Active recall

Answer before looking back:

1. Give a case where a rule is safer than ML, and a case where ML is more practical.
2. Why is a spam classifier usually called discriminative while an LLM completion
   system is generative?
3. Does replacing a neural component with a hand-written policy make the whole
   product non-AI? Defend your answer with the product boundary.

## Sources

- [Stanford CS229: Machine Learning](https://cs229.stanford.edu/)
- [Google for Developers: What is Machine Learning?](https://developers.google.com/machine-learning/intro-to-ml/what-is-ml)
- [Russell and Norvig, Artificial Intelligence: A Modern Approach](https://aima.cs.berkeley.edu/)
