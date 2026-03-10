'use client';

import { useMemo, useEffect, useRef } from 'react';
import {
  getAnnotations,
  type Annotation,
} from '@/lib/fallen/data/annotations';

interface LyricsPanelProps {
  trackSlug: string;
  currentTimeSec: number;
  locale?: string;
}

export default function LyricsPanel({
  trackSlug,
  currentTimeSec,
  locale = 'en',
}: LyricsPanelProps) {
  const annotations = useMemo(
    () => getAnnotations(locale, trackSlug),
    [locale, trackSlug]
  );

  // Find the index of the active annotation (last one with timeSec <= currentTimeSec)
  const activeIndex = useMemo(() => {
    let idx = -1;
    for (let i = annotations.length - 1; i >= 0; i--) {
      if (annotations[i].timeSec <= currentTimeSec) {
        idx = i;
        break;
      }
    }
    return idx;
  }, [annotations, currentTimeSec]);

  const activeRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll the active line into view
  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeIndex]);

  if (annotations.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p
          className="text-fallen-muted/40 text-sm italic"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          No lyrics data available for this track.
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-full overflow-y-auto px-2 py-4">
      <div className="space-y-3">
        {annotations.map((annotation, i) => {
          const isActive = i === activeIndex;
          const isPast = i < activeIndex;
          const isFuture = i > activeIndex;

          // Section marker for non-lyric annotations
          if (!annotation.lyricQuote) {
            return (
              <div
                key={`${annotation.timeSec}-${i}`}
                ref={isActive ? activeRef : undefined}
                className={`transition-all duration-300 ${
                  isActive ? 'opacity-100' : isPast ? 'opacity-40' : 'opacity-60'
                }`}
              >
                <p className="text-[9px] uppercase tracking-[0.2em] text-fallen-accent/60 py-1">
                  {annotation.label}
                </p>
              </div>
            );
          }

          return (
            <div
              key={`${annotation.timeSec}-${i}`}
              ref={isActive ? activeRef : undefined}
              className={`transition-all duration-500 ease-in-out rounded-md px-2 py-1 ${
                isActive
                  ? 'scale-[1.02]'
                  : ''
              }`}
              style={
                isActive
                  ? {
                      boxShadow: '0 0 20px rgba(74, 122, 181, 0.3), 0 0 40px rgba(74, 122, 181, 0.1)',
                    }
                  : undefined
              }
            >
              <p
                className={`leading-relaxed transition-all duration-500 ${
                  isActive
                    ? 'text-white text-base font-medium'
                    : isPast
                      ? 'text-fallen-text/40 text-sm'
                      : 'text-fallen-text/70 text-sm'
                }`}
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                {annotation.lyricQuote}
              </p>
            </div>
          );
        })}

        {/* Bottom padding so the last lyric can scroll to center */}
        <div className="h-32" />
      </div>
    </div>
  );
}
