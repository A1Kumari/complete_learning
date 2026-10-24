---
id: ai-tokenizer-subword-encoding
kind: question
topicId: ai-tokenization-embeddings
lessonId: lesson-ai-text-tokenization
prompt: How do BPE and WordPiece encoding differ, and is encoding the same as tokenizer training?
difficulty: medium
status: published
revision: 1
order: 230
tags: [tokenization, bpe, wordpiece]
followUps:
  - Apply merges l+o, lo+w, e+r to the word lower.
  - Why must a tokenizer be paired with the model checkpoint?
misconception: Encoding normally applies a fixed vocabulary and rules; it does not retrain them on each request.
---

## Answer

BPE encoding applies learned merge ranks to base symbols. WordPiece commonly uses
greedy longest-match vocabulary lookup with continuation pieces. Training constructs
the vocabulary/rules; encoding applies them to new text.

### Supporting reasoning

The example produces `['low','er']`. IDs index the model's learned embedding rows,
so changing the vocabulary mapping can silently corrupt meaning even if shapes fit.
WordPiece training details vary; do not assert one reconstructed algorithm is universal.

### Evaluation rubric

One point each: merge-rank mechanism; greedy vocabulary mechanism; training/encoding
distinction; correct trace or model/tokenizer compatibility explanation.
