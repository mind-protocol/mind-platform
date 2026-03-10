'use client';

import type { ReactNode } from 'react';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { CATALOG } from '@/lib/music/data/catalog';

export default function TrackLayout({ children }: { children: ReactNode }) {
  const params = useParams<{ artist: string; track: string }>();
  const entry = CATALOG.find((t) => t.id === params.track);
  const primary = entry?.palette[0] ?? '#9b4dca';

  return (
    <>
      {/* Minimal header */}
      <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center gap-4">
          <Link
            href="/music"
            className="text-[#5a6d8a] hover:text-[#9b4dca] transition text-sm flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Catalog</span>
          </Link>
          <div className="flex items-center gap-2">
            <span
              className="text-xs tracking-[0.2em] uppercase"
              style={{
                color: primary,
                fontFamily: 'Georgia, "Times New Roman", serif',
              }}
            >
              {entry?.artist ?? params.artist}
            </span>
            <span className="text-[#1a2a42]">&middot;</span>
            <h1
              className="text-sm tracking-[0.3em] uppercase font-semibold text-[#00ffff]"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              {entry?.title ?? params.track}
            </h1>
          </div>
        </div>
      </header>
      {children}
    </>
  );
}
