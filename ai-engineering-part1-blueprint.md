# AI Engineering — Part 1: Content Blueprint

> **Status:** Research-derived, provisional lesson inventory; not completed educational lessons or interview questions. This reference is for authoring and review, **not** an active curriculum catalog. Preserve existing topic IDs in the repository.

**Audience:** Python backend and AI application engineers preparing for technical interviews and production AI work, not primarily ML researchers.

**Scope:** 12 topics, 51 proposed lessons. The source initially mentioned 47 lessons before expanding Prompt Engineering to four lessons; **51 is the final proposed total**. Lesson boundaries may change after review.

## 1. Proposed learning order

1. AI & Machine Learning Introduction
2. Math for AI
3. Classical Machine Learning
4. Training Fundamentals
5. Model Evaluation
6. Neural Networks
7. Deep Learning Architectures
8. Transformers
9. Tokenization & Embeddings
10. LLM Fundamentals
11. LLM API Integration
12. Prompt Engineering

Training Fundamentals is intentionally before Model Evaluation in this learning sequence. This is not a strict dependency chain: tokenization basics can appear before Transformers, and prompting can begin once model requests are understood.

## 2. Content depth standards

For these 12 topics, I recommend three levels of treatment.

| Depth        | What it means                                               | Examples                                                         |
| ------------ | ----------------------------------------------------------- | ---------------------------------------------------------------- |
| Understand   | Explain mechanisms, assumptions, trade-offs and limitations | CNNs, RNNs, preference optimization                              |
| Work through | Calculate or trace the underlying mechanism                 | Precision/recall, gradient descent, attention scores             |
| Implement    | Write a small working example in Python                     | Linear regression, training loops, API calls, streamed responses |

Implementation-level mastery does not mean recreating industrial-scale AI libraries. It means implementing enough of a mechanism to understand its behavior and failure modes.

We'll also use four lesson-design annotations below: M for mathematics or derivation, P for Python implementation, V for a useful visualization, and T for a worked execution trace.

## 3. Detailed lesson inventory

## Topic 1 — AI & Machine Learning Introduction

Priority: Essential · No AI prerequisites

Scope: Establish how machine learning differs from conventional programming, which learning paradigms exist, and what training and inference actually involve.

| Lesson                                                   | Core coverage                                                                                                  | Depth / teaching    |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------- |
| AI-01. What Are AI, Machine Learning, and Deep Learning? | Definitions, relationships, rule-based systems versus learned behavior, generative versus discriminative tasks | Understand · V      |
| AI-02. How Machine Learning Systems Work                 | Data, features, labels, targets, predictions, model parameters, objectives, training, inference                | Work through · V, T |
| AI-03. Learning Paradigms                                | Supervised, unsupervised, self-supervised, semi-supervised, reinforcement learning                             | Understand · V      |
| AI-04. The End-to-End ML Lifecycle                       | Problem formulation, data collection, training, validation, deployment, monitoring, feedback loops             | Understand · V      |

Key distinctions: Self-supervised learning constructs predictive targets from the data itself; it is not simply unsupervised learning with another name. Training changes learned parameters, while inference normally uses existing parameters. Hyperparameters are selected or configured externally to the ordinary parameter-learning process.

Application: Identify whether document classification, clustering customer behavior, and LLM pretraining require the same kind of training setup.

Assessment direction: Given an unfamiliar AI product, identify its learning problem, inputs, outputs, available labels, and whether ML is even necessary.

