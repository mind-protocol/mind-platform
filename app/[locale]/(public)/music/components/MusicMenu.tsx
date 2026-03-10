'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { CATALOG, formatDuration, type TrackEntry } from '@/lib/music/data/catalog';

/* -- Artist slug mapping -- */

function artistSlug(artist: string): string {
  return artist.toLowerCase().replace(/\s+/g, '-');
}

function trackUrl(t: TrackEntry): string {
  return `/music/${artistSlug(t.artist)}/${t.id}`;
}

/* -- Track Card -- */

function TrackCard({
  track,
  index,
  onClick,
}: {
  track: TrackEntry;
  index: number;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const primary = track.palette[0] ?? '#9b4dca';
  const secondary = track.palette[1] ?? '#00ffff';

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative w-full text-left rounded-xl overflow-hidden transition-all duration-300"
      style={{
        background: hovered
          ? `linear-gradient(135deg, ${primary}20, ${secondary}15)`
          : 'rgba(255,255,255,0.03)',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: hovered ? `${primary}66` : 'rgba(255,255,255,0.06)',
        transform: hovered ? 'scale(1.02)' : 'scale(1)',
        boxShadow: hovered ? `0 0 30px ${primary}20` : 'none',
      }}
    >
      {/* Color bar */}
      <div
        className="absolute top-0 left-0 w-full h-0.5 transition-all duration-300"
        style={{
          background: `linear-gradient(90deg, ${primary}, ${secondary})`,
          opacity: hovered ? 1 : 0.3,
        }}
      />

      <div className="p-4 flex items-center gap-4">
        {/* Track number / play icon */}
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300"
          style={{
            backgroundColor: hovered ? `${primary}30` : 'rgba(255,255,255,0.05)',
            color: hovered ? primary : '#5a6d8a',
          }}
        >
          {hovered ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          ) : (
            <span className="text-sm font-mono">{String(index + 1).padStart(2, '0')}</span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate group-hover:text-white/90">
            {track.title}
          </p>
          <p className="text-[11px] text-[#5a6d8a] truncate">
            {track.character && (
              <span style={{ color: `${primary}aa` }}>{track.character} — </span>
            )}
            {track.theme}
          </p>
        </div>

        {/* Duration */}
        <span className="text-[11px] font-mono text-[#5a6d8a] flex-shrink-0">
          {formatDuration(track.durationSec)}
        </span>

        {/* Palette dots */}
        <div className="flex gap-0.5 flex-shrink-0">
          {track.palette.slice(0, 3).map((c) => (
            <div
              key={c}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
    </button>
  );
}

/* -- Main Menu -- */

type Filter = 'all' | 'synthetic-souls' | 'nlr';

export default function MusicMenu() {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return CATALOG;
    if (filter === 'synthetic-souls')
      return CATALOG.filter((t) => t.artist === 'Synthetic Souls');
    return CATALOG.filter((t) => t.artist === 'NLR');
  }, [filter]);

  const ssTracks = CATALOG.filter((t) => t.artist === 'Synthetic Souls');
  const nlrTracks = CATALOG.filter((t) => t.artist === 'NLR');

  return (
    <div className="w-full h-full overflow-y-auto">
      {/* Background grid effect */}
      <div
        className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(155,77,202,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(155,77,202,0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#9b4dca] mb-3">
            Mind Protocol
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Augmented Listening
          </h1>
          <p className="text-sm text-[#5a6d8a] max-w-md mx-auto leading-relaxed">
            Real-time FFT visualization, synchronized lyrics, inner voice
            commentary. Music deconstructed from the inside.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[
            { key: 'all' as Filter, label: 'All Tracks', count: CATALOG.length },
            { key: 'synthetic-souls' as Filter, label: 'Synthetic Souls', count: ssTracks.length },
            { key: 'nlr' as Filter, label: 'NLR', count: nlrTracks.length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className="px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200"
              style={{
                backgroundColor:
                  filter === tab.key ? 'rgba(155,77,202,0.15)' : 'transparent',
                color: filter === tab.key ? '#9b4dca' : '#5a6d8a',
                borderWidth: 1,
                borderStyle: 'solid',
                borderColor:
                  filter === tab.key
                    ? 'rgba(155,77,202,0.3)'
                    : 'rgba(255,255,255,0.06)',
              }}
            >
              {tab.label}
              <span className="ml-1.5 text-[10px] opacity-60">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Track list */}
        {filter === 'all' ? (
          <>
            {/* Synthetic Souls section */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#9b4dca]/20 border border-[#9b4dca]/30 flex items-center justify-center">
                  <span className="text-[8px] font-bold text-[#9b4dca]">SS</span>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Synthetic Souls</h2>
                  <p className="text-[10px] text-[#5a6d8a]">AM I ALIVE — 7 tracks</p>
                </div>
              </div>
              <div className="grid gap-2">
                {ssTracks.map((t, i) => (
                  <TrackCard
                    key={t.id}
                    track={t}
                    index={i}
                    onClick={() => router.push(trackUrl(t))}
                  />
                ))}
              </div>
            </div>

            {/* NLR section */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#ffd700]/20 border border-[#ffd700]/30 flex items-center justify-center">
                  <span className="text-[8px] font-bold text-[#ffd700]">NLR</span>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">NLR</h2>
                  <p className="text-[10px] text-[#5a6d8a]">Singles — 6 tracks</p>
                </div>
              </div>
              <div className="grid gap-2">
                {nlrTracks.map((t, i) => (
                  <TrackCard
                    key={t.id}
                    track={t}
                    index={i}
                    onClick={() => router.push(trackUrl(t))}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="grid gap-2">
            {filtered.map((t, i) => (
              <TrackCard
                key={t.id}
                track={t}
                index={i}
                onClick={() => router.push(trackUrl(t))}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 pb-8">
          <p className="text-[10px] text-[#5a6d8a]">
            All tracks CC BY-SA 4.0 — Owned audio, full visualization rights
          </p>
        </div>
      </div>
    </div>
  );
}
