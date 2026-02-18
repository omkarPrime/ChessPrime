import { useMemo, useState } from 'react';

export default function SubjectManager({ subjects, addSubject, updateSubject, sessions }) {
  const [name, setName] = useState('');
  const [target, setTarget] = useState(2);

  const progress = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return subjects.map((subject) => {
      const todayHours = sessions
        .filter((s) => s.subjectId === subject.id && s.date === today)
        .reduce((sum, s) => sum + s.durationMinutes / 60, 0);
      const percent = subject.dailyTargetHours ? Math.min(100, (todayHours / subject.dailyTargetHours) * 100) : 0;
      return { ...subject, todayHours, percent };
    });
  }, [sessions, subjects]);

  const onAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await addSubject(name.trim(), Number(target));
    setName('');
    setTarget(2);
  };

  return (
    <section className="panel space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">Subjects & Goals</h2>

      <form className="grid gap-2 sm:grid-cols-3" onSubmit={onAdd}>
        <input className="input sm:col-span-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="New subject name" />
        <input className="input" type="number" min="0.5" step="0.5" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="Daily target hours" />
        <button className="btn-primary sm:col-span-3" type="submit">Add Subject</button>
      </form>

      <div className="space-y-3">
        {progress.map((subject) => (
          <div key={subject.id} className="rounded-lg border border-slate-200 p-3">
            <div className="flex items-center justify-between gap-3">
              <strong>{subject.name}</strong>
              <label className="text-xs">Target (hrs)
                <input
                  className="input mt-1 w-20"
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={subject.dailyTargetHours}
                  onChange={(e) => updateSubject({ ...subject, dailyTargetHours: Number(e.target.value) })}
                />
              </label>
            </div>
            <div className="mt-2 h-2 rounded bg-slate-200">
              <div className="h-2 rounded bg-brand-600" style={{ width: `${subject.percent}%` }} />
            </div>
            <p className="mt-1 text-xs text-slate-600">
              {subject.todayHours.toFixed(2)}h / {subject.dailyTargetHours}h ({subject.percent.toFixed(0)}%)
            </p>
          </div>
        ))}
        {!subjects.length && <p className="text-sm text-slate-500">No subjects yet.</p>}
      </div>
    </section>
  );
}
