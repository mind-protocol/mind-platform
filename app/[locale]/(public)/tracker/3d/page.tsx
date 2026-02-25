'use client';

import { useState, useEffect, useCallback, useRef, useTransition } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import SanitizeToggle from '@/components/SanitizeToggle';
import { useAwarenessState } from '@/lib/tracker/hooks/useAwarenessState';
import { useCockpitState } from '@/lib/tracker/hooks/useCockpitState';
import { useInput, type Gesture } from '@/lib/tracker/cockpit';
import RangeSelector from './components/RangeSelector';
import Legend from './components/Legend';
import EnvironmentManager from '../components/EnvironmentManager';
import SkyboxUploader from './components/SkyboxUploader';
import { useKeyboardSound } from '@/lib/tracker/hooks/useKeyboardSound';
import { KEYBOARD_DEBUG } from '@/lib/tracker/hooks/useKeyboardReactive';
import type { RegionId } from './components/CockpitRegions';

const TemporalScene = dynamic(
  () => import('./components/TemporalScene'),
  { ssr: false },
);

const AwarenessMirror = dynamic(
  () => import('./components/AwarenessMirror'),
  { ssr: false },
);

const AwarenessHUD = dynamic(
  () => import('./components/AwarenessMirror').then(m => ({ default: m.AwarenessHUD })),
  { ssr: false },
);

const FloatingKeyboardOverlay = dynamic(
  () => import('./components/FloatingKeyboardOverlay'),
  { ssr: false },
);

const MusicAwarenessPanel = dynamic(
  () => import('./components/MusicAwarenessPanel'),
  { ssr: false },
);

const DirectionMap = dynamic(
  () => import('./components/DirectionMap'),
  { ssr: false },
);

const CockpitRegions = dynamic(
  () => import('./components/CockpitRegions'),
  { ssr: false },
);

type ViewMode = 'mirror' | 'timeline';

// ── Image adjustment types & defaults ──────────────────────────────────
interface ImageAdjustments {
  brightness: number;
  exposure: number;
  contrast: number;
  highlights: number;
  shadows: number;
  saturation: number;
  vignette: number;
  warmth: number;
  tint: number;
  sharpness: number;
}

const DEFAULT_ADJUSTMENTS: ImageAdjustments = {
  brightness: 0,
  exposure: 0,
  contrast: 0,
  highlights: 0,
  shadows: 0,
  saturation: 0,
  vignette: 0,
  warmth: 0,
  tint: 0,
  sharpness: 0,
};

const ADJUSTMENT_LABELS: Record<keyof ImageAdjustments, string> = {
  brightness: 'Brightness',
  exposure: 'Exposure',
  contrast: 'Contrast',
  highlights: 'Highlights',
  shadows: 'Shadows',
  saturation: 'Saturation',
  vignette: 'Vignette',
  warmth: 'Warmth',
  tint: 'Tint',
  sharpness: 'Sharpness',
};

const PRESETS: { name: string; values: ImageAdjustments }[] = [
  { name: 'Raw', values: { ...DEFAULT_ADJUSTMENTS } },
  {
    name: 'Cinematic',
    values: { brightness: -5, exposure: -3, contrast: 15, highlights: -10, shadows: 10, saturation: -12, vignette: 40, warmth: 15, tint: 0, sharpness: 5 },
  },
  {
    name: 'Neon',
    values: { brightness: 5, exposure: 5, contrast: 25, highlights: 15, shadows: -5, saturation: 35, vignette: 0, warmth: -20, tint: 10, sharpness: 15 },
  },
  {
    name: 'Dream',
    values: { brightness: 8, exposure: 5, contrast: -15, highlights: 10, shadows: 20, saturation: -5, vignette: 25, warmth: 12, tint: -5, sharpness: -10 },
  },
  {
    name: 'Clinical',
    values: { brightness: 3, exposure: 0, contrast: 20, highlights: 5, shadows: -10, saturation: -25, vignette: 0, warmth: -10, tint: 0, sharpness: 25 },
  },
  {
    name: 'Ethereal',
    values: { brightness: 10, exposure: 8, contrast: -10, highlights: 20, shadows: 15, saturation: 10, vignette: 15, warmth: 5, tint: 15, sharpness: -5 },
  },
];

