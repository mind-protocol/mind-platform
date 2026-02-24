'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { DependencyAnalysis } from '../types/dependencies';

const API_BASE = '/api/tracker/dependencies';
const POLL_INTERVAL = 30_000; // 30s auto-refresh for biometric data

export function useDependencies(token: string | null, days: number = 60) {
  const [data, setData] = useState<DependencyAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetch_ = useCallback(async (silent = false) => {
    if (!token) return;
    if (!silent) setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}?days=${days}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
      if (!res.ok) {
        if (res.status === 401) {
          setError('unauthorized');
          return;
        }
        throw new Error(`HTTP ${res.status}`);
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      if (!silent) setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      if (!silent) setLoading(false);
    }
  }, [token, days]);

  // Initial fetch
  useEffect(() => {
    fetch_();
  }, [fetch_]);

  // Auto-refresh polling for real-time biometric data
  useEffect(() => {
    if (!token) return;
    intervalRef.current = setInterval(() => fetch_(true), POLL_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [token, fetch_]);

  return { data, loading, error, refresh: () => fetch_(false) };
}
