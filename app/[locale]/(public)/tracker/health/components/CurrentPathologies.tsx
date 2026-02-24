'use client';
import type { Pathology } from '@/lib/tracker/types/health';

const STATUS_STYLE: Record<string, string> = {
  active: 'bg-red-900/30 text-red-400',
  monitoring: 'bg-amber-900/30 text-amber-400',
  resolved: 'bg-green-900/30 text-green-400',
};

export default function CurrentPathologies({ pathologies, allergies }: { pathologies: Pathology[]; allergies: string[] }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-teal-400 mb-4">Pathologies & Allergies</h3>
      <div className="space-y-3">
        {pathologies.map(p => (
          <div key={p.condition} className="bg-zinc-800/50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-zinc-100">{p.condition}</span>
              <span className={`px-2 py-0.5 rounded text-xs ${STATUS_STYLE[p.status]}`}>
                {p.status}
              </span>
            </div>
            {p.details && <div className="text-sm text-zinc-400 mt-1">{p.details}</div>}
          </div>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-zinc-800">
        <div className="text-sm text-zinc-500">
          Allergies: {allergies.length === 0 ? <span className="text-green-400">Aucune</span> : allergies.join(', ')}
        </div>
      </div>
    </div>
  );
}
