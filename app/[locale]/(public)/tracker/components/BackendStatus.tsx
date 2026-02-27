'use client';

import { useEffect, useState } from 'react';

type Status = 'online' | 'degraded' | 'offline' | 'checking';

export default function BackendStatus() {
  const [status, setStatus] = useState<Status>('checking');
  const [lastCheck, setLastCheck] = useState<number>(0);

  useEffect(() => {
    let mounted = true;

    const check = async () => {
      try {
        const res = await fetch('/api/house');
        if (!mounted) return;
        if (!res.ok) { setStatus('offline'); return; }
        const data = await res.json();
        if (data.offline) {
          setStatus('offline');
        } else if (data.neon && Object.keys(data.neon).length > 0) {
          setStatus('online');
        } else {
          setStatus('degraded');
        }
      } catch {
        if (mounted) setStatus('offline');
      }
      if (mounted) setLastCheck(Date.now());
    };

    check();
    const interval = setInterval(check, 30_000); // check every 30s
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  // Don't show anything while checking or when online
  if (status === 'checking' || status === 'online') return null;

  return (
    <div className={`rounded-lg px-3 py-2 text-xs font-mono flex items-center gap-2 ${
      status === 'offline'
        ? 'bg-red-500/5 border border-red-500/20 text-red-400'
        : 'bg-amber-500/5 border border-amber-500/20 text-amber-400'
    }`}>
      <span className={`w-2 h-2 rounded-full ${
        status === 'offline' ? 'bg-red-500' : 'bg-amber-500'
      }`} />
      {status === 'offline' ? (
        <span>Backend offline — data may be stale. Logging will resume when connection restores.</span>
      ) : (
        <span>Limited connectivity — biometrics temporarily unavailable.</span>
      )}
    </div>
  );
}
