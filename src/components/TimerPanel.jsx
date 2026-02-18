export default function TimerPanel({ timer, subjects }) {
  return (
    <section className="panel space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Study Timer</h2>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
          {timer.phase}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Mode</label>
          <select className="input" value={timer.mode} onChange={(e) => timer.setMode(e.target.value)}>
            <option value="pomodoro">Pomodoro</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Subject</label>
          <select className="input" value={timer.selectedSubjectId} onChange={(e) => timer.setSelectedSubjectId(e.target.value)}>
            <option value="">Unassigned</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>{subject.name}</option>
            ))}
          </select>
        </div>
      </div>

      {timer.mode === 'pomodoro' ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-medium">Study Minutes
            <input
              className="input mt-1"
              type="number"
              min="1"
              value={timer.studyMinutes}
              onChange={(e) => timer.setStudyMinutes(Number(e.target.value))}
            />
          </label>
          <label className="text-sm font-medium">Break Minutes
            <input
              className="input mt-1"
              type="number"
              min="1"
              value={timer.breakMinutes}
              onChange={(e) => timer.setBreakMinutes(Number(e.target.value))}
            />
          </label>
        </div>
      ) : (
        <label className="text-sm font-medium">Custom Minutes
          <input
            className="input mt-1"
            type="number"
            min="1"
            value={timer.customMinutes}
            onChange={(e) => timer.setCustomMinutes(Number(e.target.value))}
          />
        </label>
      )}

      <div className="rounded-xl bg-slate-900 p-6 text-center text-5xl font-bold text-white">
        {timer.formattedTime}
      </div>

      <div className="flex flex-wrap gap-2">
        <button className="btn-primary" onClick={timer.start}>Start</button>
        <button className="btn-secondary" onClick={timer.pause}>Pause</button>
        <button className="btn-secondary" onClick={timer.resume}>Resume</button>
        <button className="btn-secondary" onClick={timer.stop}>Stop</button>
      </div>
    </section>
  );
}
