'use client';

import { useMemo, useState, useEffect } from 'react';
import {
  getAnnotations,
  getActiveAnnotation,
  getUpcomingAnnotations,
  type Annotation,
} from '@/lib/fallen/data/annotations';

const SECTION_ORDER = [
  'intro',
  'verse1',
  'chorus',
  'verse2',
  'bridge',
  'outro',
  'special',
] as const;

const SECTION_LABELS: Record<string, string> = {
  intro: 'Intro',
  verse1: 'Verse I',
  chorus: 'Chorus',
  verse2: 'Verse II',
  bridge: 'Bridge',
  outro: 'Outro',
  special: 'Special',
};

function formatTimestamp(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

interface InterpretationPanelProps {
  trackSlug: string;
  currentTimeSec: number;
  locale?: string;
}

export default function InterpretationPanel({
  trackSlug,
  currentTimeSec,
  locale = 'en',
}: InterpretationPanelProps) {
  const annotations = useMemo(
    () => getAnnotations(locale, trackSlug),
    [locale, trackSlug]
  );

  const active = useMemo(
    () => getActiveAnnotation(annotations, currentTimeSec),
    [annotations, currentTimeSec]
  );

  const upcoming = useMemo(
    () => getUpcomingAnnotations(annotations, currentTimeSec, 1),
    [annotations, currentTimeSec]
  );

  // Track which sections exist for this track
  const trackSections = useMemo(() => {
    const seen = new Set(annotations.map((a) => a.section));
    return SECTION_ORDER.filter((s) => seen.has(s));
  }, [annotations]);

  // Fade key — changes whenever the active annotation changes
  const [fadeKey, setFadeKey] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(false);
    const timeout = setTimeout(() => {
      setFadeKey((k) => k + 1);
      setVisible(true);
    }, 150);
    return () => clearTimeout(timeout);
  }, [active?.timeSec, active?.label]);

  const nextAnnotation: Annotation | null = upcoming[0] ?? null;

  return (
    <div className="flex flex-col h-full">
      {/* Section breadcrumb */}
      <div className="flex gap-1 mb-4 flex-wrap">
        {trackSections.map((section) => (
          <span
            key={section}
            className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-sm transition-all duration-300 ${
              active?.section === section
                ? 'bg-fallen-accent/20 text-fallen-accent border border-fallen-accent/40'
                : 'text-fallen-muted/50 border border-fallen-border/30'
            }`}
          >
            {SECTION_LABELS[section] ?? section}
          </span>
        ))}
      </div>

      {/* Active annotation */}
      {active ? (
        <div
          key={fadeKey}
          className={`transition-opacity duration-300 ease-in-out ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Timestamp + label */}
          <p className="text-xs font-mono text-white mb-2">
            <span className="text-fallen-accent">[{formatTimestamp(active.timeSec)}]</span>
            {' '}
            <span className="text-white/90">
              {active.label.startsWith('"') ? (
                <span className="italic">{active.label}</span>
              ) : (
                active.label
              )}
            </span>
          </p>

          {/* Commentary */}
          <p
            className="text-sm text-fallen-highlight leading-relaxed italic mb-3"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            {active.commentary}
          </p>

          {/* Lyric quote blockquote */}
          {active.lyricQuote && (
            <blockquote className="border-l-2 border-fallen-accent/40 pl-3 py-1 mb-3">
              <p
                className="text-xs text-fallen-muted italic leading-relaxed"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                &ldquo;{active.lyricQuote}&rdquo;
              </p>
            </blockquote>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p
            className="text-fallen-muted/40 text-sm italic text-center"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Waiting for playback to begin...
          </p>
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Next upcoming annotation preview */}
      {nextAnnotation && (
        <div className="mt-4 pt-3 border-t border-fallen-border/30">
          <p className="text-[9px] uppercase tracking-wider text-fallen-muted/40 mb-1">
            Coming next
          </p>
          <p className="text-xs text-fallen-muted/50">
            <span className="font-mono text-fallen-accent/40">
              [{formatTimestamp(nextAnnotation.timeSec)}]
            </span>{' '}
            {nextAnnotation.label.length > 60
              ? nextAnnotation.label.slice(0, 60) + '...'
              : nextAnnotation.label}
          </p>
        </div>
      )}
    </div>
  );
}
