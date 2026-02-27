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
      const res = await fetch('/api/auth/session');
      if (res.ok) {
        const data = await res.json();
        setSession(data.authenticated ? data : null);
      } else {
        setSession(null);
      }
    } catch {
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
