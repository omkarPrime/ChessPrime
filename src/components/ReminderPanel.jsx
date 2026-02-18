export default function ReminderPanel({ permission, supported, requestPermission, timerRunning }) {
  return (
    <section className="panel space-y-2">
      <h2 className="text-lg font-semibold text-slate-800">Smart Reminders</h2>
      {!supported && <p className="text-sm text-red-600">Notifications are not supported in this browser.</p>}
      <p className="text-sm text-slate-600">Permission: {permission}</p>
      <button className="btn-primary" onClick={requestPermission} disabled={!supported || permission === 'granted'}>
        Enable Notifications
      </button>
      <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
        <li>Break reminder after a Pomodoro study cycle.</li>
        <li>Daily study reminder is delivered at 9:00 AM while app is open.</li>
        <li>Overstudy warning appears after 4 hours of continuous study.</li>
        <li>Inactivity for 60 seconds pauses the timer automatically{timerRunning ? ' (active now).' : '.'}</li>
      </ul>
    </section>
  );
}
