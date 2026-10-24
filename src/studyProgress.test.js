import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyPersonal, migratePersonal, validatePersonal } from './personalData.js';
import { studyStats } from './studyProgress.js';

test('v1 migrates without changing existing personal records', () => {
  const { completedLessonIds, studyDays, ...old } = emptyPersonal();
  assert.deepEqual(completedLessonIds, []);
  assert.deepEqual(studyDays, {});
  old.schemaVersion = 1;
  old.questionState['os-q001'] = { notes: 'Keep', status: 'mastered' };
  const migrated = migratePersonal(old);
  assert.equal(migrated.schemaVersion, 2);
  assert.deepEqual(migrated.questionState, old.questionState);
  assert.deepEqual(migratePersonal(migrated), migrated);
  assert.throws(() => validatePersonal({ ...migrated, studyDays: { '2026-02-30': 5 } }));
  assert.throws(() => validatePersonal({ ...migrated, completedLessonIds: ['a', 'a'] }));
});

test('streak tolerates today not started and breaks on missing days', () => {
  const personal = { ...emptyPersonal(), studyDays: { '2026-10-15': 60, '2026-10-14': 120, '2026-10-10': 30 } };
  assert.deepEqual(studyStats(personal, new Date(2026, 9, 16)), { streak: 2, seconds: 210, activeDays: 3 });
  assert.equal(studyStats(personal, new Date(2026, 9, 17)).streak, 0);
});
