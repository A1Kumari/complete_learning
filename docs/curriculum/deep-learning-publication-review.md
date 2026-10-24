# Deep Learning Architectures publication review

## Source and identity

The supplied files were found at repository root, not under `docs/curriculum/`:

- `remaining-ai-topics-roadmap.md`: read completely, 39-topic future specification.
- `deep-learning-architectures-lessons.md`: read completely, four authored lessons
  and ten interview assessment directions.

The roadmap topics match the existing catalog's `ai-deep-learning` through
`ai-research-concepts` sequence. Preserve those existing IDs when subsequent topics
are commissioned. Only Deep Learning Architectures is integrated in this batch.
Its existing order (70), subject (`ai-engineering`), and priority are retained.
`planningStatus: in-progress` indicates published material exists under the current
schema; there is no schema value claiming learner completion or educational approval.

## Coverage and permanent lesson IDs

| Authored boundary | Published lesson | Concept mapping | Assessment |
| --- | --- | --- | --- |
| CNN locality/filters/hierarchies | `lesson-ai-convolutional-networks` | `concept-convolution`, `concept-receptive-field`, `concept-architecture-tradeoffs` | shared weights, all four convolution windows, output shapes, recall |
| RNN state and limits | `lesson-ai-recurrent-networks` | `concept-recurrent-state`, `concept-gated-recurrence`, `concept-architecture-tradeoffs` | state trace, BPTT, gates, streaming resets |
| Encoders/decoders/representations | `lesson-ai-encoder-decoder` | `concept-encoder-decoder`, `concept-representation-learning` | numerical shapes, reconstruction MSE, source-state conditioning |
| Engineering trade-offs | `lesson-ai-architecture-selection` | `concept-architecture-tradeoffs`, convolution/state/encoder concepts | three product workloads, 50-ms speech case, cache/state arithmetic |

The ten source questions map to independent permanent IDs:

1. `ai-cnn-weight-sharing`
2. `ai-cnn-convolution-trace`
3. `ai-rnn-state-update`
4. `ai-rnn-gradient-flow`
5. `ai-gated-recurrent-memory`
6. `ai-encoder-decoder-roles`
7. `ai-reconstruction-representations`
8. `ai-streaming-architecture-choice`
9. `ai-attention-sequence-tradeoffs`
10. `ai-architecture-experiment-design`

Each question has a concise answer, supporting reasoning, two follow-ups,
misconception, reference, and four-point rubric. The existing reader derives lesson
question lists from `lessonId`; no duplicate manual list is maintained in lessons.

## Critical review and source verification

- Retrieved Stanford CS231n notes for convolution, sharing, pooling, and receptive
  fields. Historical architecture recommendations and dilation naming in those notes
  are not treated as current universal API behavior. Output floor and dilation 1
  conventions are checked against PyTorch.
- Retrieved PyTorch Conv2d, RNN, and LSTM references. Stable links resolved to 2.14
  documentation. Checked cross-correlation, layouts, groups, effective kernels,
  recurrent reuse, two-bias implementation, and modern LSTM gates. These lessons use
  Python/NumPy only and make no executable dependency on PyTorch.
- Retrieved Sutskever et al. 2014 abstract for the fixed-vector seq2seq design.
- Retrieved Bahdanau et al. abstract for attention over source annotations rather
  than requiring one fixed-size vector.
- Read Vaswani et al. full HTML, especially sections 1–4, for sequential dependency,
  masked training, cross-attention, and complexity qualifications.
- The source module's original JKU-hosted 1997 LSTM PDF returned a transport error.
  It is explicitly flagged in the lesson, not represented as read. Current gate
  equations are instead verified against the accessible primary implementation docs.

Added clarifications: flattening does not erase pixels; convolutional/dense outputs
are not equivalent just because output channel counts match; equivariance is not
invariance; fixed forward state is not constant-memory BPTT; bidirectional recurrence
needs future context; gate values are predicted in real models; modern forget-gate
equations are not attributed unchanged to 1997; reconstruction is not semantic
retrieval quality; teacher-forced training is not parallel unknown-token inference;
efficient attention need not remove quadratic arithmetic; memory budget arithmetic
does not establish latency or equal quality.

## Rendering and examples

No schema or rendering dependency changes. Three static, vertically arranged SVGs
preserve the original Mermaid graph relationships and fit small screens. Each has
SVG title/description, Markdown alt text, an adjacent prose alternative, and the
existing full-size link. General equations remain intact as explained text notation
rather than unrendered LaTeX. CNN output-size/dilation, BPTT derivative, LSTM gates,
reconstruction MSE, conditional factorization, and streaming-state arithmetic are
all present.

Five independently runnable Python blocks preserve all three original examples
and add gate and cache/state checks. `scripts/check-deep-learning-examples.py` reads
the actual Markdown fences, runs each in an isolated Python subprocess, and compares
deterministic output. This avoids maintaining divergent copies of lesson code.

### Verification results

- `npm run content:check`: passes; 212 total questions (25 Markdown), 9 lessons.
  This batch contributes exactly four lessons and ten questions.
- `npm test`: 46/46 pass, including historical identities, drafts/references,
  assets, deterministic compilation, personal data, and recall routes.
- `npm run lint`, `npm run build`, and `git diff --check`: pass. The build still
  reports the existing eager-bundle size advisory; it completes successfully.
- Five actual Python fences execute independently with assertions and checked
  output, using Python 3.14.7 and NumPy 2.3.5. Verification used a temporary virtual
  environment reusing the installed NumPy, with isolated (`-I`) subprocesses.
- Chrome headless against an explicit production preview on port 4190: desktop
  1280×900 and mobile emulation 390×844. The previous port 4173 was a development
  server, so final production checks use the dedicated preview instead.
- At both sizes: topic panel shows four lessons and ten questions; all four lesson
  routes load; all three diagrams load with nonempty alt text; Python blocks and
  appropriate question lists render; desktop/mobile contents expand/collapse as
  intended; Back returns to the subject's topic grid; no document-level horizontal
  overflow; no uncaught JavaScript or browser log errors.
- Every question's recall route hides the answer until Reveal answer, then renders
  Supporting reasoning and Evaluation rubric. Lesson practice links retain the
  return-to-lesson link.
- Visual inspection of desktop/mobile screenshots caught the pre-existing 330px
  image-height cap shrinking vertical diagrams. A small CSS override now preserves
  aspect ratio at up to 480px width without the height cap. Rebuilt and repeated
  production browser checks; the mobile SVG labels are visibly readable.

These are Chromium mobile-emulation checks, not physical-device or Safari checks.
Subsequent roadmap topics remain unpublished pending review of this module.
