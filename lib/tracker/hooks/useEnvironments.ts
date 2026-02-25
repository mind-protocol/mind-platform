'use client';

import { useState, useEffect, useCallback } from 'react';
import { EnvironmentCapture } from '../types/environment';

/**
 * Resolve backend file URLs to frontend proxy URLs.
 * Converts `/uploads/environments/panoramas/file.jpg`
 *       to `/api/tracker/environments/file/panoramas/file.jpg`
 */
function resolveUrl(url: string): string {
  if (!url) return url;
  const prefix = '/uploads/environments/';
  if (url.startsWith(prefix)) {
    return '/api/tracker/environments/file/' + url.slice(prefix.length);
  }
  return url;
}

export function useEnvironments() {
  const [environments, setEnvironments] = useState<EnvironmentCapture[]>([]);
  const [active, setActiveEnv] = useState<EnvironmentCapture | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchEnvironments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tracker/environments');
      if (!res.ok) throw new Error('Failed to fetch environments');
      const json = await res.json();
      const raw: EnvironmentCapture[] = json.environments || [];
      // Resolve all file URLs through the proxy
      const data = raw.map((e) => ({ ...e, url: resolveUrl(e.url) }));
      setEnvironments(data);
      setActiveEnv(data.find((e) => e.active) ?? null);
    } catch {
      setEnvironments([]);
      setActiveEnv(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnvironments();
  }, [fetchEnvironments]);

  const upload = useCallback(
    async (
      file: File,
      name: string,
      source?: string,
      notes?: string,
      setActive?: boolean,
      geo?: { latitude: number; longitude: number; location_name?: string },
    ) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', name);
      if (source) formData.append('source', source);
      if (notes) formData.append('notes', notes);
      if (setActive) formData.append('set_active', 'true');
      if (geo) {
        formData.append('latitude', String(geo.latitude));
        formData.append('longitude', String(geo.longitude));
        if (geo.location_name) formData.append('location_name', geo.location_name);
      }

      const res = await fetch('/api/tracker/environments', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to upload environment');
      await fetchEnvironments();
      return res.json();
    },
    [fetchEnvironments],
  );

  const setActive = useCallback(
    async (id: string) => {
      const res = await fetch(`/api/tracker/environments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: true }),
      });
      if (!res.ok) throw new Error('Failed to set active environment');
      await fetchEnvironments();
    },
    [fetchEnvironments],
  );

  const remove = useCallback(
    async (id: string) => {
      const res = await fetch(`/api/tracker/environments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deleted: true }),
      });
      if (!res.ok) throw new Error('Failed to remove environment');
      await fetchEnvironments();
    },
    [fetchEnvironments],
  );

  const rename = useCallback(
    async (id: string, name: string) => {
      const res = await fetch(`/api/tracker/environments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error('Failed to rename environment');
      await fetchEnvironments();
    },
    [fetchEnvironments],
  );

  const suggestName = useCallback(
    async (file: File, geo?: { latitude: number; longitude: number }) => {
      const formData = new FormData();
      formData.append('file', file);
      if (geo) {
        formData.append('latitude', String(geo.latitude));
        formData.append('longitude', String(geo.longitude));
      }
      try {
        const res = await fetch('/api/tracker/environments/suggest-name', {
          method: 'POST',
          body: formData,
        });
        if (!res.ok) return null;
        return (await res.json()) as { suggested_name: string; location_hint: string };
      } catch {
        return null;
      }
    },
    [],
  );

  return { environments, active, loading, upload, setActive, remove, rename, suggestName };
}
