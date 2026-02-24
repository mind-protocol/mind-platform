'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import RangeSelector from './components/RangeSelector';
import Legend from './components/Legend';
import EnvironmentManager from '../components/EnvironmentManager';

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

type ViewMode = 'mirror' | 'timeline';

export default function Tracker3DPage() {
  const [mode, setMode] = useState<ViewMode>('mirror');
  const [days, setDays] = useState(7);

  return (
    <div className="h-[calc(100vh-4rem)] w-full bg-zinc-950 relative">
      {/* 3D Canvas */}
      {mode === 'mirror' ? (
        <AwarenessMirror />
      ) : (
        <TemporalScene days={days} />
      )}

      {/* Overlays */}
      <div className="absolute top-4 left-4 flex items-center gap-3 z-10">
        <Link
          href="/tracker"
          className="text-xs text-zinc-500 hover:text-zinc-300 transition bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-lg px-3 py-1.5"
        >
          &larr; Tracker
        </Link>

        {/* View mode toggle */}
        <div className="flex bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-lg overflow-hidden">
          <button
            onClick={() => setMode('mirror')}
            className={`px-3 py-1.5 text-xs font-mono transition ${
              mode === 'mirror'
                ? 'text-purple-400 bg-purple-500/10'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Awareness Mirror
          </button>
          <button
            onClick={() => setMode('timeline')}
            className={`px-3 py-1.5 text-xs font-mono transition ${
              mode === 'timeline'
                ? 'text-cyan-400 bg-cyan-500/10'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Timeline
          </button>
        </div>
      </div>

      {/* Environment manager — top right in mirror mode */}
      {mode === 'mirror' && (
        <div className="absolute top-4 right-4 z-10">
          <EnvironmentManager />
        </div>
      )}

      {/* Timeline controls — only show in timeline mode */}
      {mode === 'timeline' && (
        <div className="absolute top-4 right-4 z-10">
          <RangeSelector days={days} onChange={setDays} />
        </div>
      )}

      {/* Awareness HUD — shows in mirror mode */}
      {mode === 'mirror' && (
        <div className="absolute bottom-4 left-4 z-10">
          <AwarenessHUD />
        </div>
      )}

      {/* Legend — shows in timeline mode */}
      {mode === 'timeline' && (
        <div className="absolute bottom-4 left-4 z-10">
          <Legend />
        </div>
      )}

      {/* Controls hint */}
      <div className="absolute bottom-4 right-4 z-10 text-[10px] text-zinc-700 font-mono">
        drag: rotate &middot; scroll: zoom &middot; shift+drag: pan
      </div>
    </div>
  );
}
