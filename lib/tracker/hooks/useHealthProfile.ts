'use client';

import { useState, useEffect, useCallback } from 'react';
import type { MedicalProfile, GrowthPoint } from '../types/health';

const FETCH_TIMEOUT_MS = 20_000; // 20s — Render cold start can be slow

function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timer));
}

export function useHealthProfile(authenticated: boolean) {
  const [profile, setProfile] = useState<MedicalProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const load = useCallback(async () => {
    if (!authenticated) { setLoading(false); return; }
    setLoading(true);
    setError(null);

    try {
      const r = await fetchWithTimeout('/api/tracker/health', FETCH_TIMEOUT_MS);
      if (!r.ok) {
        const body = await r.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${r.status}`);
      }
      const data = await r.json();
      if (!data || !data.identity) {
        throw new Error('Invalid profile data');
      }
      setProfile(data);
    } catch (err) {
      const msg = err instanceof DOMException && err.name === 'AbortError'
        ? 'Request timed out — backend may be starting up'
        : err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [authenticated, retryCount]);

  useEffect(() => { load(); }, [load]);

  const retry = useCallback(() => {
    setRetryCount(c => c + 1);
  }, []);

  return { profile, loading, error, retry };
}

export function useGrowthData(authenticated: boolean) {
  const [points, setPoints] = useState<GrowthPoint[]>([]);
  const [dob, setDob] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authenticated) return;
    setLoading(true);
    fetchWithTimeout('/api/tracker/health?section=growth', FETCH_TIMEOUT_MS)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          setPoints(data.points || []);
          setDob(data.dob || '');
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [authenticated]);

  return { points, dob, loading };
}
