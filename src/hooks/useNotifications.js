import { useCallback, useEffect, useState } from 'react';

export function useNotifications() {
  const [permission, setPermission] = useState(Notification.permission);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      return 'denied';
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, []);

  useEffect(() => {
    setPermission(Notification.permission);
  }, []);

  const sendNotification = useCallback((title, body) => {
    if (permission !== 'granted') return;
    const registration = navigator.serviceWorker?.ready;
    if (registration) {
      registration.then((reg) => reg.showNotification(title, { body, icon: '/icons/icon-192.svg' }));
      return;
    }
    new Notification(title, { body, icon: '/icons/icon-192.svg' });
  }, [permission]);

  return {
    permission,
    requestPermission,
    sendNotification,
    supported: 'Notification' in window,
  };
}
