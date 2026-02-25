'use client';

import { useState, useEffect, useCallback, useRef, useSyncExternalStore } from 'react';

// ── localStorage key ────────────────────────────────────────────────────
const SKYBOX_KEY = 'awareness-skybox-360';

// ── External store for cross-component reactivity ───────────────────────
// Lets useSkybox360() consumers re-render when the skybox changes,
// even if the change originates from a different component instance.
const listeners = new Set<() => void>();
let snapshotUrl: string | null = null;

function initSnapshot() {
  if (typeof window === 'undefined') return;
  snapshotUrl = localStorage.getItem(SKYBOX_KEY);
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => { listeners.delete(cb); };
}

function getSnapshot() {
  return snapshotUrl;
}

function getServerSnapshot() {
  return null;
}

function notify(url: string | null) {
  snapshotUrl = url;
  listeners.forEach((cb) => cb());
}

// Initialize on module load (client only)
if (typeof window !== 'undefined') {
  initSnapshot();
}

// ── Hook: useSkybox360 ─────────────────────────────────────────────────
/**
 * Returns the current 360 skybox data URL (or null) and a setter.
 * Reactive across all consumers via useSyncExternalStore.
 */
export function useSkybox360() {
  const skyboxUrl = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setSkybox = useCallback((url: string | null) => {
    try {
      if (url) {
        localStorage.setItem(SKYBOX_KEY, url);
      } else {
        localStorage.removeItem(SKYBOX_KEY);
      }
    } catch (e) {
      console.warn('[useSkybox360] localStorage error:', e);
    }
    notify(url);
  }, []);

  return { skyboxUrl, setSkybox };
}

// ── Component: SkyboxUploader ──────────────────────────────────────────
const ACCEPTED = '.jpg,.jpeg,.png,.hdr,.exr,.webp';
const MAX_SIZE_MB = 10;

/**
 * Compact skybox upload button. Reads an equirectangular photo,
 * stores it as a base64 data URL in localStorage.
 */
export default function SkyboxUploader() {
  const { skyboxUrl, setSkybox } = useSkybox360();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(async (file: File) => {
    setError(null);

    // Size guard
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Max ${MAX_SIZE_MB}MB`);
      return;
    }

    setLoading(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      setSkybox(dataUrl);
    } catch {
      setError('Failed to read file');
    } finally {
      setLoading(false);
    }
  }, [setSkybox]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset so the same file can be re-selected
    if (fileRef.current) fileRef.current.value = '';
  }, [handleFile]);

  const handleRemove = useCallback(() => {
    setSkybox(null);
    setError(null);
  }, [setSkybox]);

  return (
    <div className="flex items-center gap-1.5">
      <input
        ref={fileRef}
        type="file"
        className="hidden"
        accept={ACCEPTED}
        onChange={handleChange}
      />

      {skyboxUrl ? (
        <>
          {/* Thumbnail dot indicating active skybox */}
          <button
            onClick={() => fileRef.current?.click()}
            disabled={loading}
            className="bg-zinc-900/80 backdrop-blur-sm border border-cyan-800/50 rounded-lg px-3 py-1.5 text-xs text-cyan-400 hover:text-cyan-300 hover:border-cyan-600 transition flex items-center gap-2 disabled:opacity-50"
            title="Change 360 skybox"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
            <span>Skybox</span>
          </button>
          <button
            onClick={handleRemove}
            className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-zinc-600 hover:text-red-400 hover:border-red-800/50 transition"
            title="Remove skybox"
          >
            x
          </button>
        </>
      ) : (
        <button
          onClick={() => fileRef.current?.click()}
          disabled={loading}
          className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-400 hover:text-white hover:border-zinc-600 transition flex items-center gap-2 disabled:opacity-50"
          title="Upload a 360 photo as skybox"
        >
          <span>Skybox</span>
        </button>
      )}

      {loading && (
        <span className="text-[10px] text-zinc-500 animate-pulse">Loading...</span>
      )}
      {error && (
        <span className="text-[10px] text-red-400">{error}</span>
      )}
    </div>
  );
}

// ── Helpers ─────────────────────────────────────────────────────────────
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('FileReader did not return a string'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
