'use client';
import { useState } from 'react';
import type { ChildhoodEvent } from '@/lib/tracker/types/health';

export default function MedicalHistory({ events }: { events: ChildhoodEvent[] }) {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? events : events.slice(0, 8);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-teal-400 mb-4">Historique M&eacute;dical</h3>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-3 top-0 bottom-0 w-px bg-zinc-700" />
        <div className="space-y-4">
          {displayed.map((evt, i) => (
            <div key={i} className="flex gap-4 relative">
              <div className="w-6 h-6 rounded-full bg-zinc-800 border-2 border-teal-500/50 flex-shrink-0 z-10 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-teal-400" />
              </div>
              <div className="flex-1 pb-1">
                <div className="text-sm text-zinc-500">{evt.date}</div>
                <div className="text-zinc-200 text-sm mt-0.5">{evt.event}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {events.length > 8 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 text-sm text-teal-400 hover:text-teal-300"
        >
          {showAll ? 'Voir moins' : `Voir tout (${events.length} \u00e9v\u00e9nements)`}
        </button>
      )}
    </div>
  );
}
