'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import RangeSelector from './components/RangeSelector';
import Legend from './components/Legend';

const TemporalScene = dynamic(
  () => import('./components/TemporalScene'),
  { ssr: false },
);

export default function Tracker3DPage() {
  const [days, setDays] = useState(7);

  return (
    <div className="h-[calc(100vh-4rem)] w-full bg-zinc-950 relative">
      {/* 3D Canvas */}
      <TemporalScene days={days} />

      {/* Overlays */}
      <div className="absolute top-4 left-4 flex items-center gap-3 z-10">
        <Link
          href="/tracker"
          className="text-xs text-zinc-500 hover:text-zinc-300 transition bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-lg px-3 py-1.5"
        >
          &larr; Tracker
        </Link>
        <h1 className="text-sm font-mono text-zinc-400 bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-lg px-3 py-1.5">
          3D Temporal View
        </h1>
      </div>

      <div className="absolute top-4 right-4 z-10">
        <RangeSelector days={days} onChange={setDays} />
      </div>

      <div className="absolute bottom-4 left-4 z-10">
        <Legend />
      </div>

      {/* Controls hint */}
      <div className="absolute bottom-4 right-4 z-10 text-[10px] text-zinc-700 font-mono">
        drag: rotate &middot; scroll: zoom &middot; shift+drag: pan
      </div>
    </div>
  );
}
