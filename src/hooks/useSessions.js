import { useCallback, useEffect, useMemo, useState } from 'react';
import { addRecord, deleteRecord, getAll, STORES, updateRecord } from '../data/db';
import { calculateProductivityScore, calculateStreak, groupByPeriod, totalHoursBySubject } from '../utils/metrics';

export function useSessions(subjects) {
  const [sessions, setSessions] = useState([]);

  const loadSessions = useCallback(async () => {
    const all = await getAll(STORES.sessions);
    setSessions(all.sort((a, b) => new Date(b.startTime) - new Date(a.startTime)));
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const addSession = async (session) => {
    await addRecord(STORES.sessions, session);
    await loadSessions();
  };

  const updateSession = async (session) => {
    await updateRecord(STORES.sessions, session);
    await loadSessions();
  };

  const removeSession = async (id) => {
    await deleteRecord(STORES.sessions, id);
    await loadSessions();
  };

  const analytics = useMemo(() => {
    const withSubjectNames = sessions.map((s) => ({
      ...s,
      subjectName: subjects.find((sub) => sub.id === s.subjectId)?.name || 'Unassigned',
    }));

    return {
      daily: groupByPeriod(withSubjectNames, 'day'),
      weekly: groupByPeriod(withSubjectNames, 'week'),
      monthly: groupByPeriod(withSubjectNames, 'month'),
      bySubject: totalHoursBySubject(withSubjectNames),
      streak: calculateStreak(withSubjectNames),
      productivityScore: calculateProductivityScore(withSubjectNames),
    };
  }, [sessions, subjects]);

  return { sessions, addSession, updateSession, removeSession, reloadSessions: loadSessions, analytics };
}
