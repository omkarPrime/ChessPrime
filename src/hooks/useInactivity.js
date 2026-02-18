import { useEffect, useRef } from 'react';

export function useInactivity(onInactive, timeoutMs = 60000, enabled = true) {
  const timerRef = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;

    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onInactive();
      }, timeoutMs);
    };

    const events = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [enabled, onInactive, timeoutMs]);
}
