'use client';

import { useState, useEffect, useCallback } from 'react';

interface Session {
  user_id: string;
  name: string;
  trust: string;
}

/**
 * Client-side session hook.
 * Checks /api/auth/session on mount. Returns null while loading,
 * the session payload when authenticated, or null when not.
 */
export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      console.log('[session] checking /api/auth/session...');
      const res = await fetch('/api/auth/session');
      console.log('[session] status:', res.status);
      if (res.ok) {
        const data = await res.json();
        console.log('[session] authenticated:', data.authenticated, 'user:', data.name);
        setSession(data.authenticated ? data : null);
      } else {
        console.log('[session] not ok, clearing session');
        setSession(null);
      }
    } catch (err) {
      console.error('[session] error:', err);
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setSession(null);
  }, []);

  return { session, loading, logout, refresh };
}
