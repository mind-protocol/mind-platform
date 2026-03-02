'use client';

import { useState, useEffect } from 'react';
import type { MedicalProfile, GrowthPoint } from '../types/health';

export function useHealthProfile(authenticated: boolean) {
  const [profile, setProfile] = useState<MedicalProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authenticated) { setLoading(false); return; }
    setLoading(true);
    console.log('[health] fetching /api/tracker/health...');
    fetch('/api/tracker/health')
      .then(r => {
        console.log('[health] response status:', r.status);
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => {
        console.log('[health] data loaded, keys:', Object.keys(data));
        setProfile(data);
      })
      .catch(err => {
        console.error('[health] Failed to load:', err);
        setError(err.message);
      })
      .finally(() => {
        console.log('[health] loading complete');
        setLoading(false);
      });
  }, [authenticated]);

  return { profile, loading, error };
}

export function useGrowthData(authenticated: boolean) {
  const [points, setPoints] = useState<GrowthPoint[]>([]);
  const [dob, setDob] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authenticated) return;
    setLoading(true);
    fetch('/api/tracker/health?section=growth')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          setPoints(data.points || []);
          setDob(data.dob || '');
        }
      })
      .catch(() => { console.error('Failed to load growth data'); })
      .finally(() => setLoading(false));
  }, [authenticated]);

  return { points, dob, loading };
}
