/* ── Skybox Settings — Persistent Preferences ────────────────────
 *
 * Stores skybox auto-detection preferences in localStorage:
 *   - autoMode: whether to auto-detect environment
 *   - cameraEnabled: whether to use camera for ambient sensing
 *   - facingMode: which camera to use (front/back)
 *
 * Cross-component reactivity via useSyncExternalStore.
 * ─────────────────────────────────────────────────────────────────── */

'use client';

import { useCallback, useSyncExternalStore } from 'react';

const KEY = 'awareness-skybox-settings';

export interface SkyboxSettings {
  autoMode: boolean;
  cameraEnabled: boolean;
  facingMode: 'user' | 'environment';
}

const DEFAULT_SETTINGS: SkyboxSettings = {
  autoMode: true,       // auto-detect by default
  cameraEnabled: false,  // camera opt-in
  facingMode: 'environment',
};

// ── External store ──────────────────────────────────────────────────
const listeners = new Set<() => void>();
let snapshot: SkyboxSettings = DEFAULT_SETTINGS;

function init() {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) snapshot = { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch { /* ignore */ }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => { listeners.delete(cb); };
}

function getSnapshot() { return snapshot; }
function getServerSnapshot() { return DEFAULT_SETTINGS; }

function notify(settings: SkyboxSettings) {
  snapshot = settings;
  try {
    localStorage.setItem(KEY, JSON.stringify(settings));
  } catch { /* ignore */ }
  listeners.forEach((cb) => cb());
}

// Initialize on module load
if (typeof window !== 'undefined') init();

// ── Hook ────────────────────────────────────────────────────────────

export function useSkyboxSettings() {
  const settings = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const update = useCallback((partial: Partial<SkyboxSettings>) => {
    notify({ ...snapshot, ...partial });
  }, []);

  const toggleAuto = useCallback(() => {
    notify({ ...snapshot, autoMode: !snapshot.autoMode });
  }, []);

  const toggleCamera = useCallback(() => {
    notify({ ...snapshot, cameraEnabled: !snapshot.cameraEnabled });
  }, []);

  const cycleFacingMode = useCallback(() => {
    const next = snapshot.facingMode === 'environment' ? 'user' : 'environment';
    notify({ ...snapshot, facingMode: next });
  }, []);

  return { settings, update, toggleAuto, toggleCamera, cycleFacingMode };
}
