import { LEGACY_REFERENCE, fingerprint, normalizeText } from './legacyReference.js';

export const PERSONAL_KEY = 'cs-learning-personal-v1';
export const BACKUP_PREFIX = 'cs-learning-backup:';
export const LEGACY_KEYS = ['cs-learning-data', 'dsa-templates', 'dsa-notes'];
export const QUESTION_STATUSES = ['not-started', 'learning', 'comfortable', 'mastered', 'revisit'];
export const TEMPLATE_STATUSES = ['not_started', 'practicing', 'mastered'];
const own = (object, key) => Object.hasOwn(object, key);
const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const safeId = value => typeof value === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,199}$/.test(value)
  && !['__proto__', 'constructor', 'prototype'].includes(value);
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const fields = (object, allowed) => Object.keys(object).every(key => allowed.includes(key));
const questionContentFields = ['q', 'a', 'd', 'freq', 'cross', 'trap'];
const matchesQuestionContent = (question, candidate) => candidate
  && questionContentFields.every(key => JSON.stringify(question[key]) === JSON.stringify(candidate[key]));

export function emptyPersonal() {
  return { schemaVersion: 3, questionState: {}, customQuestions: [], hiddenQuestionIds: [], templateState: {}, recovery: [], completedLessonIds: [], studyDays: {}, completedStudyDays: [] };
}

export function migratePersonal(value) {
  validatePersonal(value);
  if (value.schemaVersion === 1) return { ...value, schemaVersion: 3, completedLessonIds: [], studyDays: {}, completedStudyDays: [] };
  if (value.schemaVersion === 2) return { ...value, schemaVersion: 3, completedStudyDays: [] };
  return value;
}

function validQuestion(q) {
  return record(q) && typeof q.q === 'string' && q.q.trim() && typeof q.a === 'string'
    && ['e', 'm', 'h'].includes(q.d) && typeof q.freq === 'boolean'
    && (q.trap === undefined || typeof q.trap === 'string')
    && (q.cross === undefined || (Array.isArray(q.cross) && q.cross.every(c => typeof c === 'string')));
}

// Strict validation for the NEW format. Unknown fields/versions are not silently discarded.
export function validatePersonal(value) {
  assert(record(value) && [1, 2, 3].includes(value.schemaVersion), 'Unsupported personal-data version. Original storage is untouched.');
  assert(fields(value, ['schemaVersion', 'questionState', 'customQuestions', 'hiddenQuestionIds', 'templateState', 'recovery', ...(value.schemaVersion >= 2 ? ['completedLessonIds', 'studyDays'] : []), ...(value.schemaVersion === 3 ? ['completedStudyDays'] : [])]), 'Unknown personal-data fields.');
  if (value.schemaVersion >= 2) {
    assert(Array.isArray(value.completedLessonIds) && value.completedLessonIds.every(safeId) && new Set(value.completedLessonIds).size === value.completedLessonIds.length, 'Invalid lesson completion IDs.');
    assert(record(value.studyDays) && Object.entries(value.studyDays).every(([day, seconds]) => /^\d{4}-\d{2}-\d{2}$/.test(day) && new Date(`${day}T12:00:00Z`).toISOString().slice(0, 10) === day && Number.isSafeInteger(seconds) && seconds > 0), 'Invalid study activity.');
  }
  if (value.schemaVersion === 3) assert(Array.isArray(value.completedStudyDays) && value.completedStudyDays.every(day => /^\d{4}-\d{2}-\d{2}$/.test(day) && new Date(`${day}T12:00:00Z`).toISOString().slice(0, 10) === day) && new Set(value.completedStudyDays).size === value.completedStudyDays.length, 'Invalid completed study days.');
  for (const [name, statuses] of [['questionState', QUESTION_STATUSES], ['templateState', TEMPLATE_STATUSES]]) {
    assert(record(value[name]), `Invalid ${name}.`);
    for (const [id, state] of Object.entries(value[name])) {
      assert(safeId(id) && record(state) && fields(state, name === 'templateState' ? ['notes', 'status', 'attempts'] : ['notes', 'status']), `Invalid ${name} entry.`);
      assert(typeof state.notes === 'string' && statuses.includes(state.status), `Invalid notes/status for ${id}.`);
      if (name === 'templateState') assert(Number.isSafeInteger(state.attempts) && state.attempts >= 0, `Invalid attempts for ${id}.`);
    }
  }
  assert(Array.isArray(value.customQuestions), 'Invalid custom questions.');
  const ids = new Set();
  for (const q of value.customQuestions) {
    assert(validQuestion(q) && safeId(q.id) && q.id.startsWith('custom-') && safeId(q.topicId)
      && fields(q, ['id', 'topicId', 'q', 'a', 'd', 'freq', 'trap', 'cross']) && !ids.has(q.id), 'Invalid or duplicate custom question ID/content.');
    ids.add(q.id);
  }
  assert(Array.isArray(value.hiddenQuestionIds) && value.hiddenQuestionIds.every(safeId)
    && new Set(value.hiddenQuestionIds).size === value.hiddenQuestionIds.length, 'Invalid hidden question IDs.');
  assert(Array.isArray(value.recovery) && value.recovery.every(r => record(r)
    && fields(r, ['reason', 'source', 'raw']) && ['reason', 'source', 'raw'].every(k => typeof r[k] === 'string')), 'Invalid recovery records.');
  return value;
}

