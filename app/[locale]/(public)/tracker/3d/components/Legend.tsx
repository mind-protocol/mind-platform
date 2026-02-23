'use client';

import { SUBSTANCE_CONFIG, SUBSTANCE_KEYS } from '@/lib/tracker/constants';

export default function Legend() {
  return (
    <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-lg p-3 space-y-1.5">
      <div className="text-[10px] uppercase tracking-wider text-zinc-600 mb-2">Substances</div>
      {SUBSTANCE_KEYS.map((key) => {
        const cfg = SUBSTANCE_CONFIG[key];
        return (
          <div key={key} className="flex items-center gap-2 text-xs">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: cfg.color, boxShadow: `0 0 6px ${cfg.color}40` }}
            />
            <span className="text-zinc-400">{cfg.label}</span>
          </div>
        );
      })}
      <div className="border-t border-zinc-800 my-1.5" />
      <div className="text-[10px] uppercase tracking-wider text-zinc-600 mb-1">Biometrics</div>
      <div className="flex items-center gap-2 text-xs">
        <div className="w-2.5 h-1 rounded bg-red-500/60" />
        <span className="text-zinc-500">Stress</span>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <div className="w-2.5 h-1 rounded bg-cyan-500/60" />
        <span className="text-zinc-500">Body Battery</span>
      </div>
    </div>
  );
}
