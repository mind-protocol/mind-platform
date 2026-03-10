'use client';

import {
  useEffect,
  useRef,
  useCallback,
  useState,
  useMemo,
} from 'react';
import {
  useAudioEngine,
  type AudioEngine,
} from '@/lib/music/hooks/useAudioEngine';
/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatDuration(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface SectionMarker {
  startSec: number;
  label: string;
  color?: string;
}

interface AnnotationDot {
  timeSec: number;
  label: string;
}

interface AudioPlayerProps {
  audioUrl: string;
  trackTitle: string;
  trackArtist: string;
  onEngineReady?: (engine: AudioEngine) => void;
  onTimeUpdate?: (currentTime: number) => void;
  sections?: SectionMarker[];
  annotations?: AnnotationDot[];
  duration?: number;
}

/* ------------------------------------------------------------------ */
/*  Color tokens (replaces fallen-* tailwind classes)                  */
/* ------------------------------------------------------------------ */

const C = {
  border: 'rgba(255,255,255,0.08)',
  surface: 'rgba(10,15,30,0.8)',
  accent: '#9b4dca',
  highlight: '#b06ddb',
  bg: '#050a14',
  text: '#d8dfe8',
  muted: '#5a6d8a',
} as const;

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2];
const WAVEFORM_HEIGHT = 20;
const WAVEFORM_SAMPLES = 128; // How many bars to draw

/* ------------------------------------------------------------------ */
/*  Mini waveform canvas                                               */
/* ------------------------------------------------------------------ */

