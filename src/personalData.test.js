import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { LEGACY_REFERENCE, fingerprint } from './legacyReference.js';
import { toSubjectGroups } from './content/adapter.js';
import {
  PERSONAL_KEY, BACKUP_PREFIX, LEGACY_KEYS, emptyPersonal, migrateLegacy,
  deriveTopics, deriveTemplates, openPersonalStore, validatePersonal, validateContent,
  updateQuestion, deleteQuestion, updateTemplateStatus, parseBackup,
} from './personalData.js';

const json = name => JSON.parse(readFileSync(new URL(`./data/${name}.json`, import.meta.url), 'utf8'));
const content = toSubjectGroups(JSON.parse(readFileSync(new URL('./generated/catalog.json', import.meta.url), 'utf8')));
const templates = json('dsa_templates').templates;
const q = { id: 'test-one', q: 'A question?', a: '<b>Answer</b>', d: 'e', freq: true };
const topics = [{ id: 'test', questions: [q, { ...q, id: 'test-two', q: 'Another question?' }] }];
const ts = [{ id: 'dfs', name: 'DFS', example: 'Traverse' }];
const rawLegacy = (questions, other = {}) => ({
  'cs-learning-data': JSON.stringify([{ id: 'test', questions }]),
  'dsa-templates': null, 'dsa-notes': null, ...other,
});
class MemoryStorage {
  constructor(entries = {}) { this.entries = new Map(Object.entries(entries)); this.failKey = null; }
  get length() { return this.entries.size; }
  key(index) { return [...this.entries.keys()][index] ?? null; }
  getItem(key) { return this.entries.get(key) ?? null; }
  setItem(key, value) {
    if (key === this.failKey || (this.failKey === 'backup' && key.startsWith(BACKUP_PREFIX))) throw new Error('Quota exceeded');
    this.entries.set(key, value);
  }
}
const backupValues = storage => [...storage.entries].filter(([k]) => k.startsWith(BACKUP_PREFIX)).map(([, v]) => v);

test('template attempts count practice starts, not repeated status clicks or mastery changes', () => {
  let p = updateTemplateStatus(emptyPersonal(), 'dfs', 'practicing');
  assert.equal(p.templateState.dfs.attempts, 1);
  assert.equal(updateTemplateStatus(p, 'dfs', 'practicing'), p);
  p = updateTemplateStatus(p, 'dfs', 'mastered');
  assert.equal(p.templateState.dfs.attempts, 1);
  p = updateTemplateStatus(p, 'dfs', 'practicing');
  assert.equal(p.templateState.dfs.attempts, 2);
  p.templateState.dfs.attempts = Number.MAX_SAFE_INTEGER;
  p = updateTemplateStatus(updateTemplateStatus(p, 'dfs', 'mastered'), 'dfs', 'practicing');
  assert.equal(p.templateState.dfs.attempts, Number.MAX_SAFE_INTEGER);
});

test('published IDs are unique; frozen reference covers every original question', () => {
  validateContent(content, templates);
  assert.ok(content.flatMap(t => t.questions).length > 0);
  assert.equal(LEGACY_REFERENCE.length, 190);
  assert.equal(new Set(LEGACY_REFERENCE.map(r => r.id)).size, 190);
  assert.equal(new Set(LEGACY_REFERENCE.map(r => `${r.topicId}:${r.hash}`)).size, 190);
  // Historical fixture, independent of future wording or removals in published JSON.
  assert.equal(LEGACY_REFERENCE.find(r => r.id === 'os-q001').hash,
    fingerprint('What is the difference between a process and a thread? Why are threads called lightweight?'));
  assert.throws(() => validateContent([{ id: 'test', questions: [q, q] }], ts));
});

