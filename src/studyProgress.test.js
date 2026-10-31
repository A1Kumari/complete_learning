import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyPersonal, migratePersonal, validatePersonal } from './personalData.js';
import { shouldTrackStudy, studyStats } from './studyProgress.js';

test('v1 migrates without changing existing personal records', () => {
  const { completedLessonIds, studyDays, completedStudyDays, ...old } = emptyPersonal();
  assert.deepEqual(completedLessonIds, []);
  assert.deepEqual(studyDays, {});
  assert.deepEqual(completedStudyDays, []);
  old.schemaVersion = 1;
  old.questionState['os-q001'] = { notes: 'Keep', status: 'mastered' };
  const migrated = migratePersonal(old);
  assert.equal(migrated.schemaVersion, 3);
  assert.deepEqual(migrated.questionState, old.questionState);
  assert.deepEqual(migratePersonal(migrated), migrated);
  assert.throws(() => validatePersonal({ ...migrated, studyDays: { '2026-02-30': 5 } }));
  assert.throws(() => validatePersonal({ ...migrated, completedLessonIds: ['a', 'a'] }));
});

test('streak tolerates today not started and breaks on missing days', () => {
  const personal = { ...emptyPersonal(), studyDays: { '2026-10-15': 60, '2026-10-14': 120, '2026-10-10': 30 }, completedStudyDays: ['2026-10-15', '2026-10-14', '2026-10-10'] };
  assert.deepEqual(studyStats(personal, new Date(2026, 9, 16)), { streak: 2, seconds: 210, activeDays: 3 });
  assert.equal(studyStats(personal, new Date(2026, 9, 17)).streak, 0);
});

test('study tracking is enabled only on non-loopback production hosts', () => {
  assert.equal(shouldTrackStudy(true, 'learning.vercel.app'), true);
  assert.equal(shouldTrackStudy(false, 'learning.vercel.app'), false);
  for (const host of ['localhost', 'app.localhost', '127.0.0.1', '[::1]', '0.0.0.0']) {
    assert.equal(shouldTrackStudy(true, host), false, host);
  }
});
