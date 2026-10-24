# Migration 2 pilot: browser verification

For the Transformers / Vector Databases / Retrieval Systems batch (12 lessons,
24 questions), see
[`docs/curriculum/transformers-vector-retrieval-review.md`](docs/curriculum/transformers-vector-retrieval-review.md)
for production-preview desktop/mobile lesson, topic-panel, and recall/reveal checks.

For the four-topic AI Part 1 batch (15 lessons, 30 questions), see
[`docs/curriculum/ai-part1-four-topics-review.md`](docs/curriculum/ai-part1-four-topics-review.md)
for production-preview desktop/mobile checks, local example results, and scope.

For the later Deep Learning Architectures batch (four lessons, ten questions), see
[`docs/curriculum/deep-learning-publication-review.md`](docs/curriculum/deep-learning-publication-review.md).
It records separate production-preview desktop/mobile results, including diagram
legibility, all lesson routes, topic navigation, recall gating, and rubric rendering.
The counts below refer to the original migration pilot.

Verified locally in an isolated **Chrome 154 headless** profile against both Vite
development and production preview. Desktop viewport: 1280×900; mobile emulation:
390×844. This does not represent a Firefox/Safari or physical-device test.

All 23 browser scenarios passed, with no uncaught JavaScript or console errors:

- All 190 questions and 31 template entries render; existing answers/search work.
- The pilot lesson loads from static JSON, including its table, Python code block,
  local SVG, section anchors, and links back to the existing interview cards.
- Direct lesson hash URLs survive refresh in the production preview.
- Lesson images and tables fit the mobile page without document-level overflow.
- Notes/statuses remain attached to the same question IDs through lesson navigation
  and reloads. Mobile notes still open, close, and persist.
- Existing personal-v1 notes, custom questions scoped to `os`, and deletion markers
  survive. Linking to a hidden question does not resurrect it.
- A complete pre-Markdown snapshot migrates without custom duplicates or false
  recovery records caused by changed HTML serialization.
- Genuine differing answers, conflicting duplicates, and malformed legacy JSON
  remain recoverable. Repeated reloads/Strict Mode do not duplicate migration data.
- Creating/deleting custom questions and deleting published questions still work.
- Actual Export Backup file downloads and Import Backup uploads restore personal
  data; repeated imports do not append duplicate custom questions.
- Invalid imports and cancelled restores leave current storage unchanged.
- Corrupt current storage remains untouched until validated restore succeeds.
- Simulated quota failure keeps edits in memory; Retry Save subsequently persists
  them after storage is available again.
- DSA search rows agree with the count; descriptions render; progress persists;
  repeated Practicing clicks and mastery changes do not inflate attempt counts.

## Reproduce manually

1. Run `npm run dev`. Open the OS lesson, follow its section links, then open each
   interview card. Add a note/status, reload, and confirm the same card owns them.
2. Add a custom OS question and delete one pilot question. Open the lesson and
   follow the deleted question's link: it must remain hidden.
3. Export a backup, change a note/status, and import the file. Confirm replacement
   and reload. Repeat the import; custom-question counts must remain unchanged.
4. Import invalid JSON and cancel a valid restore. Neither should change storage.
5. Test DSA search, open a template, and change statuses. Attempts count starts of
   practice, not repeated clicks.
6. Run `npm run build && npm run preview` and repeat lesson/backup checks. Open
   `/#/lesson/lesson-os-processes-threads` directly and refresh.

Use a separate browser profile for deliberately corrupting/seeding legacy storage.
The Node tests exercise migration records, storage failures, and content validation
without requiring changes to real browser data. See `CONTENT_AUTHORING.md` for the
authoring/build workflow and `DATA_FLOW.md` for backup and recovery details.