export function validateContent(topics, templates) {
  const ids = new Set();
  const topicIds = new Set();
  for (const topic of topics) {
    assert(safeId(topic.id) && !topicIds.has(topic.id), 'Duplicate/invalid topic ID.');
    topicIds.add(topic.id);
    for (const q of topic.questions) {
      assert(safeId(q.id) && !q.id.startsWith('custom-') && !ids.has(q.id) && validQuestion(q), 'Duplicate/invalid published question.');
      ids.add(q.id);
    }
  }
  const templateIds = new Set();
  for (const t of templates) {
    assert(safeId(t.id) && !templateIds.has(t.id), 'Duplicate/invalid template ID.');
    templateIds.add(t.id);
  }
}

export function migrateLegacy(raw, topics, templates, reference = LEGACY_REFERENCE, baselines = {}) {
  const personal = emptyPersonal();
  const summary = { matched: 0, custom: 0, recovered: 0 };
  const recover = (reason, source, value) => {
    personal.recovery.push({ reason, source, raw: JSON.stringify(value) ?? 'null' });
    summary.recovered++;
  };
  const parse = (key, check) => {
    if (raw[key] == null) return null;
    try {
      const parsed = JSON.parse(raw[key]);
      if (!check(parsed)) throw new Error('Invalid shape');
      return parsed;
    } catch {
      recover('Invalid legacy data; original raw value retained', key, raw[key]);
      return null;
    }
  };
  const published = topics.flatMap(t => t.questions.map(q => ({ ...q, topicId: t.id })));
  const stateFor = (q, source, statuses = QUESTION_STATUSES) => {
    if ((q.notes !== undefined && typeof q.notes !== 'string') || (q.status !== undefined && !statuses.includes(q.status))) {
      recover('Invalid personal fields; usable fields migrated', source, q);
    }
    return { notes: typeof q.notes === 'string' ? q.notes : '', status: statuses.includes(q.status) ? q.status : statuses[0] };
  };
  const oldTopics = parse(LEGACY_KEYS[0], Array.isArray) || [];
  oldTopics.forEach((topic, ti) => {
    const source = `${LEGACY_KEYS[0]}[${ti}]`;
    if (!record(topic) || !safeId(topic.id) || !Array.isArray(topic.questions)) {
      recover('Invalid legacy topic', source, topic);
      return;
    }
    topic.questions.forEach((q, qi) => {
      const location = `${source}.questions[${qi}]`;
      if (!record(q) || typeof q.q !== 'string' || !q.q.trim() || typeof q.a !== 'string') {
        recover('Invalid legacy question', location, q);
        return;
      }
      let candidates = new Set();
      if (safeId(q.id) && published.some(p => p.id === q.id && p.topicId === topic.id)) candidates.add(q.id);
      if (!candidates.size) {
        for (const p of published) {
          if (p.topicId === topic.id && normalizeText(p.q) === normalizeText(q.q)) candidates.add(p.id);
        }
        for (const p of reference) {
          if (p.topicId === topic.id && p.hash === fingerprint(q.q)) candidates.add(p.id);
        }
        if (candidates.size > 1) {
          const exact = published.filter(p => candidates.has(p.id)
            && (matchesQuestionContent(q, p) || matchesQuestionContent(q, baselines[p.id])));
          if (exact.length === 1) candidates = new Set([exact[0].id]);
        }
      }
      const state = stateFor(q, location);
      if (candidates.size === 1) {
        const [id] = candidates;
        const current = published.find(p => p.id === id);
        if (own(personal.questionState, id)) {
          // Same published identity, not a second custom question. Preserve every conflict.
          recover('Duplicate published match; first personal state kept', location, q);
        } else {
          personal.questionState[id] = state;
          // Build-time Markdown formatting changes are not personal content edits.
          // Historical baselines are migration-only; they never supply the displayed answer.
          if (!matchesQuestionContent(q, current) && !matchesQuestionContent(q, baselines[id])) {
            recover('Differing/retired published content; latest published version displayed', location, q);
          }
        }
        summary.matched++;
      } else {
        // Location-derived IDs preserve duplicate custom entries and are deterministic on retry.
        const id = `custom-legacy-${ti}-${qi}`;
        const custom = { id, topicId: topic.id, q: q.q, a: q.a, d: ['e', 'm', 'h'].includes(q.d) ? q.d : 'e', freq: q.freq === true };
        if (typeof q.trap === 'string') custom.trap = q.trap;
        if (Array.isArray(q.cross)) custom.cross = q.cross.filter(c => typeof c === 'string');
        personal.customQuestions.push(custom);
        personal.questionState[id] = state;
        summary.custom++;
        recover(candidates.size ? 'Ambiguous question retained as custom' : 'Unmatched question retained as custom', location, q);
      }
    });
  });

  const oldTemplates = parse(LEGACY_KEYS[1], Array.isArray) || [];
  oldTemplates.forEach((t, index) => {
    const source = `${LEGACY_KEYS[1]}[${index}]`;
    if (!record(t) || !safeId(t.id)) { recover('Invalid template', source, t); return; }
    if (own(personal.templateState, t.id)) { recover('Duplicate template; first state kept', source, t); return; }
    const state = stateFor(t, source, TEMPLATE_STATUSES);
    state.attempts = Number.isSafeInteger(t.attempts) && t.attempts >= 0 ? t.attempts : 0;
    if (t.attempts !== undefined && state.attempts !== t.attempts) recover('Invalid attempts reset to zero', source, t);
    personal.templateState[t.id] = state;
    const current = templates.find(p => p.id === t.id);
    if (!current || Object.keys(t).some(k => !['notes', 'status', 'attempts'].includes(k) && JSON.stringify(t[k]) !== JSON.stringify(current[k]))) {
      recover('Differing/retired template content', source, t);
    }
  });
  const notes = parse(LEGACY_KEYS[2], record) || {};
  for (const [id, note] of Object.entries(notes)) {
    if (!safeId(id) || typeof note !== 'string') { recover('Invalid template note', LEGACY_KEYS[2], { id, note }); continue; }
    const state = personal.templateState[id] || { status: 'not_started', notes: '', attempts: 0 };
    if (state.notes && state.notes !== note) recover('Conflicting template note; separate note takes precedence', id, state.notes);
    personal.templateState[id] = { ...state, notes: note };
  }
  // Missing legacy entries NEVER become tombstones: restore all published content.
  return { personal: validatePersonal(personal), summary };
}

