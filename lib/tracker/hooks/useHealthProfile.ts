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
    fetch('/api/tracker/health')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => { setProfile(data); })
      .catch(err => {
        console.error('Failed to load health profile:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
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