Reference: [Stanford CS229](https://cs229.stanford.edu/).

## Topic 2 — Math for AI

Priority: Essential foundations, selected advanced material deferred

This topic should teach the minimum mathematics needed to meaningfully understand model training, vector representations, attention, and evaluation.

| Lesson                                        | Core coverage                                                                          | Depth / teaching       |
| --------------------------------------------- | -------------------------------------------------------------------------------------- | ---------------------- |
| AI-05. Vectors and Vector Operations          | Scalars, vectors, dimensions, dot products, norms, cosine similarity                   | Work through · M, P, V |
| AI-06. Matrices and Tensor Shapes             | Matrix multiplication, transpose, broadcasting, tensors, dimensions in neural networks | Work through · M, P, V |
| AI-07. Probability for Machine Learning       | Conditional probability, Bayes' rule, independence, distributions, expectation         | Work through · M, V    |
| AI-08. Statistics and Data Distributions      | Mean, variance, standard deviation, sampling, uncertainty, outliers                    | Work through · M, P, V |
| AI-09. Derivatives, Gradients, and Chain Rule | Rates of change, partial derivatives, gradient vectors, multivariable functions        | Work through · M, V    |
| AI-10. Optimization and Gradient Descent      | Objective functions, gradients, learning rates, iterative optimization, local behavior | Implement · M, P, V, T |

Important prerequisites: basic Python, arithmetic, algebra, and functions.

Mathematics boundary: Derive a small gradient descent update and chain-rule example, but defer eigenvalue theory, full matrix calculus, and detailed optimization convergence proofs.

Assessment direction: Compute cosine similarity between vectors, identify matrix shape errors, interpret conditional probabilities, and manually perform two gradient descent updates.

Source: [Stanford CS229 mathematical refreshers](https://stanford.edu/~shervine/teaching/cs-229/).&#x20;

+1


## Topic 3 — Classical Machine Learning

Priority: Essential conceptual coverage; selective implementation

| Lesson                                      | Core coverage                                                                                   | Depth / teaching       |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------- | ---------------------- |
| AI-11. Regression and Prediction            | Linear regression, feature coefficients, residuals, mean squared error, nonlinear relationships | Implement · M, P, V    |
| AI-12. Classification Models                | Logistic regression, sigmoid, probabilities, thresholds, decision boundaries                    | Work through · M, P, V |
| AI-13. Instance-Based Learning              | k-nearest neighbors, distance metrics, feature scaling, prediction costs                        | Implement · P, V       |
| AI-14. Decision Trees and Ensembles         | Decision splits, impurity intuition, overfitting, random forests, gradient boosting             | Work through · V       |
| AI-15. Unsupervised Learning                | k-means, clustering objectives, dimensionality reduction, PCA intuition                         | Work through · M, P, V |
| AI-16. Choosing a Machine Learning Approach | Baselines, interpretability, data volume, feature engineering, computational cost               | Understand · Scenario  |

Prerequisites: AI-01–AI-10.

The regression lesson should include a small NumPy implementation. We do not need learners to implement a production-quality random forest or boosting library.

Cover why the sigmoid output of logistic regression is not automatically a well-calibrated probability, why k-means requires choosing assumptions about cluster structure, and why feature scale matters for some models much more than others.

Practical application: Choose a classification or regression baseline before deciding that a deep model or LLM is necessary.

Reference: [scikit-learn User Guide](https://scikit-learn.org/stable/user_guide.html).

## Topic 4 — Training Fundamentals

Priority: Essential

| Lesson                                       | Core coverage                                                                                               | Depth / teaching       |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------- |
| AI-17. Datasets and Data Preparation         | Examples, features, labels, preprocessing, encoding, normalization, representative data                     | Work through · P       |
| AI-18. Training, Validation, and Test Splits | Holdouts, cross-validation, temporal splits, grouped data, evaluation boundaries                            | Work through · P, V    |
| AI-19. Loss Functions and Model Optimization | Regression/classification losses, parameters vs hyperparameters, optimizers, batches, epochs, learning rate | Work through · M, P, T |
| AI-20. Generalization and Overfitting        | Underfitting, bias-variance intuition, regularization, early stopping, training curves                      | Work through · V       |
| AI-21. Data Leakage and Dataset Shift        | Target leakage, preprocessing leakage, duplicate samples, distribution shift, training-serving skew         | Apply · P, Scenario    |

Prerequisites: AI-01–AI-16, though model-specific examples can be learned in parallel with Classical ML.

Critical distinction: The test set should not be repeatedly used to select models or tune hyperparameters. Data preprocessing parameters such as scaling statistics should generally be fitted using the appropriate training partition, not the entire dataset.

The official scikit-learn guidance provides concrete explanations of these failure modes.&#x20;


Assessment direction: Diagnose a training pipeline reporting 99% test accuracy despite poor production results. Identify whether the problem is leakage, class imbalance, dataset shift, or another cause.

## Topic 5 — Model Evaluation

Priority: Essential · Requires supervised-learning basics

| Lesson                                              | Core coverage                                                                         | Depth / teaching       |
| --------------------------------------------------- | ------------------------------------------------------------------------------------- | ---------------------- |
| AI-22. Classification Metrics                       | Confusion matrix, accuracy, precision, recall, specificity, F1, macro/micro averaging | Work through · M, P, V |
| AI-23. Thresholds, ROC, and Precision–Recall Curves | TPR, FPR, ROC-AUC, PR-AUC, threshold selection, class imbalance                       | Work through · M, P, V |
| AI-24. Regression and Probabilistic Evaluation      | MAE, MSE, RMSE, R², log loss, probability calibration                                 | Work through · M, P    |
| AI-25. Choosing and Interpreting Metrics            | Business costs, error analysis, uncertainty, validation design, comparing models      | Apply · P, Scenario    |

Prerequisites: AI-12 and AI-18.

One misconception to explicitly challenge is that ROC-AUC is simply an accuracy score for classifiers. It measures discrimination across thresholds and does not directly tell us how well probabilities are calibrated or what precision to expect at an operating threshold.

Similarly, accuracy can be misleading on highly imbalanced datasets, but that doesn't mean precision and recall automatically resolve every evaluation problem.

Assessment direction: Compute metrics from a confusion matrix, compare two classifiers under different false-positive costs, and choose a suitable decision threshold.

## Topic 6 — Neural Networks

Priority: Essential · Mechanism-level mastery required

| Lesson                                               | Core coverage                                                                        | Depth / teaching       |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------ | ---------------------- |
| AI-26. From Perceptrons to Neural Networks           | Weighted sums, bias, layers, activation functions, nonlinear decision boundaries     | Work through · M, V    |
| AI-27. Forward Propagation and Loss                  | Network computations, tensor shapes, logits, probabilities, loss functions           | Implement · M, P, T    |
| AI-28. Backpropagation and Automatic Differentiation | Computational graphs, chain rule, local derivatives, gradient accumulation, autograd | Implement · M, P, V, T |
| AI-29. Training a Neural Network                     | SGD, mini-batches, Adam intuition, training loops, regularization, failure modes     | Implement · P, V       |

Prerequisites: AI-05–AI-10 and AI-19–AI-20.

The most important conceptual distinction is between backpropagation and gradient descent. Backpropagation efficiently computes gradients through a computational graph; an optimization algorithm uses gradients to update parameters.

I would include one manually calculated two-layer network example, followed by an equivalent implementation in PyTorch. The official PyTorch documentation explains how its automatic differentiation engine computes gradients over computational graphs.&#x20;

+1


Assessment direction: Given a small network, compute a forward pass, calculate the loss, trace a gradient backward, and identify why training may fail.

## Topic 7 — Deep Learning Architectures

Priority: Important · Conceptual understanding rather than full architecture implementation

| Lesson                                             | Core coverage                                                                            | Depth / teaching      |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------- | --------------------- |
| AI-30. Convolutional Neural Networks               | Convolutions, kernels, receptive fields, pooling, parameter sharing                      | Work through · M, V   |
| AI-31. Recurrent Networks and Sequence Modeling    | Recurrent hidden states, sequence processing, vanishing gradients, LSTM/GRU intuition    | Understand · V, T     |
| AI-32. Encoder–Decoder and Representation Learning | Encoders, latent representations, decoders, sequence-to-sequence learning, bottlenecks   | Understand · V        |
| AI-33. Comparing Neural Architectures              | CNNs, RNNs, attention-based models, inductive biases, parallelism, input characteristics | Analyze · V, Scenario |

Prerequisites: AI-26–AI-29.

The purpose is to understand why different architectures were developed, what problems they address, and how the trade-offs motivated attention-based models.

A visual comparison of convolution, recurrence, and attention would add substantial value. Implementing a simple convolution is useful; implementing a complete LSTM from scratch is optional.

Assessment direction: Given an image classification or sequence-modeling task, explain the architecture choice and its limitations.

## Topic 8 — Transformers

Priority: Essential · One of the deepest topics in this batch

| Lesson                                                 | Core coverage                                                                                              | Depth / teaching       |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- | ---------------------- |
| AI-34. Why Transformers Were Introduced                | Sequence modeling limitations, attention motivation, parallel computation, context relationships           | Understand · V         |
| AI-35. Attention From First Principles                 | Queries, keys, values, attention scores, softmax, weighted value aggregation, masking                      | Implement · M, P, V, T |
| AI-36. Multi-Head Attention and Positional Information | Multiple heads, projection matrices, positional information, attention shapes                              | Work through · M, V, T |
| AI-37. The Complete Transformer Block                  | Residual connections, layer normalization, feed-forward networks, attention, stacked blocks                | Work through · V       |
| AI-38. Transformer Architectures and Generation        | Encoder-only, decoder-only, encoder–decoder, causal masking, autoregressive decoding, KV caching intuition | Work through · P, V, T |

Prerequisites: Vectors, matrix multiplication, softmax, neural network forward passes, and encoder–decoder intuition.

Attention is a mechanism, not the whole transformer architecture. The original 2017 Transformer includes attention together with feed-forward layers, positional encoding, residual connections, normalization, and a particular encoder–decoder design. Modern model families use variations of those architectural components.&#x20;


Assessment direction: Calculate scaled dot-product attention on a tiny sequence, trace causal masking, identify tensor shapes, and explain why KV caching can reduce repeated attention computation during autoregressive generation.

The key implementation exercise should be a small attention function using NumPy or PyTorch—not a complete language model.

Sources: [Attention Is All You Need](https://arxiv.org/abs/1706.03762) and [Hugging Face Transformers documentation](https://huggingface.co/docs/transformers/).

## Topic 9 — Tokenization & Embeddings

Priority: Essential

| Lesson                                                  | Core coverage                                                                              | Depth / teaching       |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ---------------------- |
| AI-39. Text Tokenization                                | Character/word/subword tokenization, BPE, WordPiece, vocabulary, special tokens, token IDs | Work through · P, V, T |
| AI-40. Token Embeddings and Contextual Representations  | Embedding tables, lookup, token vectors, contextual hidden states, positional information  | Work through · M, P, V |
| AI-41. Sentence Embeddings and Semantic Representations | Pooling, text embeddings, cosine similarity, semantic comparisons, retrieval applications  | Implement · M, P, V    |

Prerequisites: AI-05, AI-26, and AI-34–AI-38 for contextual representations.

This topic needs particularly careful terminology.

A token embedding may be a vector retrieved from a learned embedding table. A contextual representation depends on other tokens and model computation. A text embedding designed for retrieval is generally a representation of an entire text span, often produced by a separately trained or adapted embedding system.

They should not be treated as identical objects.

Assessment direction: Trace text through a tokenizer into token IDs and vectors; explain why token counts are not simply word counts; compare sentence similarity using embedding vectors.

Reference: [Hugging Face LLM Course](https://huggingface.co/learn/llm-course/).&#x20;


## Topic 10 — LLM Fundamentals

Priority: Essential

| Lesson                                               | Core coverage                                                                                      | Depth / teaching    |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------- |
| AI-42. How Language Models Are Trained               | Next-token prediction, pretraining corpora, self-supervised objectives, generalization             | Work through · V, T |
| AI-43. Instruction Tuning and Alignment              | Supervised fine-tuning, preference data, RLHF, DPO intuition, model behavior shaping               | Understand · V      |
| AI-44. How LLM Inference Works                       | Logits, softmax, token selection, temperature, top-k/top-p, context windows, stopping conditions   | Implement · M, P, T |
| AI-45. LLM Capabilities, Limitations, and Trade-offs | Hallucinations, knowledge limitations, context effects, probabilistic generation, model comparison | Analyze · Scenario  |

Prerequisites: AI-34–AI-41.

Important qualifications:

Pretraining, supervised fine-tuning, and preference optimization have different objectives. Inference generates outputs using the current model parameters rather than automatically updating those parameters from each conversation.

Temperature modifies the relative token probabilities at sampling time. It is not a direct, universally reliable control for factuality or creativity. Top-p restricts candidate tokens based on cumulative probability mass, while implementation details can vary.

Assessment direction: Manually evaluate a small token probability distribution under sampling settings, explain why a model can confidently produce false information, and choose between model configurations under latency and quality constraints.

## Topic 11 — LLM API Integration

Priority: Essential · Implementation-level mastery

| Lesson                                          | Core coverage                                                                               | Depth / teaching    |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------- |
| AI-46. Model API Request and Response Lifecycle | API authentication, requests, messages, tokens, responses, usage, errors, latency, timeouts | Implement · P, T    |
| AI-47. Structured Outputs, Tools, and Streaming | JSON Schema, validation, tool-call lifecycle, streaming events, partial responses, failures | Implement · P, V, T |

Prerequisites: Python HTTP clients, JSON, asynchronous programming basics, and AI-42–AI-45.

These are two substantial lessons and may need splitting during drafting. In particular, tool calling and streaming have distinct state-management and failure-handling concerns.

A model emitting a tool call does not mean that the tool has already executed. The application remains responsible for validating authorization, invoking the tool, handling failures, and returning results as appropriate.

Structured outputs also require separating syntactic schema validity from semantic correctness. A response can conform to JSON Schema while still containing an incorrect answer. The OpenAI documentation distinguishes function calling, constrained structured responses, and streaming behavior.&#x20;

+1


Assessment direction: Trace a tool-call exchange, fix broken streamed-response aggregation, detect invalid assumptions about retries, and identify security problems in unvalidated tool execution.

Source: [OpenAI API documentation](https://developers.openai.com/api/docs/). Implementation details should be verified against the chosen provider's current SDK.

## Topic 12 — Prompt Engineering

Priority: Essential · Practical reasoning and experimentation

The two API lessons bring the provisional total to 47, but Prompt Engineering warrants additional lessons. That makes the revised total 51 lessons.

| Lesson                                                     | Core coverage                                                                                                 | Depth / teaching    |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------- |
| AI-48. Prompt Structure and Instruction Design             | Clear objectives, constraints, instruction hierarchy, task context, delimiters, output requirements           | Apply · P           |
| AI-49. Examples, Reasoning Strategies, and Prompt Patterns | Zero/few-shot prompting, demonstrations, decomposition, reasoning-oriented requests, model-dependent behavior | Apply · P, Scenario |
| AI-50. Prompt Templates and Dynamic Context                | Templates, variables, user data, prompt composition, injection boundaries, versioning                         | Implement · P       |
| AI-51. Prompt Evaluation and Failure Analysis              | Test cases, ambiguity, conflicting instructions, unreliable outputs, prompt iteration, regression checking    | Apply · P, Scenario |

Prerequisites: LLM Fundamentals and basic API Integration.

Prompt Engineering should not be taught as a collection of magic phrases. It should teach how to express requirements clearly, supply suitable context, evaluate behavior, and distinguish prompting problems from model limitations.

A particularly important distinction is that untrusted text inside a retrieved document or tool result should not automatically acquire the authority of a developer instruction.

Assessment direction: Repair an ambiguous extraction prompt, compare outputs against a small dataset, identify instruction conflicts, and explain when prompt changes are unlikely to solve an underlying reliability problem.

## 4. Consolidated inventory

**Scope:** 12 topics · **Planned:** 51 lessons · **Drafted in the source blueprint:** 0

| Topic | Planned lessons |
| --- | ---: |
| AI & ML Introduction | 4 |
| Math for AI                 | 6 |
| Classical ML                | 6 |
| Training Fundamentals       | 5 |
| Model Evaluation            | 4 |
| Neural Networks             | 4 |
| Deep Learning Architectures | 4 |
| Transformers                | 5 |
| Tokenization & Embeddings   | 3 |
| LLM Fundamentals            | 4 |
| LLM API Integration         | 2 |
| Prompt Engineering          | 4 |

## 5. Content quality decisions to settle

Before treating this as an approved blueprint, I would make five adjustments during review.

1. Separate model evaluation from LLM evaluation. The current Model Evaluation topic should focus mainly on classical supervised ML and predictive metrics. LLM answer evaluation, groundedness, tool-call success, and RAG evaluation belong in later AI Engineering topics. Otherwise the fundamentals become too broad.

2. Add explicit material on self-supervised learning. It should appear early in the introductory topic, then be revisited in LLM pretraining with actual training objectives and examples.

3. Distinguish training mathematics from practical engineering. Calculating gradients, reasoning about neural network shapes, and implementing simple optimization loops matter. Full proofs of convergence and the mathematics of large-scale distributed training are not necessary at this stage.

4. Reconsider the sizes of the API lessons. Tool calling and streaming may deserve independent lessons because their correctness, state management, and failure semantics are different. I would assess this when drafting Topic 11 rather than artificially preserving the current count.

5. Maintain clear boundaries with the Python Backend subject. HTTP requests, async programming, Pydantic validation, and exception handling should be taught in Python Backend. AI Engineering should concentrate on the AI-specific behavior built on those mechanisms.

## 6. Recommended next development stage

I would not generate all 51 lessons immediately. Instead, use this inventory as the provisional structure and start with Topic 1: AI & Machine Learning Introduction.

For that topic, the next stage should produce its complete interview-question inventory, misconceptions, assessment criteria, and source-backed lesson specifications. Then we can draft and review its four lessons before moving to Math for AI.

Once we've validated the quality of that first batch, the same process can scale to all 12 topics without changing the platform's simple Lessons + Interview Questions structure.

The existing topic IDs and repository schema still need to be checked when content is converted into files; the `AI-01` through `AI-51` labels used here are planning references only, not proposed permanent IDs.