export function deriveTopics(topics, personal) {
  const hidden = new Set(personal.hiddenQuestionIds);
  return topics.map(topic => ({ ...topic, questions: [
    ...topic.questions.filter(q => !hidden.has(q.id)),
    ...personal.customQuestions.filter(q => q.topicId === topic.id && !hidden.has(q.id)),
  ].map(q => ({ ...q, notes: '', status: 'not-started', ...personal.questionState[q.id] })) }));
}

export function deriveTemplates(templates, personal) {
  return templates.map(t => ({ ...t, notes: '', status: 'not_started', attempts: 0, ...personal.templateState[t.id] }));
}

export function updateQuestion(personal, id, patch) {
  return { ...personal, questionState: { ...personal.questionState, [id]: { notes: '', status: 'not-started', ...personal.questionState[id], ...patch } } };
}

export function deleteQuestion(personal, id) {
  // Keep custom content and state too: a tombstone makes deletion reversible via a backup.
  return { ...personal, hiddenQuestionIds: [...new Set([...personal.hiddenQuestionIds, id])] };
}

export function updateTemplateStatus(personal, id, status) {
  const previous = personal.templateState[id] || { notes: '', status: 'not_started', attempts: 0 };
  if (status === previous.status) return personal;
  const attempts = status === 'practicing' ? Math.min(Number.MAX_SAFE_INTEGER, previous.attempts + 1) : previous.attempts;
  return { ...personal, templateState: { ...personal.templateState, [id]: { ...previous, status, attempts } } };
}