test('fresh install uses published content; saves no published datasets', () => {
  const storage = new MemoryStorage();
  const store = openPersonalStore(storage, topics, ts);
  store.save(store.personal);
  assert.equal(deriveTopics(topics, store.personal)[0].questions.length, 2);
  assert.deepEqual(JSON.parse(storage.getItem(PERSONAL_KEY)), emptyPersonal());
  assert.equal(storage.getItem('cs-learning-data'), null);
});

test('full real legacy dataset migrates without spurious customs/recovery', () => {
  const raw = { 'cs-learning-data': JSON.stringify(content.map(t => ({ ...t, questions: t.questions.map(question => {
    const copy = { ...question }; delete copy.id; return copy;
  }) }))),
    'dsa-templates': JSON.stringify(templates), 'dsa-notes': '{}' };
  const { personal, summary } = migrateLegacy(raw, content, templates);
  assert.equal(summary.matched, content.flatMap(t => t.questions).length);
  assert.equal(personal.customQuestions.length, 0);
  assert.equal(personal.recovery.length, 0);
  assert.equal(Object.keys(personal.templateState).length, templates.length);
});

test('legacy notes, statuses and custom duplicates survive; missing published entries are restored', () => {
  const raw = rawLegacy([
    { ...q, notes: 'Personal', status: 'mastered' },
    { q: 'Custom', a: 'One', d: 'm', freq: false, notes: 'First' },
    { q: 'Custom', a: 'Two', d: 'h', freq: true, notes: 'Second' },
  ]);
  const { personal } = migrateLegacy(raw, topics, ts, []);
  assert.equal(personal.questionState[q.id].notes, 'Personal');
  assert.equal(personal.questionState[q.id].status, 'mastered');
  assert.equal(personal.customQuestions.length, 2);
  assert.notEqual(personal.customQuestions[0].id, personal.customQuestions[1].id);
  assert.deepEqual(personal.hiddenQuestionIds, []);
  assert.equal(deriveTopics(topics, personal)[0].questions.length, 4);
  assert.deepEqual(migrateLegacy(raw, topics, ts, []).personal, personal);
});

test('unambiguous changed content maps to published ID, with originals in recovery, not custom copies', () => {
  const original = { ...q, a: 'My differing answer', notes: 'Keep me', status: 'comfortable' };
  const { personal } = migrateLegacy(rawLegacy([original, { ...original, notes: 'Conflicting note' }]), topics, ts, []);
  assert.equal(personal.customQuestions.length, 0);
  assert.equal(personal.questionState[q.id].notes, 'Keep me');
  assert.equal(personal.recovery.length, 2);
  assert.equal(JSON.parse(personal.recovery[1].raw).notes, 'Conflicting note');
  assert.equal(deriveTopics(topics, personal)[0].questions[0].a, q.a);
});

test('frozen reference handles first migration after rewording or retirement', () => {
  const ref = [{ topicId: 'test', id: q.id, hash: fingerprint(q.q) }];
  const reworded = [{ id: 'test', questions: [{ ...q, q: 'Updated wording', a: 'Corrected answer' }] }];
  const { personal } = migrateLegacy(rawLegacy([{ ...q, id: undefined, notes: 'Old notes' }]), reworded, ts, ref);
  assert.equal(personal.customQuestions.length, 0);
  assert.equal(deriveTopics(reworded, personal)[0].questions[0].notes, 'Old notes');
  const retired = migrateLegacy(rawLegacy([{ ...q, id: undefined, notes: 'Old notes' }]), [], ts, ref).personal;
  assert.equal(retired.customQuestions.length, 0);
  assert.equal(retired.questionState[q.id].notes, 'Old notes');
  assert.equal(retired.recovery.length, 1);
});

test('ambiguous published wording is preserved as custom rather than guessed', () => {
  const ambiguous = [{ id: 'test', questions: [q, { ...q, id: 'different-id' }] }];
  const personal = migrateLegacy(rawLegacy([{ ...q, id: undefined, notes: 'Important' }]), ambiguous, ts, []).personal;
  assert.equal(personal.customQuestions.length, 1);
  assert.match(personal.recovery[0].reason, /Ambiguous/);
});

