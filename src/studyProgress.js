export function localDay(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// Only deployed builds on non-loopback hosts should accumulate study activity.
export function shouldTrackStudy(isProduction, hostname) {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, '');
  return isProduction && host !== 'localhost' && !host.endsWith('.localhost') && host !== '::1' && !host.startsWith('127.') && host !== '0.0.0.0';
}

export function studyStats(personal, now = new Date()) {
  const days = personal.completedStudyDays || [];
  const activityDays = personal.studyDays || {};
  const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);
  const completed = new Set(days);
  if (!completed.has(localDay(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (completed.has(localDay(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  const seconds = Object.values(activityDays).reduce((sum, value) => sum + value, 0);
  return { streak, seconds, activeDays: days.length };
}
