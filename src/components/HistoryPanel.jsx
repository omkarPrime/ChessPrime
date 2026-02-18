import { useState } from 'react';

export default function HistoryPanel({ sessions, subjects, updateSession, removeSession }) {
  const [editingId, setEditingId] = useState(null);
  const [duration, setDuration] = useState('');

  const beginEdit = (session) => {
    setEditingId(session.id);
    setDuration(session.durationMinutes);
  };

  const saveEdit = async (session) => {
    await updateSession({ ...session, durationMinutes: Number(duration) });
    setEditingId(null);
    setDuration('');
  };

  return (
    <section className="panel space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">Session History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="p-2">Date</th>
              <th className="p-2">Subject</th>
              <th className="p-2">Mode</th>
              <th className="p-2">Duration (min)</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => {
              const subject = subjects.find((s) => s.id === session.subjectId)?.name || 'Unassigned';
              return (
                <tr className="border-b border-slate-100" key={session.id}>
                  <td className="p-2">{session.date}</td>
                  <td className="p-2">{subject}</td>
                  <td className="p-2">{session.mode}</td>
                  <td className="p-2">
                    {editingId === session.id ? (
                      <input className="input w-24" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
                    ) : session.durationMinutes}
                  </td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      {editingId === session.id ? (
                        <button className="btn-secondary" onClick={() => saveEdit(session)}>Save</button>
                      ) : (
                        <button className="btn-secondary" onClick={() => beginEdit(session)}>Edit</button>
                      )}
                      <button className="btn-secondary" onClick={() => removeSession(session.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {!sessions.length && <p className="text-sm text-slate-500">No sessions recorded yet.</p>}
    </section>
  );
}
