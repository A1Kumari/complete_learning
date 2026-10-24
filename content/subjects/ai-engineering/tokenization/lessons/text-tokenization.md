---
id: lesson-ai-text-tokenization
kind: lesson
topicId: ai-tokenization-embeddings
title: Text Tokenization and Subword Algorithms
summary: Trace text through normalization, subword merges, vocabulary IDs, and special tokens; explain why token counts vary across languages and models.
difficulty: medium
status: published
revision: 1
order: 110
tags: [tokenization, bpe, wordpiece, python]
conceptIds: [concept-tokenization]
---

## Why text needs a representation

A neural language model operates on arrays, not Python strings. Its tokenizer maps
text to vocabulary IDs; an embedding layer subsequently maps IDs to vectors. A
token ID is an index, not an ordinal measure of meaning. Token 200 is not twice as
important as token 100. Use the tokenizer associated with the model checkpoint:
swapping vocabularies can preserve tensor shape while destroying the mapping the
model learned.

This lesson needs only strings, lists, and dictionaries. By the end you should be
able to execute a small merge trace, distinguish tokenizer training from encoding,
and explain multilingual token budgets without treating words as tokens.

```text
raw text
   ↓ normalization (if configured)
pre-tokenization / boundary rules
   ↓ subword or byte algorithm
token strings → vocabulary IDs → special-token formatting → model input
```

Normalization might lowercase or normalize Unicode; some tokenizers preserve raw
bytes instead. Pre-tokenization might separate punctuation or encode spaces.
Decoding reconstructs text according to these rules; lossy normalization can prevent
an exact original-text round trip.

## Character, word, and subword choices

Character tokenization uses a small alphabet but long sequences. Whole-word
tokenization makes common words compact but has a large vocabulary and trouble with
new words. Subwords balance vocabulary size and sequence length by representing
frequent fragments together and rare words as smaller pieces. Byte-level methods
can cover arbitrary UTF-8 text without an unknown-character token, although a token
boundary can split a multi-byte character. Incremental decoding must handle that.

Special tokens have trained roles: padding, end-of-sequence, separators, masks, or
chat delimiters. Their availability and interpretation are model-specific. Literal
text that resembles a delimiter is not necessarily the reserved special token.
Use the provider's serializer/chat template rather than inventing role delimiters.

## Work through byte-pair encoding

In a simplified character-based BPE training corpus, let `low` occur 3 times and
`lower` twice. Starting from individual characters, `(l,o)` and `(o,w)` each occur
5 times; `(w,e)` and `(e,r)` occur twice. A stated tie rule chooses `(l,o)` first:

```text
initial:  l o w        l o w e r
merge 1:  lo w         lo w e r
merge 2:  low          low e r
merge 3:  low          low er
```

The learned merge ranks are fixed during encoding. Encoding a new word does not
retrain them from that word's pair frequencies. Production byte-level BPE also has
byte mappings and pre-tokenization rules; the miniature below deliberately leaves
those out to expose the merge mechanism.

```python
def encode_word(word, merges):
    pieces = list(word)
    for left, right in merges:
        result = []
        i = 0
        while i < len(pieces):
            if i + 1 < len(pieces) and pieces[i:i+2] == [left, right]:
                result.append(left + right)
                i += 2
            else:
                result.append(pieces[i])
                i += 1
        pieces = result
    return pieces

merges = [('l', 'o'), ('lo', 'w'), ('e', 'r')]
assert encode_word('lower', merges) == ['low', 'er']
assert encode_word('lowest', merges) == ['low', 'e', 's', 't']
print(encode_word('lower', merges))
```

Expected output: `['low', 'er']`. This is an ordered-merge demonstration, not a
drop-in production tokenizer or a complete tokenizer trainer.

## How WordPiece differs

WordPiece encoding commonly uses greedy longest-match vocabulary lookup. With
vocabulary `play`, `##ing`, and `##er`, `playing` becomes `play`, `##ing`. The `##`
marks a continuation piece in BERT-style conventions. If the remaining text cannot
be represented, a conventional WordPiece tokenizer can replace the entire word
with `[UNK]`. BPE encoding uses learned merge ranks instead of this vocabulary-only
greedy procedure. Avoid claiming that every WordPiece trainer uses one exact merge
formula: the Hugging Face course explicitly qualifies its reconstruction of the
original training procedure.

## Apply this to token costs and truncation

An English word-count heuristic can badly underestimate code, identifiers, emojis,
or languages less efficiently covered by a vocabulary. Count with the actual
model tokenizer, including message overhead, tool definitions, and special tokens.
Changing normalization, tokenizer, or chat template is a versioned behavioral
change. Truncating raw bytes can corrupt Unicode; truncating token sequences can
remove a critical instruction or split a structured record even when decoding is valid.

## Recall and misconceptions

Predict `lowest` using the three merges before executing the code. Explain why
tokenizer training and model training are separate, why token IDs have no useful
numeric distance, and why a byte-complete vocabulary does not guarantee one token
per character. Check your answer: `['low','e','s','t']`; IDs select rows, not meanings;
UTF-8 uses variable numbers of bytes and merges combine selected sequences.

**Common error:** reporting a universal “four characters per token” conversion.
Treat heuristics as estimates and measure the real serialized request.

## Verified references

- [Hugging Face: BPE](https://huggingface.co/learn/llm-course/chapter6/5)
- [Hugging Face: WordPiece](https://huggingface.co/learn/llm-course/chapter6/6)

Continue to [token embeddings and contextual states](token-representations.md).