export function updateTemplateNote(personal, id, notes) {
  const previous = personal.templateState[id] || { notes: '', status: 'not_started', attempts: 0 };
  return { ...personal, templateState: { ...personal.templateState, [id]: { ...previous, notes } } };
}

function readLegacy(storage) {
  return Object.fromEntries(LEGACY_KEYS.map(key => [key, storage.getItem(key)]));
}

function archives(storage) {
  const result = [];
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (key?.startsWith(BACKUP_PREFIX)) result.push({ key, value: storage.getItem(key) });
  }
  return result.sort((a, b) => a.key.localeCompare(b.key));
}

function retainArchive(storage, value) {
  if (archives(storage).some(a => a.value === value)) return;
  let index = 0;
  while (storage.getItem(`${BACKUP_PREFIX}${index}`) !== null) index++;
  const key = `${BACKUP_PREFIX}${index}`;
  storage.setItem(key, value);
  assert(storage.getItem(key) === value, 'Backup could not be verified.');
}

// Reads only; safe in React Strict Mode. save() is the sole commit boundary.
export function openPersonalStore(storage, topics, templates, baselines = {}) {
  let expectedRaw;
  let legacy = Object.fromEntries(LEGACY_KEYS.map(key => [key, null]));
  let cachedArchives = [];
  let initial = emptyPersonal();
  let summary = null;
  let error = '';
  try {
    expectedRaw = storage.getItem(PERSONAL_KEY);
    legacy = readLegacy(storage);
    cachedArchives = archives(storage);
    if (expectedRaw !== null) initial = migratePersonal(JSON.parse(expectedRaw));
    else ({ personal: initial, summary } = migrateLegacy(legacy, topics, templates, LEGACY_REFERENCE, baselines));
  } catch (cause) { error = `Personal data could not be loaded: ${cause.message}`; }
  let blocked = Boolean(error);
  let pendingMigration = expectedRaw === null;
  return {
    personal: initial, summary, error,
    save(next) {
      assert(!blocked, 'Storage is read-only because existing data could not be loaded. Export a backup before recovery.');
      validatePersonal(next);
      assert(storage.getItem(PERSONAL_KEY) === expectedRaw, 'Data changed in another tab. Export your work and reload before saving.');
      if (expectedRaw && JSON.parse(expectedRaw).schemaVersion < 3 && next.schemaVersion === 3) {
        retainArchive(storage, JSON.stringify({ kind: 'personal-migration', personal: expectedRaw }));
      }
      if (pendingMigration && LEGACY_KEYS.some(k => legacy[k] !== null)) {
        assert(JSON.stringify(readLegacy(storage)) === JSON.stringify(legacy), 'Legacy data changed in another tab. Reload before migrating.');
        retainArchive(storage, JSON.stringify({ kind: 'legacy-migration', legacy }));
      }
      const serialized = JSON.stringify(next);
      if (serialized !== expectedRaw) {
        storage.setItem(PERSONAL_KEY, serialized);
        assert(storage.getItem(PERSONAL_KEY) === serialized, 'Personal data write could not be verified.');
        expectedRaw = serialized;
      }
      pendingMigration = false;
    },
    export(personal = initial) {
      let originals = legacy;
      let retained = cachedArchives;
      let originalPersonal = expectedRaw ?? null;
      let exportedPersonal = validatePersonal(personal);
      try {
        originals = readLegacy(storage);
        retained = archives(storage);
        originalPersonal = storage.getItem(PERSONAL_KEY);
      } catch (cause) {
        exportedPersonal = { ...personal, recovery: [...personal.recovery, {
          reason: 'Storage could not be read during export; available in-memory data and cached originals included',
          source: 'export', raw: JSON.stringify(cause.message),
        }] };
      }
      return JSON.stringify({ format: 'cs-learning-backup', version: 1, exportedAt: new Date().toISOString(),
        personal: exportedPersonal, legacy: originals, archives: retained,
        originalPersonal }, null, 2);
    },
    restore(text, inMemory = initial) {
      const backup = parseBackup(text);
      assert(storage.getItem(PERSONAL_KEY) === expectedRaw, 'Data changed in another tab. Reload before restoring.');
      // Validation finishes before any writes. The old current record is archived first.
      retainArchive(storage, JSON.stringify({ kind: 'before-restore', personal: expectedRaw ?? null, inMemory, legacy: readLegacy(storage) }));
      for (const archive of backup.archives) retainArchive(storage, archive.value);
      if (LEGACY_KEYS.some(k => backup.legacy[k] !== null) || backup.originalPersonal !== null) {
        retainArchive(storage, JSON.stringify({ kind: 'imported-originals', legacy: backup.legacy, personal: backup.originalPersonal }));
      }
      const restored = migratePersonal(backup.personal);
      const serialized = JSON.stringify(restored);
      storage.setItem(PERSONAL_KEY, serialized);
      assert(storage.getItem(PERSONAL_KEY) === serialized, 'Restore write could not be verified.');
      expectedRaw = serialized;
      pendingMigration = false;
      blocked = false;
      return restored;
    },
  };
}

export function parseBackup(text) {
  const b = JSON.parse(text);
  assert(record(b) && b.format === 'cs-learning-backup' && b.version === 1, 'Unsupported backup format/version.');
  assert(fields(b, ['format', 'version', 'exportedAt', 'personal', 'legacy', 'archives', 'originalPersonal']), 'Unknown backup fields.');
  validatePersonal(b.personal);
  assert(typeof b.exportedAt === 'string' && Number.isFinite(Date.parse(b.exportedAt)), 'Invalid export timestamp.');
  assert(record(b.legacy) && fields(b.legacy, LEGACY_KEYS) && LEGACY_KEYS.every(k => own(b.legacy, k)
    && (b.legacy[k] === null || typeof b.legacy[k] === 'string')), 'Invalid legacy backup values.');
  assert(b.originalPersonal === null || typeof b.originalPersonal === 'string', 'Invalid original personal backup.');
  assert(Array.isArray(b.archives) && b.archives.every(a => record(a) && fields(a, ['key', 'value'])
    && typeof a.key === 'string' && a.key.startsWith(BACKUP_PREFIX) && typeof a.value === 'string'), 'Invalid backup archives.');
  return b;
}
