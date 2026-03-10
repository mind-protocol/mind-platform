'use client';

import { useState, useRef, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import type { AugmentedTrack } from '@/lib/music/types';
import type { AudioEngine, FrequencyData } from '@/lib/music/hooks/useAudioEngine';

const AudioPlayer = dynamic(
  () => import('@/app/[locale]/(public)/music/evanescence/fallen/components/AudioPlayer'),
  { ssr: false },
);

const TunnelVisualization = dynamic(
  () => import('@/app/[locale]/(public)/music/evanescence/fallen/components/TunnelVisualization'),
  { ssr: false },
);

/* == Helpers ============================================================== */

function getActiveAnnotation(
  track: AugmentedTrack,
  timeSec: number,
  locale: string,
) {
  const anns = track.annotations[locale] ?? track.annotations.en ?? [];
  for (let i = anns.length - 1; i >= 0; i--) {
    if (timeSec >= anns[i].timeSec) return { ...anns[i], index: i };
  }
  return anns[0] ? { ...anns[0], index: 0 } : null;
}

function getActiveLyricIndex(track: AugmentedTrack, timeSec: number): number {
  for (let i = track.lyrics.length - 1; i >= 0; i--) {
    if (timeSec >= track.lyrics[i].startSec) return i;
  }
  return 0;
}

function getActiveVisual(track: AugmentedTrack, timeSec: number) {
  for (let i = (track.visuals?.length ?? 0) - 1; i >= 0; i--) {
    if (timeSec >= track.visuals![i].startSec) return track.visuals![i];
  }
  return track.visuals?.[0] ?? null;
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function sectionLabel(section: string): string {
  return section
    .replace(/-/g, ' ')
    .replace(/(\d+)([a-z])/g, '$1')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/^\s+/, '')
    .trim();
}

/* == Color system ========================================================= */

const NOTE_COLORS = [
  { accent: '#9b4dca', glow: 'rgba(155,77,202,0.3)', bg: 'rgba(155,77,202,0.08)' },
  { accent: '#00ffff', glow: 'rgba(0,255,255,0.3)', bg: 'rgba(0,255,255,0.08)' },
  { accent: '#d4af37', glow: 'rgba(212,175,55,0.3)', bg: 'rgba(212,175,55,0.08)' },
  { accent: '#ff6b6b', glow: 'rgba(255,107,107,0.3)', bg: 'rgba(255,107,107,0.08)' },
  { accent: '#64ffda', glow: 'rgba(100,255,218,0.3)', bg: 'rgba(100,255,218,0.08)' },
  { accent: '#ff4500', glow: 'rgba(255,69,0,0.3)', bg: 'rgba(255,69,0,0.08)' },
  { accent: '#e2b714', glow: 'rgba(226,183,20,0.3)', bg: 'rgba(226,183,20,0.08)' },
  { accent: '#00ff41', glow: 'rgba(0,255,65,0.3)', bg: 'rgba(0,255,65,0.08)' },
];

function getNoteColor(index: number, palette?: string[]) {
  if (palette && palette.length > 1) {
    const color = palette[index % palette.length];
    if (color && color !== '#000000' && color !== '#0a0a0a') {
      return { accent: color, glow: `${color}4d`, bg: `${color}14` };
    }
  }
  return NOTE_COLORS[index % NOTE_COLORS.length];
}

/* == Sub-components ======================================================= */

/** Karaoke-style lyrics: past dimmed, active bright, next previewed */
function LyricsFlow({
  track,
  activeIndex,
  noteColor,
}: {
  track: AugmentedTrack;
  activeIndex: number;
  noteColor: { accent: string; glow: string };
}) {
  const lyrics = track.lyrics;
  const active = lyrics[activeIndex];
  const prev = activeIndex > 0 ? lyrics[activeIndex - 1] : null;
  const next = activeIndex < lyrics.length - 1 ? lyrics[activeIndex + 1] : null;

  // Detect section change
  const showSection =
    active &&
    (activeIndex === 0 || active.section !== lyrics[activeIndex - 1]?.section);

  return (
    <div className="text-center px-6 py-3 flex flex-col items-center gap-1 min-h-[120px] justify-end">
      {/* Section marker */}
      {showSection && active && (
        <div
          className="text-[9px] uppercase tracking-[0.3em] font-mono mb-1 transition-all duration-500"
          style={{ color: `${noteColor.accent}88` }}
        >
          {sectionLabel(active.section)}
        </div>
      )}

      {/* Previous line (dimmed) */}
      {prev && prev.text && (
        <p
          className="text-sm text-white/20 leading-snug transition-all duration-500 max-w-2xl"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          {prev.text.split('\n').slice(-1)[0]}
        </p>
      )}

      {/* Active line (bright, glowing) */}
      {active && active.text ? (
        <p
          className="text-2xl md:text-3xl font-bold text-white leading-snug transition-all duration-300 max-w-3xl"
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            textShadow: `0 0 20px ${noteColor.glow}, 0 0 40px ${noteColor.glow}`,
          }}
        >
          {active.text.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              {i < active.text.split('\n').length - 1 && <br />}
            </span>
          ))}
        </p>
      ) : (
        <p className="text-lg text-[#5a6d8a]/40 italic h-8" />
      )}

      {/* Next line (preview, subtle) */}
      {next && next.text && (
        <p
          className="text-xs text-white/10 leading-snug transition-all duration-700 max-w-2xl mt-1"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          {next.text.split('\n')[0]}
        </p>
      )}
    </div>
  );
}