test('an exact content match disambiguates repeated published wording without a custom duplicate', () => {
  const duplicates = [{ id: 'test', questions: [q, { ...q, id: 'different-id', a: 'Different answer' }] }];
  const personal = migrateLegacy(rawLegacy([{ ...q, id: undefined, notes: 'Keep on original' }]), duplicates, ts, []).personal;
  assert.equal(personal.customQuestions.length, 0);
  assert.equal(personal.questionState[q.id].notes, 'Keep on original');
});

test('future additions, corrections, reorder, removal and reintroduction preserve personal state', () => {
  let p = updateQuestion(emptyPersonal(), q.id, { notes: 'Notes', status: 'learning' });
  const future = [{ id: 'test', questions: [{ ...q, id: 'new-one' }, topics[0].questions[1], { ...q, a: 'Corrected', q: 'Reworded' }] }];
  const result = deriveTopics(future, p)[0].questions;
  assert.equal(result.length, 3);
  assert.equal(result[2].a, 'Corrected');
  assert.equal(result[2].notes, 'Notes');
  assert.equal(deriveTopics([{ id: 'test', questions: [] }], p)[0].questions.length, 0);
  assert.equal(deriveTopics(topics, p)[0].questions[0].notes, 'Notes');
  p = deleteQuestion(p, q.id);
  assert.equal(deriveTopics(future, p)[0].questions.length, 2);
  assert.equal(p.questionState[q.id].notes, 'Notes');
});

test('deleting a custom question retains its full data and does not affect another identity', () => {
  let p = migrateLegacy(rawLegacy([{ ...q, id: undefined, q: 'Custom' }]), topics, ts, []).personal;
  const id = p.customQuestions[0].id;
  p = deleteQuestion(p, id);
  assert.equal(p.customQuestions.length, 1);
  assert.equal(deriveTopics(topics, p)[0].questions.length, 2);
});

test('template notes conflicts, invalid attempts, and removed template state are retained', () => {
  const oldTemplates = [{ ...ts[0], status: 'practicing', notes: 'Embedded', attempts: null }, { id: 'retired', status: 'mastered', notes: 'Old', attempts: 4 }];
  const personal = migrateLegacy(rawLegacy([], { 'dsa-templates': JSON.stringify(oldTemplates), 'dsa-notes': JSON.stringify({ dfs: 'Separate', 'notes-only': 'Note' }) }), topics, ts, []).personal;
  assert.deepEqual(personal.templateState.dfs, { status: 'practicing', notes: 'Separate', attempts: 0 });
  assert.equal(personal.templateState.retired.attempts, 4);
  assert.equal(personal.templateState['notes-only'].notes, 'Note');
  assert.ok(personal.recovery.some(r => r.reason.includes('Conflicting')));
  assert.equal(deriveTemplates([{ ...ts[0], example: 'New content' }], personal)[0].example, 'New content');
});

test('malformed legacy JSON and partial invalid entries remain recoverable', () => {
  const raw = rawLegacy([null, { q: ' ', a: 'Empty' }, { ...q, notes: 12, status: 'invalid' }], { 'dsa-templates': '{broken', 'dsa-notes': '[]' });
  const p = migrateLegacy(raw, topics, ts, []).personal;
  assert.equal(p.customQuestions.length, 0);
  assert.equal(p.questionState[q.id].status, 'not-started');
  assert.equal(p.recovery.length, 5);
  const storage = new MemoryStorage(raw);
  const store = openPersonalStore(storage, topics, ts);
  store.save(store.personal);
  for (const key of LEGACY_KEYS) assert.equal(storage.getItem(key), raw[key]);
  assert.equal(JSON.parse(backupValues(storage)[0]).legacy['dsa-templates'], '{broken');
});