const STORAGE_KEY = 'awareness-mirror-adjustments';
const CUSTOM_PRESETS_KEY = 'awareness-mirror-custom-presets';

function loadAdjustments(): ImageAdjustments {
  if (typeof window === 'undefined') return { ...DEFAULT_ADJUSTMENTS };
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...DEFAULT_ADJUSTMENTS, ...JSON.parse(saved) };
  } catch { /* ignore */ }
  return { ...DEFAULT_ADJUSTMENTS };
}

function buildFilterStyle(adj: ImageAdjustments): React.CSSProperties {
  // Map -100..+100 values to CSS filter functions
  const brightness = 1 + (adj.brightness + adj.exposure * 0.5) / 100;
  const contrast = 1 + adj.contrast / 100;
  const saturate = 1 + adj.saturation / 100;
  // Warmth: positive = warm (sepia shift), negative = cool (blue shift via hue-rotate)
  const sepia = Math.max(0, adj.warmth / 100) * 0.3;
  const hueRotate = adj.tint * 1.8; // -100..+100 → -180..+180 degrees
  // Sharpness: slight contrast micro-boost
  const sharpContrast = 1 + Math.max(0, adj.sharpness) / 400;
  // Highlights/shadows: use brightness micro-adjustments
  const highlightBrightness = 1 + adj.highlights / 300;
  const shadowBrightness = 1 + adj.shadows / 300;

  const totalBrightness = brightness * highlightBrightness * shadowBrightness;
  const totalContrast = contrast * sharpContrast;
  // Coolness via hue-rotate when warmth is negative
  const warmHue = adj.warmth < 0 ? adj.warmth * 0.3 : 0;

  const filters = [
    `brightness(${totalBrightness.toFixed(3)})`,
    `contrast(${totalContrast.toFixed(3)})`,
    `saturate(${saturate.toFixed(3)})`,
    sepia > 0 ? `sepia(${sepia.toFixed(3)})` : '',
    (hueRotate + warmHue) !== 0 ? `hue-rotate(${(hueRotate + warmHue).toFixed(1)}deg)` : '',
  ].filter(Boolean).join(' ');

  return { filter: filters || 'none' };
}