/** Annotation panel with animated transitions */
function AnnotationPanel({
  annotation,
  noteColor,
  charName,
  currentSection,
}: {
  annotation: {
    timeSec: number;
    label: string;
    commentary: string;
    voice?: string;
    section?: string;
    index: number;
  } | null;
  noteColor: { accent: string; glow: string; bg: string };
  charName: string;
  currentSection: string;
}) {
  if (!annotation) return null;

  return (
    <div className="mx-auto max-w-2xl px-6 pb-3">
      <div
        className="backdrop-blur-md rounded-xl p-4 transition-all duration-700"
        style={{
          backgroundColor: noteColor.bg,
          border: `1px solid ${noteColor.accent}33`,
          boxShadow: `0 0 20px ${noteColor.glow}, inset 0 0 20px ${noteColor.bg}`,
        }}
      >
        {/* Header: voice + section link + label */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span
            className="text-[10px] uppercase tracking-wider font-bold"
            style={{ color: noteColor.accent }}
          >
            {annotation.voice ?? charName}
          </span>
          <span className="text-[8px] text-[#5a6d8a]">&bull;</span>
          <span
            className="text-[9px] font-mono uppercase tracking-wider"
            style={{ color: `${noteColor.accent}66` }}
          >
            {sectionLabel(currentSection)}
          </span>
          <span className="text-[8px] text-[#5a6d8a]">&bull;</span>
          <span className="text-[10px] text-[#5a6d8a] font-mono">
            {formatTime(annotation.timeSec)}
          </span>
          <span className="flex-1" />
          <span
            className="text-[10px] italic"
            style={{ color: `${noteColor.accent}99` }}
          >
            {annotation.label}
          </span>
        </div>
        {/* Commentary */}
        <p
          className="text-sm text-[#d8dfe8]/80 italic leading-relaxed"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          {annotation.commentary}
        </p>
      </div>
    </div>
  );
}

/** Collapsible info panel with tabs */
type InfoTab = 'theme' | 'scene' | 'origin';

function InfoPanel({
  track,
  activeVisual,
  noteColor,
  charName,
  show,
  onToggle,
}: {
  track: AugmentedTrack;
  activeVisual: ReturnType<typeof getActiveVisual>;
  noteColor: { accent: string; glow: string; bg: string };
  charName: string;
  show: boolean;
  onToggle: () => void;
}) {
  const [tab, setTab] = useState<InfoTab>('theme');

  const tabs: { key: InfoTab; label: string }[] = [
    { key: 'theme', label: 'Theme' },
    { key: 'scene', label: 'Scene' },
    { key: 'origin', label: 'Origin' },
  ];

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center hover:text-[#00ffff] transition"
        style={{
          border: `1px solid ${noteColor.accent}4d`,
          color: noteColor.accent,
          ...(show ? { right: '17rem' } : {}),
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          {show ? (
            <path d="M18 6L6 18M6 6l12 12" />
          ) : (
            <>
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </>
          )}
        </svg>
      </button>

      {/* Panel */}
      {show && (
        <div className="absolute top-4 right-4 w-64 pointer-events-auto">
          <div
            className="bg-black/60 backdrop-blur-md rounded-xl overflow-hidden"
            style={{ border: `1px solid ${noteColor.accent}33` }}
          >
            {/* Character header (compact) */}
            <div className="flex items-center gap-2 px-3 pt-3 pb-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                style={{
                  backgroundColor: `${noteColor.accent}20`,
                  border: `1px solid ${noteColor.accent}66`,
                  color: noteColor.accent,
                }}
              >
                {charName.slice(0, 3).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  {charName}
                </p>
                <p className="text-[9px] truncate" style={{ color: noteColor.accent }}>
                  {track.context.character?.type ?? 'Artist'}
                </p>
              </div>
              {/* Badges */}
              <div className="flex gap-1 ml-auto flex-shrink-0">
                <span
                  className="text-[8px] px-1.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${noteColor.accent}14`,
                    color: noteColor.accent,
                    border: `1px solid ${noteColor.accent}33`,
                  }}
                >
                  {track.rights.license}
                </span>
              </div>
            </div>

            {/* Tab bar */}
            <div className="flex border-b border-white/[0.06] px-3">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className="text-[9px] uppercase tracking-wider py-1.5 px-2 transition-all border-b-2"
                  style={{
                    borderColor:
                      tab === t.key ? noteColor.accent : 'transparent',
                    color: tab === t.key ? noteColor.accent : '#5a6d8a',
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="px-3 py-2.5 max-h-40 overflow-y-auto text-[11px] leading-relaxed">
              {tab === 'theme' && (
                <p className="text-[#d8dfe8]/70">{track.context.theme}</p>
              )}
              {tab === 'scene' && activeVisual && (
                <div>
                  <p className="mb-1" style={{ color: `${noteColor.accent}99` }}>
                    {activeVisual.scene.replace(/_/g, ' ')}
                  </p>
                  <div className="flex gap-1 mb-2">
                    {activeVisual.palette.map((c) => (
                      <div
                        key={c}
                        className="w-2.5 h-2.5 rounded-full border border-white/10"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <p className="text-[#d8dfe8]/50 italic text-[10px]">
                    {activeVisual.direction}
                  </p>
                </div>
              )}
              {tab === 'scene' && !activeVisual && (
                <p className="text-[#5a6d8a] italic">No visual data</p>
              )}
              {tab === 'origin' && (
                <p
                  className="text-[#d8dfe8]/50 italic"
                  style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                  {track.context.biography ?? 'No origin story yet.'}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* == Main ================================================================= */

interface TrackExperienceProps {
  track: AugmentedTrack;
  locale?: string;
}

export default function TrackExperience({
  track,
  locale = 'en',
}: TrackExperienceProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showInfo, setShowInfo] = useState(false); // collapsed by default
  const engineRef = useRef<AudioEngine | null>(null);
  const frequencyRef = useRef<FrequencyData | null>(null);

  const handleEngineReady = useCallback((engine: AudioEngine) => {
    engineRef.current = engine;
    frequencyRef.current = engine.frequencyRef.current;
  }, []);

  const handleTimeUpdate = useCallback((time: number) => {
    setCurrentTime(time);
    setIsPlaying(engineRef.current?.state.isPlaying ?? false);
    if (engineRef.current) {
      frequencyRef.current = engineRef.current.frequencyRef.current;
    }
  }, []);

  const activeAnnotation = useMemo(
    () => getActiveAnnotation(track, currentTime, locale),
    [track, currentTime, locale],
  );
  const activeLyricIndex = useMemo(
    () => getActiveLyricIndex(track, currentTime),
    [track, currentTime],
  );
  const activeVisual = useMemo(
    () => getActiveVisual(track, currentTime),
    [track, currentTime],
  );

  const noteColor = useMemo(
    () => getNoteColor(activeAnnotation?.index ?? 0, activeVisual?.palette),
    [activeAnnotation?.index, activeVisual?.palette],
  );

  const charName = track.context.character?.name ?? track.artist;
  const activeLyric = track.lyrics[activeLyricIndex];
  const currentSection = activeLyric?.section ?? '';

  // Build section markers for player
  const sections = useMemo(() => {
    const seen = new Set<string>();
    return track.lyrics
      .filter((l) => {
        if (seen.has(l.section)) return false;
        seen.add(l.section);
        return true;
      })
      .map((l) => ({
        startSec: l.startSec,
        label: sectionLabel(l.section),
      }));
  }, [track.lyrics]);

  const annotations = useMemo(() => {
    const anns = track.annotations[locale] ?? track.annotations.en ?? [];
    return anns.map((a) => ({ timeSec: a.timeSec, label: a.label }));
  }, [track, locale]);

  return (
    <div className="w-full h-full pt-12 flex flex-col relative">
      {/* Tunnel Visualization */}
      <div className="flex-1 relative">
        <TunnelVisualization
          frequencyRef={
            frequencyRef as React.MutableRefObject<FrequencyData | null>
          }
          currentTime={currentTime}
          isPlaying={isPlaying}
          currentSection={currentSection}
          palette={activeVisual?.palette}
          activeText={activeLyric?.text}
          depthVisuals={track.depthVisuals}
        />

        {/* Overlay: lyrics + annotation */}
        <div className="absolute inset-0 pointer-events-none flex flex-col">
          <div className="flex-1" />
          <div className="pointer-events-auto">
            <LyricsFlow
              track={track}
              activeIndex={activeLyricIndex}
              noteColor={noteColor}
            />
            <AnnotationPanel
              annotation={activeAnnotation}
              noteColor={noteColor}
              charName={charName}
              currentSection={currentSection}
            />
          </div>
        </div>

        {/* Info panel (right side, collapsible) */}
        <InfoPanel
          track={track}
          activeVisual={activeVisual}
          noteColor={noteColor}
          charName={charName}
          show={showInfo}
          onToggle={() => setShowInfo(!showInfo)}
        />
      </div>

      {/* Audio Player */}
      <div className="flex-shrink-0">
        <AudioPlayer
          audioUrl={track.audio.url}
          trackTitle={track.title}
          trackArtist={track.artist}
          onEngineReady={handleEngineReady}
          onTimeUpdate={handleTimeUpdate}
          sections={sections}
          annotations={annotations}
        />
      </div>
    </div>
  );
}
