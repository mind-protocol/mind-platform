'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface VersionInfo {
  hash: string;
  message: string;
  author: string;
  date: string;
  branch: string;
  filesChanged: { file: string; changes: string }[];
  ts: number;
}

const POLL_INTERVAL_MS = 30_000; // 30 seconds

export function useVersionCheck() {
  const [current, setCurrent] = useState<VersionInfo | null>(null);
  const [update, setUpdate] = useState<VersionInfo | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const knownHash = useRef<string | null>(null);

  const fetchVersion = useCallback(async () => {
    try {
      const res = await fetch('/api/version', { cache: 'no-store' });
      if (!res.ok) return;
      const data: VersionInfo = await res.json();

      if (!knownHash.current) {
        // First fetch — store as current, no toast
        knownHash.current = data.hash;
        setCurrent(data);
      } else if (data.hash !== knownHash.current) {
        // New version detected
        setUpdate(data);
        setDismissed(false);
      }
    } catch {
      // silent — network errors are expected
    }
  }, []);

  const dismiss = useCallback(() => {
    setDismissed(true);
  }, []);

  const applyUpdate = useCallback(() => {
    if (update) {
      knownHash.current = update.hash;
      setCurrent(update);
      setUpdate(null);
      setDismissed(false);
      window.location.reload();
    }
  }, [update]);

  useEffect(() => {
    fetchVersion();
    const id = setInterval(fetchVersion, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [fetchVersion]);

  return {
    current,
    update: dismissed ? null : update,
    dismiss,
    applyUpdate,
  };
}