test('migration is restart-safe, idempotent and leaves legacy keys and backup intact', () => {
  const raw = rawLegacy([{ ...q, notes: 'Saved' }, { ...q, q: 'Custom', id: undefined }]);
  const storage = new MemoryStorage(raw);
  const first = openPersonalStore(storage, topics, ts);
  const strictModeTrial = openPersonalStore(storage, topics, ts);
  first.save(first.personal);
  assert.throws(() => strictModeTrial.save(strictModeTrial.personal), /another tab/);
  const saved = storage.getItem(PERSONAL_KEY);
  for (let i = 0; i < 3; i++) {
    const store = openPersonalStore(storage, topics, ts);
    store.save(store.personal);
    assert.equal(store.personal.customQuestions.length, 1);
  }
  assert.equal(storage.getItem(PERSONAL_KEY), saved);
  assert.equal(backupValues(storage).length, 1);
  for (const key of LEGACY_KEYS) assert.equal(storage.getItem(key), raw[key]);
});

test('backup failure prevents migration commit; failed commit can safely retry without duplicate backup', () => {
  const storage = new MemoryStorage(rawLegacy([q]));
  const store = openPersonalStore(storage, topics, ts);
  storage.failKey = 'backup';
  assert.throws(() => store.save(store.personal), /Quota/);
  assert.equal(storage.getItem(PERSONAL_KEY), null);
  storage.failKey = PERSONAL_KEY;
  assert.throws(() => store.save(store.personal), /Quota/);
  assert.equal(backupValues(storage).length, 1);
  storage.failKey = null;
  store.save(store.personal);
  assert.equal(backupValues(storage).length, 1);
});

test('corrupt/future personal storage is never overwritten, but is exportable and recoverable via validated restore', () => {
  for (const raw of ['{bad', JSON.stringify({ schemaVersion: 99 })]) {
    const storage = new MemoryStorage({ [PERSONAL_KEY]: raw });
    const store = openPersonalStore(storage, topics, ts);
    assert.ok(store.error);
    assert.throws(() => store.save(emptyPersonal()), /read-only/);
    assert.equal(storage.getItem(PERSONAL_KEY), raw);
    assert.equal(parseBackup(store.export()).originalPersonal, raw);
    const validStore = openPersonalStore(new MemoryStorage(), topics, ts);
    const next = store.restore(validStore.export());
    store.save(updateQuestion(next, q.id, { notes: 'Recovered' }));
    assert.ok(backupValues(storage).some(v => JSON.parse(v).personal === raw));
  }
});

test('unavailable storage reports failure without overwrites', () => {
  const storage = { getItem() { throw new Error('Disabled'); }, setItem() { assert.fail('Must not write'); } };
  const store = openPersonalStore(storage, topics, ts);
  assert.match(store.error, /Disabled/);
  assert.throws(() => store.save(emptyPersonal()), /read-only/);
  const exported = parseBackup(store.export(updateQuestion(emptyPersonal(), q.id, { notes: 'In memory' })));
  assert.equal(exported.personal.questionState[q.id].notes, 'In memory');
  assert.match(exported.personal.recovery[0].reason, /Storage could not be read/);
});

test('cross-tab changes to new or legacy data are not overwritten', () => {
  const storage = new MemoryStorage(rawLegacy([q]));
  const store = openPersonalStore(storage, topics, ts);
  storage.setItem('cs-learning-data', '[]');
  assert.throws(() => store.save(store.personal), /Legacy data changed/);
  const second = openPersonalStore(storage, topics, ts);
  second.save(second.personal);
  storage.setItem(PERSONAL_KEY, JSON.stringify(updateQuestion(second.personal, q.id, { notes: 'Other tab' })));
  assert.throws(() => second.save(second.personal), /another tab/);
  assert.throws(() => second.restore(second.export()), /another tab/);
});

