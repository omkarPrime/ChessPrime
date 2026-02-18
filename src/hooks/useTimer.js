import { useEffect, useMemo, useRef, useState } from 'react';

const DEFAULT_POMODORO = {
  studyMinutes: 25,
  breakMinutes: 5,
};

export function useTimer({ onSessionCompleted, sendNotification }) {
  const [mode, setMode] = useState('pomodoro');
  const [studyMinutes, setStudyMinutes] = useState(DEFAULT_POMODORO.studyMinutes);
  const [breakMinutes, setBreakMinutes] = useState(DEFAULT_POMODORO.breakMinutes);
  const [customMinutes, setCustomMinutes] = useState(45);
  const [timeLeft, setTimeLeft] = useState(studyMinutes * 60);
  const [status, setStatus] = useState('idle');
  const [phase, setPhase] = useState('study');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');

  const intervalRef = useRef(null);
  const sessionStartRef = useRef(null);
  const elapsedInPhaseRef = useRef(0);
  const continuousStudySecondsRef = useRef(0);

  const activeDurationSeconds = useMemo(() => {
    if (mode === 'custom') return customMinutes * 60;
    return phase === 'study' ? studyMinutes * 60 : breakMinutes * 60;
  }, [mode, customMinutes, phase, studyMinutes, breakMinutes]);

  useEffect(() => {
    if (status === 'idle') {
      setTimeLeft(activeDurationSeconds);
    }
  }, [activeDurationSeconds, status]);

  useEffect(() => {
    if (status !== 'running') return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (mode === 'pomodoro' && phase === 'study') {
            sendNotification('Break reminder', 'Great work! Time for a break.');
            setPhase('break');
            setStatus('running');
            elapsedInPhaseRef.current = 0;
            return breakMinutes * 60;
          }

          completeSession();
          return 0;
        }

        elapsedInPhaseRef.current += 1;
        if (phase === 'study') {
          continuousStudySecondsRef.current += 1;
        }

        if (continuousStudySecondsRef.current === 4 * 60 * 60) {
          sendNotification('Overstudy warning', 'You have studied for over 4 hours continuously. Please rest.');
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  });

  const completeSession = () => {
    clearInterval(intervalRef.current);
    setStatus('idle');

    if (!sessionStartRef.current) return;

    const endTime = new Date();
    const durationMinutes = Math.max(
      0,
      Math.round((endTime.getTime() - sessionStartRef.current.getTime()) / 60000)
    );

    onSessionCompleted({
      subjectId: selectedSubjectId ? Number(selectedSubjectId) : null,
      mode,
      studyMinutes,
      breakMinutes,
      customMinutes,
      durationMinutes,
      startTime: sessionStartRef.current.toISOString(),
      endTime: endTime.toISOString(),
      date: endTime.toISOString().slice(0, 10),
      completed: true,
    });

    sessionStartRef.current = null;
    elapsedInPhaseRef.current = 0;
    continuousStudySecondsRef.current = 0;
    setPhase('study');
    setTimeLeft(mode === 'custom' ? customMinutes * 60 : studyMinutes * 60);
  };

  const start = () => {
    if (status === 'running') return;
    setStatus('running');
    if (!sessionStartRef.current) {
      sessionStartRef.current = new Date();
    }
  };

  const pause = () => {
    if (status !== 'running') return;
    clearInterval(intervalRef.current);
    setStatus('paused');
  };

  const resume = () => {
    if (status !== 'paused') return;
    setStatus('running');
  };

  const stop = () => {
    clearInterval(intervalRef.current);
    setStatus('idle');
    sessionStartRef.current = null;
    elapsedInPhaseRef.current = 0;
    continuousStudySecondsRef.current = 0;
    setPhase('study');
    setTimeLeft(mode === 'custom' ? customMinutes * 60 : studyMinutes * 60);
  };

  const autoPauseForInactivity = () => {
    if (status === 'running') {
      pause();
      sendNotification('Timer paused', 'Timer paused due to 60 seconds of inactivity.');
    }
  };

  const formattedTime = useMemo(() => {
    const mins = Math.floor(timeLeft / 60)
      .toString()
      .padStart(2, '0');
    const secs = Math.floor(timeLeft % 60)
      .toString()
      .padStart(2, '0');
    return `${mins}:${secs}`;
  }, [timeLeft]);

  return {
    mode,
    setMode,
    studyMinutes,
    setStudyMinutes,
    breakMinutes,
    setBreakMinutes,
    customMinutes,
    setCustomMinutes,
    timeLeft,
    formattedTime,
    status,
    phase,
    selectedSubjectId,
    setSelectedSubjectId,
    start,
    pause,
    resume,
    stop,
    autoPauseForInactivity,
    isRunning: status === 'running',
  };
}
