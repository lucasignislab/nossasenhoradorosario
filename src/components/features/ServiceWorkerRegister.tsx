'use client';

import { useEffect } from 'react';

/** Registra o service worker do PWA (apenas em produção/https). */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    if (process.env.NODE_ENV !== 'production') return;
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Falha silenciosa: o site continua funcionando normalmente.
    });
  }, []);

  return null;
}
