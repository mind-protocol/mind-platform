'use client';
import { useState } from 'react';
import type { VaccinationDose } from '@/lib/tracker/types/health';

const VACCINE_COLORS: Record<string, string> = {
  DTCP: 'bg-blue-500',
  DT: 'bg-indigo-500',
  BCG: 'bg-green-500',
  tuberculin_test: 'bg-emerald-500',
  ROR: 'bg-orange-500',
  hepatitis_B: 'bg-purple-500',
};

const VACCINE_LABELS: Record<string, string> = {
  DTCP: 'Diphtérie-Tétanos-Coqueluche-Polio',
  DT: 'Diphtérie-Tétanos (rappels)',
  BCG: 'BCG (Tuberculose)',
  tuberculin_test: 'Test Tuberculinique',
  ROR: 'Rougeole-Oreillons-Rubéole',
  hepatitis_B: 'Hépatite B',
};

export default function VaccinationTimeline({ vaccinations }: { vaccinations: Record<string, unknown> }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-teal-400 mb-4">Vaccinations</h3>
      <div className="space-y-3">
        {Object.entries(vaccinations).filter(([k]) => k !== 'notes').map(([key, value]) => {
          const doses: VaccinationDose[] = Array.isArray(value) ? value : value && typeof value === 'object' ? [value as VaccinationDose] : [];
          const isExpanded = expanded === key;
          const color = VACCINE_COLORS[key] || 'bg-zinc-500';
          const label = VACCINE_LABELS[key] || key;

          return (
            <div key={key} className="bg-zinc-800/50 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpanded(isExpanded ? null : key)}
                className="w-full flex items-center gap-3 p-3 hover:bg-zinc-800 transition-colors text-left"
              >
                <div className={`w-3 h-3 rounded-full ${color}`} />
                <span className="font-medium text-zinc-200 flex-1">{label}</span>
                <span className="text-sm text-zinc-500">{doses.length} dose{doses.length > 1 ? 's' : ''}</span>
                <span className="text-zinc-500">{isExpanded ? '\u2212' : '+'}</span>
              </button>
              {isExpanded && (
                <div className="px-3 pb-3 pl-9 space-y-2">
                  {doses.map((d, i) => (
                    <div key={i} className="text-sm border-l-2 border-zinc-700 pl-3">
                      <div className="text-zinc-300">{d.date || '?'} {d.dose && `\u2014 ${d.dose}`}</div>
                      {d.vaccine && <div className="text-zinc-500">{d.vaccine}</div>}
                      {d.doctor && <div className="text-zinc-500">{d.doctor}</div>}
                      {d.lot && <div className="text-zinc-600">Lot: {d.lot}</div>}
                      {d.notes && <div className="text-zinc-500">{d.notes}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {typeof (vaccinations as Record<string, unknown>).notes === 'string' && (
          <div className="text-sm text-zinc-500 italic mt-2">{String((vaccinations as Record<string, unknown>).notes)}</div>
        )}
      </div>
    </div>
  );
}