function WaveformStrip({
  engine,
  isPlaying,
}: {
  engine: AudioEngine;
  isPlaying: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let running = true;

    const draw = () => {
      if (!running) return;

      engine.updateFrequencyData();

      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const td = engine.frequencyRef.current.timeDomainData;
      if (!td || td.length === 0) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      // Sample evenly across the time-domain buffer
      const step = Math.floor(td.length / WAVEFORM_SAMPLES);
      const barWidth = width / WAVEFORM_SAMPLES;
      const midY = height / 2;

      ctx.fillStyle = '#4a7ab5';

      for (let i = 0; i < WAVEFORM_SAMPLES; i++) {
        const sample = td[i * step];
        // Normalise 0-255 centred at 128 → amplitude -1..1
        const amp = (sample - 128) / 128;
        const barHeight = Math.abs(amp) * height;
        const y = midY - barHeight / 2;

        ctx.globalAlpha = 0.4 + Math.abs(amp) * 0.6;
        ctx.fillRect(
          i * barWidth,
          y,
          Math.max(barWidth - 0.5, 1),
          Math.max(barHeight, 0.5),
        );
      }
      ctx.globalAlpha = 1;

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [engine, isPlaying]);

  // Resize canvas to container on mount / resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver(([entry]) => {
      const w = Math.floor(entry.contentRect.width);
      if (canvas.width !== w) {
        canvas.width = w;
        canvas.height = WAVEFORM_HEIGHT;
      }
    });
    observer.observe(canvas.parentElement!);
    return () => observer.disconnect();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full block"
      style={{ height: WAVEFORM_HEIGHT }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Audio Player                                                       */
/* ------------------------------------------------------------------ */

export default function AudioPlayer({
  audioUrl,
  trackTitle,
  trackArtist,
  onEngineReady,
  onTimeUpdate,
  sections,
  annotations,
  duration: durationProp,
}: AudioPlayerProps) {
  const engine = useAudioEngine();
  const { state } = engine;

  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const seekBarRef = useRef<HTMLDivElement>(null);
  const notifiedRef = useRef(false);

  // Effective duration: prefer engine duration once loaded, fall back to prop
  const effectiveDuration = state.duration > 0 ? state.duration : (durationProp ?? 0);

  /* ---- Load audio when URL changes ---- */
  useEffect(() => {
    notifiedRef.current = false;
    engine.load(audioUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioUrl]);

  /* ---- Notify parent when engine is ready ---- */
  useEffect(() => {
    if (state.isLoaded && !notifiedRef.current) {
      notifiedRef.current = true;
      onEngineReady?.(engine);
    }
  }, [state.isLoaded, engine, onEngineReady]);

  /* ---- Forward time updates to parent ---- */
  useEffect(() => {
    onTimeUpdate?.(state.currentTime);
  }, [state.currentTime, onTimeUpdate]);

  /* ---- Seek handler ---- */
  const handleSeekClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!seekBarRef.current) return;
      const rect = seekBarRef.current.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      engine.seek(pct * state.duration);
    },
    [engine, state.duration],
  );

  const progress = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;

  /* ---- Current section label ---- */
  const currentSectionLabel = useMemo(() => {
    if (!sections || sections.length === 0) return null;
    const sorted = [...sections].sort((a, b) => a.startSec - b.startSec);
    let label: string | null = null;
    for (const sec of sorted) {
      if (state.currentTime >= sec.startSec) {
        label = sec.label;
      } else {
        break;
      }
    }
    return label;
  }, [sections, state.currentTime]);

  /* ---- Volume as 0-100 integer (matches PlaybackBar UX) ---- */
  const volumePercent = Math.round(state.volume * 100);

  return (
    <div
      className="flex-shrink-0 border-t backdrop-blur-sm"
      style={{
        borderColor: C.border,
        backgroundColor: C.surface,
      }}
    >
      {/* Live waveform strip */}
      <WaveformStrip engine={engine} isPlaying={state.isPlaying} />

      {/* Seek bar (full width, thin) */}
      <div
        ref={seekBarRef}
        onClick={handleSeekClick}
        className="w-full h-1.5 cursor-pointer group relative"
        style={{ backgroundColor: C.border }}
      >
        {/* Progress fill */}
        <div
          className="h-full transition-all duration-100"
          style={{ width: `${progress}%`, backgroundColor: C.accent }}
        />

        {/* Section markers */}
        {sections && effectiveDuration > 0 && sections.map((sec, i) => {
          const pct = (sec.startSec / effectiveDuration) * 100;
          if (pct < 0 || pct > 100) return null;
          return (
            <div
              key={`sec-${i}`}
              className="absolute top-0 h-full flex flex-col items-center"
              style={{ left: `${pct}%`, transform: 'translateX(-50%)' }}
            >
              {/* Vertical tick line */}
              <div
                className="w-[1.5px] h-full"
                style={{ backgroundColor: sec.color ?? '#9b4dca33' }}
              />
              {/* Hover label */}
              <div
                className="absolute bottom-full mb-1 whitespace-nowrap pointer-events-none
                           opacity-0 group-hover:opacity-100 transition-opacity
                           text-[9px] px-1 py-0.5 rounded"
                style={{
                  backgroundColor: C.bg,
                  color: C.text,
                  border: `1px solid ${C.border}`,
                }}
              >
                {sec.label}
              </div>
            </div>
          );
        })}

        {/* Annotation dots */}
        {annotations && effectiveDuration > 0 && annotations.map((ann, i) => {
          const pct = (ann.timeSec / effectiveDuration) * 100;
          if (pct < 0 || pct > 100) return null;
          return (
            <div
              key={`ann-${i}`}
              className="absolute top-1/2 group/dot"
              style={{
                left: `${pct}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* Dot */}
              <div
                className="w-[3px] h-[3px] rounded-full"
                style={{ backgroundColor: '#00ffff40' }}
              />
              {/* Hover label */}
              <div
                className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-nowrap
                           pointer-events-none opacity-0 group-hover/dot:opacity-100 transition-opacity
                           text-[9px] px-1 py-0.5 rounded"
                style={{
                  backgroundColor: C.bg,
                  color: C.text,
                  border: `1px solid ${C.border}`,
                }}
              >
                {ann.label}
              </div>
            </div>
          );
        })}

        {/* Hover thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            left: `${progress}%`,
            transform: 'translate(-50%, -50%)',
            backgroundColor: C.accent,
          }}
        />
      </div>

      {/* Current section label */}
      {currentSectionLabel && (
        <div className="px-4 pt-0.5">
          <span
            className="text-[10px] uppercase tracking-wider"
            style={{ color: C.muted }}
          >
            {currentSectionLabel}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between px-4 py-2 gap-4">
        {/* Left: track info */}
        <div className="flex items-center gap-3 min-w-0 flex-shrink">
          <div className="min-w-0">
            <p
              className="text-sm truncate font-semibold"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: C.text }}
            >
              {trackTitle}
            </p>
            <p className="text-[10px]" style={{ color: C.muted }}>{trackArtist}</p>
          </div>
        </div>

        {/* Center: playback controls */}
        <div className="flex items-center gap-3">
          {/* Play / Pause */}
          <button
            onClick={() => engine.toggle()}
            disabled={!state.isLoaded}
            className="w-10 h-10 rounded-full disabled:opacity-40 transition flex items-center justify-center"
            style={{ backgroundColor: C.accent, color: C.bg }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = C.highlight)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = C.accent)}
            title={state.isPlaying ? 'Pause' : 'Play'}
          >
            {state.isPlaying ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Time display */}
          <span
            className="text-[11px] font-mono ml-2 hidden sm:inline"
            style={{ color: C.muted }}
          >
            {formatDuration(Math.floor(state.currentTime))} /{' '}
            {formatDuration(Math.floor(state.duration))}
          </span>
        </div>

        {/* Right: volume, speed */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Speed selector */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
              className="text-[11px] font-mono transition px-1.5 py-0.5 rounded"
              style={{
                color: C.muted,
                border: `1px solid ${C.border}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = C.text;
                e.currentTarget.style.borderColor = 'rgba(155,77,202,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = C.muted;
                e.currentTarget.style.borderColor = C.border;
              }}
            >
              {state.playbackRate}x
            </button>
            {showSpeedMenu && (
              <div
                className="absolute bottom-full mb-1 right-0 rounded-lg py-1 min-w-[60px] z-10"
                style={{
                  backgroundColor: C.surface,
                  border: `1px solid ${C.border}`,
                }}
              >
                {SPEED_OPTIONS.map((speed) => (
                  <button
                    key={speed}
                    onClick={() => {
                      engine.setPlaybackRate(speed);
                      setShowSpeedMenu(false);
                    }}
                    className="block w-full text-left px-3 py-1.5 text-xs font-mono transition"
                    style={{
                      color: state.playbackRate === speed ? C.accent : C.muted,
                      backgroundColor: state.playbackRate === speed
                        ? 'rgba(155,77,202,0.1)'
                        : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (state.playbackRate !== speed) {
                        e.currentTarget.style.color = C.text;
                        e.currentTarget.style.backgroundColor = C.bg;
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color =
                        state.playbackRate === speed ? C.accent : C.muted;
                      e.currentTarget.style.backgroundColor =
                        state.playbackRate === speed
                          ? 'rgba(155,77,202,0.1)'
                          : 'transparent';
                    }}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Volume */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => engine.setVolume(state.volume > 0 ? 0 : 0.8)}
              className="transition"
              style={{ color: C.muted }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
              title={state.volume > 0 ? 'Mute' : 'Unmute'}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {volumePercent === 0 ? (
                  <>
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </>
                ) : volumePercent < 50 ? (
                  <>
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </>
                ) : (
                  <>
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  </>
                )}
              </svg>
            </button>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={volumePercent}
              onChange={(e) => engine.setVolume(Number(e.target.value) / 100)}
              className="w-20 h-1 rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#9b4dca]
                [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:cursor-pointer
                [&::-moz-range-thumb]:w-2.5 [&::-moz-range-thumb]:h-2.5
                [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#9b4dca]
                [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
              style={{ backgroundColor: C.border }}
            />
          </div>
        </div>
      </div>

      {/* Error display */}
      {state.error && (
        <div className="px-4 pb-2">
          <p className="text-xs text-red-400">{state.error}</p>
        </div>
      )}
    </div>
  );
}
