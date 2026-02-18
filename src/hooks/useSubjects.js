import { useCallback, useEffect, useState } from 'react';
import { addRecord, deleteRecord, getAll, STORES, updateRecord } from '../data/db';

export function useSubjects() {
  const [subjects, setSubjects] = useState([]);

  const loadSubjects = useCallback(async () => {
    const all = await getAll(STORES.subjects);
    setSubjects(all.sort((a, b) => a.name.localeCompare(b.name)));
  }, []);

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  const addSubject = async (name, dailyTargetHours) => {
    await addRecord(STORES.subjects, {
      name,
      dailyTargetHours: Number(dailyTargetHours),
      createdAt: new Date().toISOString(),
    });
    await loadSubjects();
  };

  const updateSubject = async (subject) => {
    await updateRecord(STORES.subjects, subject);
    await loadSubjects();
  };

  const removeSubject = async (id) => {
    await deleteRecord(STORES.subjects, id);
    await loadSubjects();
  };

  return { subjects, addSubject, updateSubject, removeSubject, reloadSubjects: loadSubjects };
}
