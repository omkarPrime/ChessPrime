export default function FocusOverlay({ enabled, timer, onExit }) {
  if (!enabled) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white">
      <h2 className="mb-3 text-2xl font-semibold">Focus Mode</h2>
      <p className="mb-6 text-sm text-slate-300">Navigation is disabled while timer is active.</p>
      <div className="mb-6 text-7xl font-bold">{timer.formattedTime}</div>
      <div className="flex gap-2">
        <button className="btn-primary" onClick={timer.pause}>Pause</button>
        <button className="btn-secondary" onClick={timer.stop}>Stop</button>
        {!timer.isRunning && <button className="btn-secondary" onClick={onExit}>Exit Focus Mode</button>}
      </div>
    </div>
  );
}
