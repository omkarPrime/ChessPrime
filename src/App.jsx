import { useEffect, useMemo, useState } from 'react';
import AnalyticsPanel from './components/AnalyticsPanel';
import FocusOverlay from './components/FocusOverlay';
import HistoryPanel from './components/HistoryPanel';
import ReminderPanel from './components/ReminderPanel';
import SubjectManager from './components/SubjectManager';
import TimerPanel from './components/TimerPanel';
import { useInactivity } from './hooks/useInactivity';
import { useNotifications } from './hooks/useNotifications';
import { useSessions } from './hooks/useSessions';
import { useSubjects } from './hooks/useSubjects';
import { useTimer } from './hooks/useTimer';

const tabs = ['dashboard', 'analytics', 'history'];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [focusMode, setFocusMode] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  const { subjects, addSubject, updateSubject } = useSubjects();
  const { sessions, addSession, updateSession, removeSession, analytics } = useSessions(subjects);
  const { permission, requestPermission, sendNotification, supported } = useNotifications();

  const timer = useTimer({
    onSessionCompleted: addSession,
    sendNotification,
  });

  useInactivity(timer.autoPauseForInactivity, 60000, timer.isRunning);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 9 && now.getMinutes() === 0) {
        sendNotification('Daily Study Reminder', 'Set your FocusForge timer and hit your study goals today.');
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [sendNotification]);

  useEffect(() => {
    if (timer.isRunning) {
      setFocusMode(true);
    }
  }, [timer.isRunning]);

  const installPwa = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  const dashboard = useMemo(() => (
    <div className="grid gap-4 xl:grid-cols-2">
      <div className="space-y-4">
        <TimerPanel timer={timer} subjects={subjects} />
        <ReminderPanel
          permission={permission}
          supported={supported}
          requestPermission={requestPermission}
          timerRunning={timer.isRunning}
        />
      </div>
      <SubjectManager
        subjects={subjects}
        addSubject={addSubject}
        updateSubject={updateSubject}
        sessions={sessions}
      />
    </div>
  ), [timer, subjects, permission, supported, requestPermission, addSubject, updateSubject, sessions]);

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-brand-700 px-4 py-3 text-white shadow-md">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-2">
          <h1 className="text-xl font-bold">FocusForge Study Tracker</h1>
          <div className="flex items-center gap-2">
            <button className="btn-secondary" onClick={installPwa} disabled={!deferredPrompt}>Install App</button>
            <button className="btn-secondary" onClick={() => setFocusMode(true)} disabled={!timer.isRunning}>Enter Focus Mode</button>
          </div>
        </div>
      </header>

      {!focusMode && (
        <nav className="mx-auto flex w-full max-w-7xl gap-2 px-4 py-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`btn ${activeTab === tab ? 'bg-brand-600 text-white' : 'bg-white text-slate-700'}`}
              onClick={() => setActiveTab(tab)}
              disabled={timer.isRunning && tab !== activeTab}
            >
              {tab}
            </button>
          ))}
        </nav>
      )}

      <main className="mx-auto w-full max-w-7xl px-4 pb-8">
        {activeTab === 'dashboard' && dashboard}
        {activeTab === 'analytics' && <AnalyticsPanel analytics={analytics} />}
        {activeTab === 'history' && (
          <HistoryPanel
            sessions={sessions}
            subjects={subjects}
            updateSession={updateSession}
            removeSession={removeSession}
          />
        )}
      </main>

      <FocusOverlay enabled={focusMode} timer={timer} onExit={() => setFocusMode(false)} />
    </div>
  );
}
