function getWeekKey(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${weekNo.toString().padStart(2, '0')}`;
}

export function groupByPeriod(sessions, period) {
  const map = new Map();

  sessions.forEach((session) => {
    const date = new Date(session.startTime);
    let key = session.date;
    if (period === 'week') key = getWeekKey(date);
    if (period === 'month') key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    map.set(key, (map.get(key) || 0) + session.durationMinutes / 60);
  });

  return Array.from(map.entries())
    .map(([label, value]) => ({ label, value: Number(value.toFixed(2)) }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function totalHoursBySubject(sessions) {
  const map = new Map();
  sessions.forEach((session) => {
    map.set(
      session.subjectName,
      (map.get(session.subjectName) || 0) + session.durationMinutes / 60
    );
  });

  return Array.from(map.entries()).map(([label, value]) => ({
    label,
    value: Number(value.toFixed(2)),
  }));
}

export function calculateStreak(sessions) {
  const dates = new Set(sessions.map((session) => session.date));
  let streak = 0;
  const cursor = new Date();

  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if (dates.has(key)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export function calculateProductivityScore(sessions) {
  if (!sessions.length) return 0;

  const hours = sessions.reduce((sum, s) => sum + s.durationMinutes / 60, 0);
  const avgSession = hours / sessions.length;
  const consistency = Math.min(1, calculateStreak(sessions) / 14);
  const completionRate = sessions.filter((s) => s.completed).length / sessions.length;

  return Math.round((avgSession * 20 + consistency * 40 + completionRate * 40) * 10) / 10;
}
