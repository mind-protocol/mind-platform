'use client';

import { useState, useCallback, useRef, useSyncExternalStore } from 'react';
import {
  useSkyboxSettings,
  useEnvironmentDetection,
  type TimePhase,
} from '@/lib/tracker/skybox';

// ── localStorage key ────────────────────────────────────────────────────
const SKYBOX_KEY = 'awareness-skybox-360';

// ── External store for cross-component reactivity ───────────────────────
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

function getSnapshot() { return snapshotUrl; }
function getServerSnapshot() { return null; }

function notify(url: string | null) {
  snapshotUrl = url;
  listeners.forEach((cb) => cb());
}

if (typeof window !== 'undefined') initSnapshot();

// ── Hook: useSkybox360 ─────────────────────────────────────────────────
export function useSkybox360() {
  const skyboxUrl = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setSkybox = useCallback((url: string | null) => {
    try {
      if (url) localStorage.setItem(SKYBOX_KEY, url);
      else localStorage.removeItem(SKYBOX_KEY);
    } catch (e) {
      /* localStorage error — non-critical */
    }
    notify(url);
  }, []);

  return { skyboxUrl, setSkybox };
}

// ── Component: SkyboxUploader ──────────────────────────────────────────
const ACCEPTED = '.jpg,.jpeg,.png,.hdr,.exr,.webp';
const MAX_SIZE_MB = 10;

const PHASE_LABELS: Record<TimePhase, string> = {
  'night': 'Nuit',
  'dawn': 'Aube',
  'sunrise': 'Lever',
  'morning': 'Matin',
  'noon': 'Midi',
  'afternoon': 'Aprem',
  'golden-hour': 'Golden',
  'sunset': 'Coucher',
  'dusk': 'Crep.',
};

const PHASE_COLORS: Record<TimePhase, string> = {
  'night': '#4338ca',
  'dawn': '#7c3aed',
  'sunrise': '#f97316',
  'morning': '#eab308',
  'noon': '#fbbf24',
  'afternoon': '#f59e0b',
  'golden-hour': '#ea580c',
  'sunset': '#dc2626',
  'dusk': '#7c3aed',
};

export default function SkyboxUploader() {
  const { skyboxUrl, setSkybox } = useSkybox360();
  const { settings, toggleAuto, toggleCamera, cycleFacingMode } = useSkyboxSettings();
  const env = useEnvironmentDetection({
    cameraEnabled: settings.autoMode && settings.cameraEnabled,
    facingMode: settings.facingMode,
  });
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(async (file: File) => {
    setError(null);
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
    if (fileRef.current) fileRef.current.value = '';
  }, [handleFile]);

  const handleRemove = useCallback(() => {
    setSkybox(null);
    setError(null);
  }, [setSkybox]);

  return (
    <div className="flex flex-col gap-1.5">
      <input
        ref={fileRef}
        type="file"
        className="hidden"
        accept={ACCEPTED}
        onChange={handleChange}
      />

      {/* ── Row 1: Skybox upload + Auto toggle ─────────────────────── */}
      <div className="flex items-center gap-1.5">
        {skyboxUrl ? (
          <>
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

        {/* Auto mode toggle */}
        <button
          onClick={toggleAuto}
          className={`bg-zinc-900/80 backdrop-blur-sm border rounded-lg px-2.5 py-1.5 text-xs transition flex items-center gap-1.5 ${
            settings.autoMode
              ? 'border-emerald-800/50 text-emerald-400 hover:border-emerald-600'
              : 'border-zinc-800 text-zinc-600 hover:text-zinc-400 hover:border-zinc-600'
          }`}
          title={settings.autoMode ? 'Auto-detection ON — click to disable' : 'Enable auto skybox detection'}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${settings.autoMode ? 'bg-emerald-400' : 'bg-zinc-700'}`} />
          Auto
        </button>

        {/* Camera toggle (only when auto is on) */}
        {settings.autoMode && (
          <button
            onClick={toggleCamera}
            className={`bg-zinc-900/80 backdrop-blur-sm border rounded-lg px-2.5 py-1.5 text-xs transition flex items-center gap-1.5 ${
              settings.cameraEnabled
                ? 'border-violet-800/50 text-violet-400 hover:border-violet-600'
                : 'border-zinc-800 text-zinc-600 hover:text-zinc-400 hover:border-zinc-600'
            }`}
            title={settings.cameraEnabled ? 'Camera sensing ON — click to disable' : 'Enable camera ambient sensing'}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${settings.cameraEnabled ? 'bg-violet-400' : 'bg-zinc-700'}`} />
            Cam
          </button>
        )}

        {/* Camera facing mode (only when camera is active) */}
        {settings.autoMode && settings.cameraEnabled && (
          <button
            onClick={cycleFacingMode}
            className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-lg px-2 py-1.5 text-[10px] text-zinc-500 hover:text-zinc-300 hover:border-zinc-600 transition"
            title={`Camera: ${settings.facingMode === 'environment' ? 'Back' : 'Front'} — click to switch`}
          >
            {settings.facingMode === 'environment' ? 'Back' : 'Front'}
          </button>
        )}
      </div>

      {/* ── Row 2: Environment status (when auto mode is on) ─────── */}
      {settings.autoMode && (
        <div className="flex items-center gap-2 px-1">
          {/* Time phase badge */}
          <span
            className="text-[9px] font-mono px-1.5 py-0.5 rounded-full border"
            style={{
              color: PHASE_COLORS[env.sun.phase],
              borderColor: `${PHASE_COLORS[env.sun.phase]}30`,
              backgroundColor: `${PHASE_COLORS[env.sun.phase]}10`,
            }}
          >
            {PHASE_LABELS[env.sun.phase]}
          </span>

          {/* Indoor/outdoor indicator */}
          <span className={`text-[9px] font-mono ${env.isOutdoor ? 'text-sky-400' : 'text-amber-600'}`}>
            {env.isOutdoor ? 'Ext.' : 'Int.'}
          </span>

          {/* Skybox mode */}
          <span className="text-[9px] font-mono text-zinc-600">
            {env.skyboxMode === 'procedural-day' ? 'Ciel'
              : env.skyboxMode === 'procedural-night' ? 'Nuit'
              : env.skyboxMode === 'uploaded' ? 'Custom'
              : 'Yoga'}
          </span>

          {/* Camera stats (when available) */}
          {env.camera.isAvailable && (
            <>
              <span className="text-[8px] font-mono text-zinc-700" title="Luminance">
                L:{(env.camera.luminance * 100).toFixed(0)}%
              </span>
              <span className="text-[8px] font-mono text-zinc-700" title="Color temperature">
                {Math.round(env.camera.colorTempK / 100) * 100}K
              </span>
            </>
          )}

          {/* Confidence */}
          <span className="text-[8px] font-mono text-zinc-800" title="Detection confidence">
            {(env.confidence * 100).toFixed(0)}%
          </span>
        </div>
      )}

      {loading && (
        <span className="text-[10px] text-zinc-500 animate-pulse px-1">Loading...</span>
      )}
      {error && (
        <span className="text-[10px] text-red-400 px-1">{error}</span>
      )}
    </div>
  );
}

// ── Helpers ─────────────────────────────────────────────────────────────
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject(new Error('FileReader did not return a string'));
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
