'use client';

import { useState, useEffect, useCallback } from 'react';
import type { MedicalProfile, GrowthPoint } from '../types/health';

const STORAGE_KEY = 'health_access_token';

export function useHealthAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) setToken(saved);
  }, []);

  const authenticate = useCallback(async (passphrase: string) => {
    setError('');
    try {
      const res = await fetch('/api/tracker/health', {
        headers: { 'Authorization': `Bearer ${passphrase}` },
      });
      if (res.ok) {
        sessionStorage.setItem(STORAGE_KEY, passphrase);
        setToken(passphrase);
        return true;
      }
      setError('Clé invalide');
      return false;
    } catch {
      setError('Service indisponible');
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setToken(null);
  }, []);

  return { token, error, authenticate, logout };
}

export function useHealthProfile(token: string | null) {
  const [profile, setProfile] = useState<MedicalProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch('/api/tracker/health', {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setProfile(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  return { profile, loading };
}

export function useGrowthData(token: string | null) {
  const [points, setPoints] = useState<GrowthPoint[]>([]);
  const [dob, setDob] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch('/api/tracker/health?section=growth', {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          setPoints(data.points || []);
          setDob(data.dob || '');
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  return { points, dob, loading };
}
