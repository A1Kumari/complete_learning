export function localDay(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function studyStats(personal, now = new Date()) {
  const days = personal.studyDays || {};
  const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);
  if (!days[localDay(cursor)]) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (days[localDay(cursor)]) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  const seconds = Object.values(days).reduce((sum, value) => sum + value, 0);
  return { streak, seconds, activeDays: Object.keys(days).length };
}