test('export/import round trip restores personal data and recovery, retaining local and imported originals', () => {
  const source = new MemoryStorage(rawLegacy([{ ...q, a: 'Different', notes: 'A' }, { ...q, q: 'Custom', id: undefined }]));
  const sourceStore = openPersonalStore(source, topics, ts);
  sourceStore.save(sourceStore.personal);
  const exported = sourceStore.export(sourceStore.personal);
  const target = new MemoryStorage({ 'cs-learning-data': 'old local raw' });
  const targetStore = openPersonalStore(target, topics, ts);
  const unsaved = updateQuestion(targetStore.personal, q.id, { notes: 'Unsaved before restore' });
  const restored = targetStore.restore(exported, unsaved);
  assert.deepEqual(restored, sourceStore.personal);
  assert.deepEqual(openPersonalStore(target, topics, ts).personal, sourceStore.personal);
  assert.equal(target.getItem('cs-learning-data'), 'old local raw');
  assert.ok(backupValues(target).some(v => JSON.parse(v).inMemory?.questionState[q.id]?.notes === 'Unsaved before restore'));
  assert.ok(backupValues(target).some(v => v === backupValues(source)[0]));
  assert.equal(parseBackup(targetStore.export(restored)).personal.customQuestions.length, 1);
});

test('invalid imports are rejected before any writes', () => {
  const storage = new MemoryStorage();
  const store = openPersonalStore(storage, topics, ts);
  const good = JSON.parse(store.export());
  const variants = [
    { ...good, version: 2 },
    { ...good, personal: { ...good.personal, schemaVersion: 9 } },
    { ...good, personal: { ...good.personal, hiddenQuestionIds: ['__proto__'] } },
    { ...good, personal: { ...good.personal, questionState: { x: { status: 'unknown', notes: '' } } } },
    { ...good, personal: { ...good.personal, templateState: { x: { status: 'mastered', notes: '', attempts: -1 } } } },
    { ...good, personal: { ...good.personal, publishedContent: [] } },
    { ...good, archives: [{ key: PERSONAL_KEY, value: 'bad' }] },
    { ...good, legacy: {} },
  ];
  for (const b of variants) {
    assert.throws(() => store.restore(JSON.stringify(b)));
    assert.equal(storage.length, 0);
  }
  assert.throws(() => store.restore('{bad'));
  const custom = { ...q, id: 'custom-a', topicId: 'test' };
  assert.throws(() => validatePersonal({ ...emptyPersonal(), customQuestions: [custom, custom] }));
});

test('restore write/backup failure retains current data and original backups', () => {
  const storage = new MemoryStorage();
  const store = openPersonalStore(storage, topics, ts);
  store.save(store.personal);
  const before = storage.getItem(PERSONAL_KEY);
  const incoming = store.export(updateQuestion(store.personal, q.id, { notes: 'Imported' }));
  storage.failKey = 'backup';
  assert.throws(() => store.restore(incoming), /Quota/);
  assert.equal(storage.getItem(PERSONAL_KEY), before);
  storage.failKey = PERSONAL_KEY;
  assert.throws(() => store.restore(incoming), /Quota/);
  assert.equal(storage.getItem(PERSONAL_KEY), before);
  const retained = backupValues(storage);
  storage.failKey = null;
  assert.equal(store.restore(incoming).questionState[q.id].notes, 'Imported');
  for (const v of retained) assert.ok(backupValues(storage).includes(v));
});

test('repeated restore replaces by stable identity and retains archives without duplicating customs', () => {
  const source = openPersonalStore(new MemoryStorage(rawLegacy([{ ...q, q: 'Custom', id: undefined }])), topics, ts);
  const text = source.export();
  const target = new MemoryStorage();
  const store = openPersonalStore(target, topics, ts);
  let current = store.personal;
  for (let i = 0; i < 3; i++) current = store.restore(text, current);
  const count = backupValues(target).length;
  current = store.restore(text, current);
  assert.equal(current.customQuestions.length, 1);
  assert.equal(backupValues(target).length, count);
});
