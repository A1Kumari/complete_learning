---
id: lesson-end-to-end-ml-lifecycle
kind: lesson
topicId: ai-ml-introduction
title: The End-to-End ML Lifecycle
summary: Turn an ML idea into an operated system by covering problem formulation, data, training, validation, deployment, monitoring, and feedback.
difficulty: medium
status: published
revision: 1
order: 40
tags: [machine-learning, lifecycle, deployment, monitoring]
conceptIds: [concept-ml-lifecycle, concept-ml-monitoring, concept-ml-problem-formulation]
prerequisiteIds: [lesson-ai-and-ml-foundations, lesson-how-ml-systems-work, lesson-learning-paradigms]
anchors:
  lifecycle: The lifecycle is a loop
  worked-scenario: "Worked scenario: support-ticket routing"
  monitoring: 5. Monitor behavior and data
---

## The lifecycle is a loop

An ML project is not complete when a training script produces a model file. A useful
system connects a decision, data, model, product integration, and operations:

```text
problem and success criteria
          |
          v
data collection -> labeling / policy review -> train / validate
       ^                                      |
       |                                      v
       +-- monitoring <- deploy <- release checks
```

The arrows are iterative. Production failures can reveal a bad target definition,
missing data slice, distribution shift, or a product policy that the model cannot
solve. The right response may be a new label policy or a rule-based safeguard, not
another architecture search.

## 1. Formulate the decision

Start with the decision the system will support, not “we need AI.” Write down:

- **Actor:** who or what consumes the output?
- **Input:** what is available at decision time, and with what latency?
- **Output:** class, score, ranking, generated content, or action?
- **Ground truth:** what outcome represents success, and when is it observable?
- **Constraints:** latency, cost, privacy, explainability, safety, and human review?
- **Baseline:** could a rule, query, or simple model solve enough of the problem?

An output that looks impressive in a demo can be useless if it arrives after the
decision, uses unavailable future information, or cannot be audited. Formulation
also determines whether ML is necessary at all.

## 2. Collect and prepare data

Data collection should reflect the deployment population and the time at which
features will be available. Define label provenance, annotation guidance, missing
values, duplicate policy, privacy controls, and retention. Keep a record of dataset
versions and transformations so a model can be reproduced and investigated.

Avoid leakage. If a feature is created after a ticket is resolved, it cannot be an
input for a model intended to route the ticket when it arrives. If normalization
statistics are calculated using all data before splitting, information from the
validation or test partitions can influence training.

## 3. Train and validate honestly

Use training data to fit parameters, validation data to compare choices, and a test
set for a final estimate. The test set should not become a repeated tuning target.
For time-dependent data, a chronological split may be more realistic than random
shuffling. For users or documents with repeated records, group-aware splits can
prevent the same entity from appearing on both sides.

```text
training set:   fit parameters
validation set: choose model / features / thresholds
test set:       one final estimate on held-out data
production:     monitor real behavior and outcomes
```

Report slices, uncertainty where appropriate, error examples, and business costs;
one aggregate metric can hide a failure for a small but important population. A
model can score well on a test set that does not represent future traffic.

## Worked scenario: support-ticket routing

The team wants to route tickets to billing, access, or technical support.

1. **Formulate:** input is the ticket text and metadata available at creation;
   output is a route suggestion; a human can override it; success is correct route
   within the service-level target.
2. **Baseline:** keyword rules and a majority-class classifier establish whether
   an ML model adds value.
3. **Data:** use historical tickets, but define labels from the final expert route
   and inspect tickets reopened or transferred multiple times.
4. **Split:** group duplicates and use a time-aware holdout if ticket language and
   product versions change over time.
5. **Train:** fit a classifier and tune its threshold on validation data. Do not
   include the final destination team as an input if it was assigned after review.
6. **Release:** shadow the model first, log predictions and confidence, and keep a
   fallback route when confidence is low.
7. **Monitor:** measure route accuracy when labels arrive, abstention rate, latency,
   class distribution, missing-feature rate, and per-team error patterns.
8. **Feedback:** sample disagreements and low-confidence cases for labeling. Update
   the dataset and retrain only through a reviewed, versioned process.

## 4. Deploy the complete inference system

Deployment includes more than model weights. It includes preprocessing, feature
vocabularies, model version, runtime dependencies, threshold configuration, and
fallback behavior. Training-time preprocessing must match serving-time
preprocessing. A model that expects one-hot category indices but receives a new
mapping can silently produce nonsense.

Use staged release, shadow traffic, canaries, or human approval when the risk
justifies it. Add timeouts and resource limits. Record a correlation ID and model
version, but avoid logging sensitive inputs by default.

## 5. Monitor behavior and data

Monitor at least four layers:

| Layer | Questions |
| --- | --- |
| Service | Is inference available, within latency, and within cost budget? |
| Input | Are schemas, missingness, ranges, and feature distributions healthy? |
| Model | Are scores, confidence, abstentions, and errors changing? |
| Outcome | Are real labels, business outcomes, and fairness slices acceptable? |

Some labels arrive late, so outcome monitoring may need a delayed pipeline. Drift in
inputs is a signal to investigate, not proof that model quality has fallen. Stable
input distributions also do not prove the model is correct. Monitor slices and
sample actual errors.

## Feedback loops can help or harm

If a model routes tickets, the route affects which team responds and therefore which
future labels are observed. If only accepted recommendations are reviewed, the
dataset can become selective. A feedback loop should specify what is logged, which
cases are sampled for review, who can change labels, and how new versions are
compared.

## Misconceptions to retire

- **“A high test score means the product is ready.”** It says little about serving,
  latency, drift, feedback, policy, and unrepresented slices.
- **“Monitoring means uptime dashboards.”** Availability matters, but input quality,
  model behavior, and delayed outcomes matter too.
- **“Data drift proves model failure.”** It is a diagnostic signal; verify outcome
  quality and identify which changes matter.
- **“Retraining automatically fixes production problems.”** Retraining on biased or
  leaked feedback can preserve or amplify the failure.

## Active recall

1. What decision, target, and baseline would you define before selecting a model?
2. Why can a random split be misleading when one user contributes many examples?
3. Name one service metric, one input metric, one model metric, and one outcome
   metric for a production classifier.

## Sources

- [Google ML Crash Course: Dividing the Original Dataset](https://developers.google.com/machine-learning/crash-course/overfitting/dividing-datasets)
- [Google ML Crash Course: Production ML Systems](https://developers.google.com/machine-learning/crash-course/production-ml-systems)
- [Google ML Crash Course: Data Leakage and Overfitting](https://developers.google.com/machine-learning/crash-course/overfitting)
- [ML Test Score: A Rubric for ML Production Readiness](https://research.google/pubs/pub46555/)
