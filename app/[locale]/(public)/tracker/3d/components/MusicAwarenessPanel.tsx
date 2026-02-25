'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useSpotifyNowPlaying, type MusicState } from '@/lib/tracker/hooks/useSpotifyNowPlaying';

// ── LRC Parser ────────────────────────────────────────────────────────────
interface LyricLine {
  time: number; // seconds
  text: string;
}

function parseLRC(lrc: string): LyricLine[] {
  const lines: LyricLine[] = [];
  for (const line of lrc.split('\n')) {
    const match = line.match(/^\[(\d{2}):(\d{2})\.(\d{2,3})\]\s*(.*)$/);
    if (match) {
      const min = parseInt(match[1], 10);
      const sec = parseInt(match[2], 10);
      const ms = parseInt(match[3].padEnd(3, '0'), 10);
      const text = match[4].trim();
      if (text) {
        lines.push({ time: min * 60 + sec + ms / 1000, text });
      }
    }
  }
  return lines;
}

// ── Progress Bar ──────────────────────────────────────────────────────────
function ProgressBar({ progressMs, durationMs }: { progressMs: number; durationMs: number }) {
  const pct = durationMs > 0 ? (progressMs / durationMs) * 100 : 0;
  const fmt = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    return `${m}:${String(s % 60).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-1">
      <div className="h-0.5 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-purple-500/60 rounded-full transition-all duration-1000"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-[9px] text-zinc-600 font-mono">
        <span>{fmt(progressMs)}</span>
        <span>{fmt(durationMs)}</span>
      </div>
    </div>
  );
}

// ── Synced Lyrics Display ─────────────────────────────────────────────────
function SyncedLyrics({ lyrics, progressMs }: { lyrics: string; progressMs: number }) {
  const lines = useMemo(() => parseLRC(lyrics), [lyrics]);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressSec = progressMs / 1000;

  // Find current line index
  const currentIdx = useMemo(() => {
    let idx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].time <= progressSec) idx = i;
      else break;
    }
    return idx;
  }, [lines, progressSec]);

  // Auto-scroll to current line
  useEffect(() => {
    if (containerRef.current && currentIdx >= 0) {
      const el = containerRef.current.children[currentIdx] as HTMLElement;
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentIdx]);

  if (lines.length === 0) return null;

  return (
    <div ref={containerRef} className="space-y-1.5 max-h-48 overflow-y-auto scrollbar-hide">
      {lines.map((line, i) => (
        <p
          key={i}
          className={`text-[11px] leading-relaxed transition-all duration-300 ${
            i === currentIdx
              ? 'text-white font-medium'
              : i < currentIdx
                ? 'text-zinc-600'
                : 'text-zinc-500'
          }`}
        >
          {line.text}
        </p>
      ))}
    </div>
  );
}

// ── Plain Lyrics Display ──────────────────────────────────────────────────
function PlainLyrics({ lyrics }: { lyrics: string }) {
  // Strip any LRC tags just in case
  const clean = lyrics.replace(/^\[.*?\]\s*/gm, '').trim();

  return (
    <div className="max-h-48 overflow-y-auto scrollbar-hide">
      <p className="text-[11px] text-zinc-400 leading-relaxed whitespace-pre-wrap">
        {clean}
      </p>
    </div>
  );
}

// ── Main Panel ────────────────────────────────────────────────────────────
export default function MusicAwarenessPanel({ chromeVisible = true }: { chromeVisible?: boolean }) {
  const { musicState, loading } = useSpotifyNowPlaying();
  const [expanded, setExpanded] = useState(false);

  // Track progress locally between polls for smoother progress bar
  const [localProgress, setLocalProgress] = useState(0);
  const lastPollRef = useRef<{ progressMs: number; ts: number }>({ progressMs: 0, ts: 0 });

  useEffect(() => {
    if (musicState.isPlaying) {
      lastPollRef.current = { progressMs: musicState.progressMs, ts: Date.now() };
      setLocalProgress(musicState.progressMs);
    }
  }, [musicState.progressMs, musicState.isPlaying]);

  // Tick local progress every second while playing
  useEffect(() => {
    if (!musicState.isPlaying) return;
    const id = setInterval(() => {
      const elapsed = Date.now() - lastPollRef.current.ts;
      setLocalProgress(Math.min(
        lastPollRef.current.progressMs + elapsed,
        musicState.durationMs
      ));
    }, 1000);
    return () => clearInterval(id);
  }, [musicState.isPlaying, musicState.durationMs]);

  // Don't render if nothing has ever played
  if (loading || (!musicState.isPlaying && !musicState.track)) {
    return null;
  }

  // Collapsed: small pill with album art + track
  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg
          bg-zinc-950/90 backdrop-blur-md border border-zinc-800/60
          hover:border-zinc-700 transition-all duration-300
          ${!chromeVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'}
          max-w-[280px]`}
      >
        {/* Album art */}
        {musicState.albumArtSmall ? (
          <img
            src={musicState.albumArtSmall}
            alt=""
            className="w-8 h-8 rounded object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-8 h-8 rounded bg-zinc-800 flex-shrink-0 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-600">
              <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
            </svg>
          </div>
        )}

        {/* Track info */}
        <div className="min-w-0 text-left">
          <div className="text-[11px] text-zinc-200 truncate font-medium">
            {musicState.track}
          </div>
          <div className="text-[10px] text-zinc-500 truncate">
            {musicState.artist}
          </div>
        </div>

        {/* Playing indicator */}
        {musicState.isPlaying && (
          <div className="flex items-end gap-[2px] ml-auto flex-shrink-0">
            <div className="w-[2px] h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
            <div className="w-[2px] h-3 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
            <div className="w-[2px] h-1.5 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
          </div>
        )}
      </button>
    );
  }

  // Expanded: full panel
  return (
    <div
      className={`rounded-xl bg-zinc-950/95 backdrop-blur-md border border-zinc-800/60
        transition-all duration-300 overflow-hidden w-72
        ${!chromeVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      {/* Header with collapse button */}
      <div className="flex items-center justify-between px-3 pt-2.5 pb-1.5">
        <div className="text-[9px] uppercase tracking-wider text-zinc-600 font-medium">Now Playing</div>
        <button
          onClick={() => setExpanded(false)}
          className="text-zinc-600 hover:text-zinc-400 transition text-xs p-0.5"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="4 14 10 14 10 20" /><polyline points="20 10 14 10 14 4" />
            <line x1="14" y1="10" x2="21" y2="3" /><line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        </button>
      </div>

      {/* Album art + track info */}
      <div className="px-3 pb-2">
        <div className="flex gap-3">
          {/* Album art */}
          {musicState.albumArt ? (
            <img
              src={musicState.albumArt}
              alt=""
              className="w-20 h-20 rounded-lg object-cover flex-shrink-0 shadow-lg"
            />
          ) : (
            <div className="w-20 h-20 rounded-lg bg-zinc-800 flex-shrink-0 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-600">
                <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
              </svg>
            </div>
          )}

          {/* Track details */}
          <div className="min-w-0 flex-1 pt-1">
            <div className="text-[13px] text-zinc-100 font-medium leading-tight truncate">
              {musicState.track}
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5 truncate">
              {musicState.artist}
            </div>
            <div className="text-[10px] text-zinc-600 mt-0.5 truncate">
              {musicState.album}
            </div>

            {/* Audio features badges */}
            {musicState.energy > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                <FeatureBadge label="energy" value={musicState.energy} color="#8b5cf6" />
                <FeatureBadge label="vibe" value={musicState.valence} color="#22d3ee" />
                <FeatureBadge label="dance" value={musicState.danceability} color="#f59e0b" />
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-2.5">
          <ProgressBar progressMs={localProgress} durationMs={musicState.durationMs} />
        </div>
      </div>

      {/* Lyrics section */}
      {musicState.lyrics && (
        <div className="border-t border-zinc-800/50 px-3 py-2.5">
          <div className="text-[9px] uppercase tracking-wider text-zinc-600 mb-2">
            Lyrics {musicState.lyricsSource && <span className="text-zinc-700">({musicState.lyricsSource})</span>}
          </div>
          {musicState.lyricsSynced ? (
            <SyncedLyrics lyrics={musicState.lyrics} progressMs={localProgress} />
          ) : (
            <PlainLyrics lyrics={musicState.lyrics} />
          )}
        </div>
      )}

      {/* Tempo indicator */}
      {musicState.tempo > 0 && (
        <div className="border-t border-zinc-800/50 px-3 py-1.5 flex items-center justify-between">
          <span className="text-[9px] text-zinc-600 font-mono">{Math.round(musicState.tempo)} BPM</span>
          {musicState.key >= 0 && (
            <span className="text-[9px] text-zinc-600 font-mono">
              {['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'][musicState.key]}
              {musicState.mode === 1 ? ' maj' : ' min'}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ── Feature Badge ─────────────────────────────────────────────────────────
function FeatureBadge({ label, value, color }: { label: string; value: number; color: string }) {
  const pct = Math.round(value * 100);
  return (
    <span
      className="text-[8px] font-mono px-1 py-0.5 rounded border"
      style={{
        color,
        borderColor: `${color}30`,
        backgroundColor: `${color}10`,
      }}
    >
      {label} {pct}
    </span>
  );
}