// ── Adjustment Panel Component ─────────────────────────────────────────
function AdjustmentPanel({
  adjustments,
  onChange,
  onPreview,
  onSave,
  onReset,
  onCancel,
  chromeVisible = true,
}: {
  adjustments: ImageAdjustments;
  onChange: (adj: ImageAdjustments) => void;
  onPreview: (adj: ImageAdjustments) => void;
  onSave: () => void;
  onReset: () => void;
  onCancel: () => void;
  chromeVisible?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [saveConfirm, setSaveConfirm] = useState(false);
  const [showSaveAs, setShowSaveAs] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [customPresets, setCustomPresets] = useState<{ name: string; values: ImageAdjustments }[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(CUSTOM_PRESETS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // ── Local draft state for sliders — avoids re-rendering parent ────────
  // During drag: update local draft + DOM preview (zero React re-renders on parent)
  // On release: commit draft to parent via onChange (single re-render)
  const [draft, setDraft] = useState<ImageAdjustments>(adjustments);
  const draftRef = useRef<ImageAdjustments>(adjustments);

  // Sync draft when parent adjustments change (preset, reset, cancel)
  useEffect(() => {
    setDraft(adjustments);
    draftRef.current = adjustments;
  }, [adjustments]);

  const handleSliderInput = (key: keyof ImageAdjustments, value: number) => {
    const next = { ...draftRef.current, [key]: value };
    draftRef.current = next;
    setDraft(next); // local re-render only (panel sliders)
    onPreview(next); // direct DOM update on canvas (no React)
  };

  const handleSliderCommit = () => {
    // Commit via startTransition so the heavy 3D re-render is non-blocking
    requestAnimationFrame(() => {
      onChange(draftRef.current);
      setActivePreset(null);
    });
  };

  const applyPreset = (preset: { name: string; values: ImageAdjustments }) => {
    onChange({ ...preset.values });
    setActivePreset(preset.name);
  };

  const handleSave = () => {
    onSave();
    setSaveConfirm(true);
    setTimeout(() => setSaveConfirm(false), 2000);
  };

  const handleSaveAsPreset = () => {
    if (!presetName.trim()) return;
    const newPreset = { name: presetName.trim(), values: { ...adjustments } };
    const updated = [...customPresets.filter(p => p.name !== newPreset.name), newPreset];
    setCustomPresets(updated);
    localStorage.setItem(CUSTOM_PRESETS_KEY, JSON.stringify(updated));
    setActivePreset(newPreset.name);
    setShowSaveAs(false);
    setPresetName('');
    // Also save as current
    onSave();
    setSaveConfirm(true);
    setTimeout(() => setSaveConfirm(false), 2000);
  };

  const deleteCustomPreset = (name: string) => {
    const updated = customPresets.filter(p => p.name !== name);
    setCustomPresets(updated);
    localStorage.setItem(CUSTOM_PRESETS_KEY, JSON.stringify(updated));
    if (activePreset === name) setActivePreset(null);
  };

  const isDefault = Object.entries(adjustments).every(
    ([k, v]) => v === DEFAULT_ADJUSTMENTS[k as keyof ImageAdjustments]
  );

  const allPresets = [...PRESETS, ...customPresets];

  return (
    <>
      {/* Toggle button — right edge, vertically centered */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed right-0 top-1/2 -translate-y-1/2 z-[60] px-1.5 py-4 rounded-l-lg border border-r-0 transition-all duration-500 ${
          open
            ? 'bg-purple-500/20 border-purple-500/30 text-purple-400'
            : 'bg-zinc-900/80 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/80'
        } ${!open && !chromeVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        title="Image adjustments"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full z-[55] transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full w-64 bg-zinc-950/95 backdrop-blur-md border-l border-zinc-800 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-4 pt-4 pb-2 border-b border-zinc-800/50">
            <div className="text-xs uppercase tracking-wider text-zinc-500 font-medium">Adjustments</div>
          </div>

          {/* Presets */}
          <div className="px-4 py-3 border-b border-zinc-800/50">
            <div className="text-[10px] uppercase tracking-wider text-zinc-600 mb-2">Presets</div>
            <div className="flex flex-wrap gap-1.5">
              {allPresets.map((p) => {
                const isCustom = customPresets.some(c => c.name === p.name);
                return (
                  <button
                    key={p.name}
                    onClick={() => applyPreset(p)}
                    onContextMenu={isCustom ? (e) => { e.preventDefault(); deleteCustomPreset(p.name); } : undefined}
                    className={`px-2 py-1 rounded text-[10px] border transition ${
                      activePreset === p.name
                        ? 'border-purple-500/50 text-purple-400 bg-purple-500/10'
                        : isCustom
                          ? 'border-cyan-800/50 text-cyan-500 hover:text-cyan-300 hover:border-cyan-700'
                          : 'border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'
                    }`}
                    title={isCustom ? 'Right-click to delete' : undefined}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sliders */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-hide">
            {(Object.keys(ADJUSTMENT_LABELS) as (keyof ImageAdjustments)[]).map((key) => {
              const extended = key === 'vignette' || key === 'warmth';
              const min = extended ? -200 : -100;
              const max = extended ? 200 : 100;
              return (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] text-zinc-500">{ADJUSTMENT_LABELS[key]}</label>
                  <span className="text-[10px] font-mono text-zinc-600 w-8 text-right">
                    {draft[key] > 0 ? '+' : ''}{draft[key]}
                  </span>
                </div>
                <input
                  type="range"
                  min={min}
                  max={max}
                  step={1}
                  value={draft[key]}
                  onChange={(e) => handleSliderInput(key, Number(e.target.value))}
                  onPointerUp={handleSliderCommit}
                  onKeyUp={(e) => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') handleSliderCommit(); }}
                  className="w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-400
                    [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3
                    [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-purple-400
                    [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                />
              </div>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="px-4 py-3 border-t border-zinc-800/50 space-y-2">
            {/* Save as Preset input */}
            {showSaveAs ? (
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSaveAsPreset(); if (e.key === 'Escape') setShowSaveAs(false); }}
                  placeholder="Preset name..."
                  autoFocus
                  className="flex-1 px-2 py-1.5 rounded text-[10px] bg-zinc-900 border border-zinc-700 text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-cyan-600"
                />
                <button
                  onClick={handleSaveAsPreset}
                  disabled={!presetName.trim()}
                  className="px-2 py-1.5 rounded text-[10px] bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 disabled:opacity-30"
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSaveAs(true)}
                disabled={isDefault}
                className="w-full py-1.5 rounded text-[10px] transition border border-dashed border-zinc-700 text-zinc-500 hover:text-cyan-400 hover:border-cyan-700 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Save as Preset...
              </button>
            )}

            <button
              onClick={handleSave}
              disabled={isDefault}
              className={`w-full py-2 rounded text-xs font-medium transition border ${
                saveConfirm
                  ? 'bg-green-500/20 text-green-400 border-green-500/30'
                  : 'bg-purple-500/20 text-purple-400 border-purple-500/30 hover:bg-purple-500/30'
              } disabled:opacity-30 disabled:cursor-not-allowed`}
            >
              {saveConfirm ? 'Saved' : 'Enregistrer'}
            </button>
            <div className="flex gap-2">
              <button
                onClick={onReset}
                disabled={isDefault}
                className="flex-1 py-1.5 rounded text-[10px] transition border border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Reset
              </button>
              <button
                onClick={onCancel}
                className="flex-1 py-1.5 rounded text-[10px] transition border border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Keyboard Debug Panel (Shift+D) ────────────────────────────────────
function KeyboardDebugPanel() {
  const [, forceUpdate] = useState(0);

  // Poll debug stats at 10fps (no re-render storm)
  useEffect(() => {
    const id = setInterval(() => forceUpdate(n => n + 1), 100);
    return () => clearInterval(id);
  }, []);

  const d = KEYBOARD_DEBUG;
  const bar = (val: number, max: number = 1, color: string = '#5aaaff') => {
    const pct = Math.min(100, (val / max) * 100);
    return (
      <div className="w-20 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-100" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    );
  };

  return (
    <div className="fixed top-14 left-4 z-[70] bg-zinc-950/95 backdrop-blur-md border border-zinc-800 rounded-lg p-3 font-mono text-[10px] text-zinc-400 space-y-1.5 min-w-[200px]">
      <div className="text-[9px] uppercase tracking-wider text-zinc-600 mb-2">Keyboard Debug</div>

      <div className="flex items-center justify-between">
        <span>mic</span>
        <span className={d.listening ? 'text-green-400' : 'text-zinc-700'}>{d.listening ? 'ON' : 'OFF'}</span>
      </div>
      <div className="flex items-center justify-between">
        <span>typing</span>
        <span className={d.isTyping ? 'text-blue-400' : 'text-zinc-700'}>{d.isTyping ? 'YES' : 'no'}</span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span>noise floor</span>
        {bar(d.noiseFloor, 0.1, '#6b7280')}
        <span className="w-10 text-right">{d.noiseFloor.toFixed(4)}</span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span>rms</span>
        {bar(d.rms, 0.2, '#8b5cf6')}
        <span className="w-10 text-right">{d.rms.toFixed(4)}</span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span>hf energy</span>
        {bar(d.hfEnergy, 0.5, '#06b6d4')}
        <span className="w-10 text-right">{d.hfEnergy.toFixed(3)}</span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span>threshold</span>
        {bar(d.threshold, 0.2, '#f59e0b')}
        <span className="w-10 text-right">{d.threshold.toFixed(4)}</span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span>audio int.</span>
        {bar(d.audioIntensity, 1, '#5aaaff')}
        <span className="w-10 text-right">{d.audioIntensity.toFixed(3)}</span>
      </div>
      <div className="flex items-center justify-between">
        <span>active keys</span>
        <span className="text-blue-400">{d.activeKeys}</span>
      </div>
      <div className="flex items-center justify-between">
        <span>cooldown</span>
        <span>{d.cooldownMs}ms</span>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────
export default function Tracker3DPage() {
  const [mode, setMode] = useState<ViewMode>('mirror');
  const [days, setDays] = useState(7);
  const { awareness } = useAwarenessState();
  const cockpit = useCockpitState(awareness);

  // Orbital cockpit region state (3D panel system inside Canvas)
  const [orbitalRegion, setOrbitalRegion] = useState<RegionId | null>(null);

  // Image adjustments
  const [adjustments, setAdjustments] = useState<ImageAdjustments>(DEFAULT_ADJUSTMENTS);
  const [savedAdjustments, setSavedAdjustments] = useState<ImageAdjustments>(DEFAULT_ADJUSTMENTS);

  // Keyboard sound — chiclet feedback
  const [soundEnabled, setSoundEnabled] = useState(() => {
    if (typeof window === 'undefined') return true;
    try { return localStorage.getItem('kbd-sound') !== 'off'; } catch { return true; }
  });
  const [soundVolume, setSoundVolume] = useState(() => {
    if (typeof window === 'undefined') return 0.6;
    try { return parseFloat(localStorage.getItem('kbd-sound-vol') || '0.6'); } catch { return 0.6; }
  });
  useKeyboardSound({ enabled: soundEnabled, volume: soundVolume });

  const [, startTransition] = useTransition();

  // Auto-hide chrome + typing mode — ref-based, zero React re-renders
  // Uses data attributes on a wrapper div + CSS for opacity transitions
  const chromeRef = useRef(true);
  const typingRef = useRef(false);
  const chromeWrapperRef = useRef<HTMLDivElement>(null);
  const [debugPanel, setDebugPanel] = useState(false);
  const [showDirections, setShowDirections] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout>>();

  // Derived values for child props that need initial render values
  const [chromeVisible, setChromeVisible] = useState(true);
  const [typing, setTyping] = useState(false);

  // ── Unified gesture handler (InputController) ─────────────────────────
  const handleGesture = useCallback((g: Gesture) => {
    switch (g.type) {
      case 'SWIPE':
        if (g.dir === 'left' || g.dir === 'right') {
          startTransition(() => setMode(prev => prev === 'mirror' ? 'timeline' : 'mirror'));
        } else if (g.dir === 'up') {
          setShowDirections(prev => !prev);
        } else if (g.dir === 'down') {
          setShowDirections(false);
        }
        break;
      case 'KEY':
        if (g.key === 'Escape') {
          setShowDirections(false);
        } else if (g.key === 'D' && g.shift) {
          setDebugPanel(prev => !prev);
        }
        break;
      case 'ZOOM':
        // Reserved for future use (e.g. scene zoom level)
        // eslint-disable-next-line no-console
        console.debug('[3D] ZOOM gesture, delta:', g.delta);
        break;
    }
  // startTransition is stable (from useTransition), setMode/setShowDirections/setDebugPanel are stable setState
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useInput(handleGesture);

  useEffect(() => {
    const HIDE_DELAY = 4000;
    const el = chromeWrapperRef.current;

    const updateDOM = () => {
      if (!el) return;
      el.dataset.chrome = chromeRef.current ? '1' : '0';
      el.dataset.typing = typingRef.current ? '1' : '0';
    };

    const show = () => {
      if (!chromeRef.current) {
        chromeRef.current = true;
        setChromeVisible(true);
        updateDOM();
      }
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => {
        chromeRef.current = false;
        setChromeVisible(false);
        updateDOM();
      }, HIDE_DELAY);
    };

    // Poll typing state via rAF instead of setInterval+setState
    let rafId: number;
    const pollTyping = () => {
      const isTyping = KEYBOARD_DEBUG.isTyping;
      if (isTyping !== typingRef.current) {
        typingRef.current = isTyping;
        setTyping(isTyping);
        updateDOM();
      }
      rafId = requestAnimationFrame(pollTyping);
    };

    hideTimerRef.current = setTimeout(() => {
      chromeRef.current = false;
      setChromeVisible(false);
      updateDOM();
    }, 8000);
    updateDOM();
    rafId = requestAnimationFrame(pollTyping);

    window.addEventListener('mousemove', show, { passive: true });
    window.addEventListener('mousedown', show, { passive: true });
    return () => {
      clearTimeout(hideTimerRef.current);
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', show);
      window.removeEventListener('mousedown', show);
    };
  }, []);

  // Load saved adjustments on mount
  useEffect(() => {
    const loaded = loadAdjustments();
    setAdjustments(loaded);
    setSavedAdjustments(loaded);
  }, []);

  // Hide body scrollbar when mounted
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const handleSave = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(adjustments));
    startTransition(() => setSavedAdjustments({ ...adjustments }));
  }, [adjustments, startTransition]);

  const handleReset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    startTransition(() => {
      setAdjustments({ ...DEFAULT_ADJUSTMENTS });
      setSavedAdjustments({ ...DEFAULT_ADJUSTMENTS });
    });
  }, []);

  const handleCancel = useCallback(() => {
    startTransition(() => setAdjustments({ ...savedAdjustments }));
  }, [savedAdjustments]);

  const filterStyle = buildFilterStyle(adjustments);
  const vignetteOpacity = Math.max(0, adjustments.vignette) / 100;

  // Ref for direct DOM filter updates during slider drag (bypasses React)
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);

  // Called by AdjustmentPanel during drag — DOM-only, no React re-render
  const handleFilterPreview = useCallback((adj: ImageAdjustments) => {
    if (canvasWrapperRef.current) {
      const style = buildFilterStyle(adj);
      canvasWrapperRef.current.style.filter = (style.filter as string) || 'none';
    }
    if (vignetteRef.current) {
      const v = Math.max(0, adj.vignette) / 100;
      vignetteRef.current.style.background = v > 0
        ? `radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,${(v * 0.8).toFixed(3)}) 100%)`
        : 'none';
      vignetteRef.current.style.display = v > 0 ? '' : 'none';
    }
  }, []);

  return (
    <div ref={chromeWrapperRef} className="fixed inset-0 z-50 bg-zinc-950 overflow-hidden" data-chrome="1" data-typing="0">
      {/* Filtered canvas wrapper */}
      <div ref={canvasWrapperRef} className="w-full h-full" style={filterStyle}>
        {mode === 'mirror' ? (
          <AwarenessMirror activeRegion={orbitalRegion} setActiveRegion={setOrbitalRegion} />
        ) : (
          <TemporalScene days={days} />
        )}
      </div>

      {/* Vignette overlay — always mounted, visibility controlled via ref during drag */}
      <div
        ref={vignetteRef}
        className="fixed inset-0 pointer-events-none z-[51]"
        style={{
          display: vignetteOpacity > 0 ? undefined : 'none',
          background: vignetteOpacity > 0
            ? `radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,${vignetteOpacity * 0.8}) 100%)`
            : 'none',
        }}
      />

      {/* Overlays — auto-hide after inactivity, dim during typing */}
      <div className={`fixed top-4 left-4 flex items-center gap-3 z-[52] transition-opacity duration-500 ${chromeVisible ? (typing ? 'opacity-30' : 'opacity-100') : 'opacity-0 pointer-events-none'}`}>
        <Link
          href="/tracker"
          className="text-xs text-zinc-500 hover:text-zinc-300 transition bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-lg px-3 py-1.5"
        >
          &larr; Tracker
        </Link>

        <SanitizeToggle />

        {/* View mode toggle */}
        <div className="flex bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-lg overflow-hidden">
          <button
            onClick={() => startTransition(() => setMode('mirror'))}
            className={`px-3 py-1.5 text-xs font-mono transition ${
              mode === 'mirror'
                ? 'text-purple-400 bg-purple-500/10'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Awareness Mirror
          </button>
          <button
            onClick={() => startTransition(() => setMode('timeline'))}
            className={`px-3 py-1.5 text-xs font-mono transition ${
              mode === 'timeline'
                ? 'text-cyan-400 bg-cyan-500/10'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Timeline
          </button>
        </div>

        {/* Direction Map toggle */}
        <button
          onClick={() => setShowDirections(!showDirections)}
          className={`px-3 py-1.5 text-xs font-mono transition bg-zinc-900/80 backdrop-blur-sm border rounded-lg ${
            showDirections
              ? 'text-amber-400 border-amber-500/30 bg-amber-500/10'
              : 'text-zinc-500 hover:text-zinc-300 border-zinc-800'
          }`}
        >
          {'🧭'} Directions
        </button>
      </div>

      {/* Music panel — top left, below nav */}
      {mode === 'mirror' && (
        <div className={`fixed top-14 left-4 z-[52] transition-opacity duration-500 ${chromeVisible ? (typing ? 'opacity-20' : 'opacity-100') : 'opacity-0 pointer-events-none'}`}>
          <MusicAwarenessPanel chromeVisible={chromeVisible && !typing} />
        </div>
      )}

      {/* Environment manager + Skybox uploader — top right in mirror mode */}
      {mode === 'mirror' && (
        <div className={`fixed top-4 right-4 z-[52] flex items-start gap-2 transition-opacity duration-500 ${chromeVisible ? (typing ? 'opacity-30' : 'opacity-100') : 'opacity-0 pointer-events-none'}`}>
          <SkyboxUploader />
          <EnvironmentManager />
        </div>
      )}

      {/* Timeline controls — only show in timeline mode */}
      {mode === 'timeline' && (
        <div className={`fixed top-4 right-4 z-[52] transition-opacity duration-500 ${chromeVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <RangeSelector days={days} onChange={setDays} />
        </div>
      )}

      {/* Awareness HUD — shows in mirror mode, dims during typing */}
      {mode === 'mirror' && (
        <div className={`fixed bottom-4 left-4 z-[52] transition-opacity duration-500 ${chromeVisible ? (typing ? 'opacity-20' : 'opacity-100') : 'opacity-0 pointer-events-none'}`}>
          <AwarenessHUD />
        </div>
      )}

      {/* Cockpit Regions — right side below env manager, mirror mode only */}
      {mode === 'mirror' && (
        <div className={`fixed bottom-14 right-4 z-[52] transition-opacity duration-500 ${chromeVisible ? (typing ? 'opacity-20' : 'opacity-100') : 'opacity-0 pointer-events-none'}`}>
          <CockpitRegions awareness={awareness} cockpit={cockpit} visible={chromeVisible} />
        </div>
      )}

      {/* Legend — shows in timeline mode */}
      {mode === 'timeline' && (
        <div className={`fixed bottom-4 left-4 z-[52] transition-opacity duration-500 ${chromeVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <Legend />
        </div>
      )}

      {/* Sound toggle + Controls hint */}
      <div className={`fixed bottom-4 right-4 z-[52] flex items-center gap-3 transition-opacity duration-500 ${chromeVisible ? (typing ? 'opacity-20' : 'opacity-100') : 'opacity-0 pointer-events-none'}`}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              localStorage.setItem('kbd-sound', next ? 'on' : 'off');
            }}
            className={`p-1.5 rounded transition ${
              soundEnabled
                ? 'text-purple-400/70 hover:text-purple-400'
                : 'text-zinc-700 hover:text-zinc-500'
            }`}
            title={soundEnabled ? 'Key sounds on' : 'Key sounds off'}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {soundEnabled ? (
                <>
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </>
              ) : (
                <>
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </>
              )}
            </svg>
          </button>
          {soundEnabled && (
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={Math.round(soundVolume * 100)}
              onChange={(e) => {
                const v = Number(e.target.value) / 100;
                setSoundVolume(v);
              }}
              onPointerUp={(e) => {
                const v = Number((e.target as HTMLInputElement).value) / 100;
                localStorage.setItem('kbd-sound-vol', String(v));
              }}
              className="w-12 h-0.5 bg-zinc-800 rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-400/50
                [&::-moz-range-thumb]:w-2 [&::-moz-range-thumb]:h-2
                [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-purple-400/50
                [&::-moz-range-thumb]:border-0"
              title={`Volume: ${Math.round(soundVolume * 100)}%`}
            />
          )}
        </div>
        <span className="text-[10px] text-zinc-700 font-mono">
          drag: rotate &middot; scroll: zoom &middot; shift+drag: pan
        </span>
      </div>

      {/* Image Adjustment Panel */}
      <AdjustmentPanel
        adjustments={adjustments}
        onChange={setAdjustments}
        onPreview={handleFilterPreview}
        onSave={handleSave}
        onReset={handleReset}
        onCancel={handleCancel}
        chromeVisible={chromeVisible}
      />

      {/* Keyboard Debug Panel (Shift+D) */}
      {debugPanel && <KeyboardDebugPanel />}

      {/* Flat keyboard overlay — silver on dark, blue on typing */}
      {mode === 'mirror' && <FloatingKeyboardOverlay typing={typing} />}

      {/* Direction Map — constellation of priorities */}
      <DirectionMap visible={showDirections} onClose={() => setShowDirections(false)} />
    </div>
  );
}
