'use client';
import type { Medication } from '@/lib/tracker/types/health';

const FREQ_LABELS: Record<string, string> = { daily: 'Quotidien', prn: 'Si besoin' };
const TYPE_COLORS: Record<string, string> = {
  'ISRS (antidépresseur)': 'bg-blue-900/30 text-blue-400',
  'IRSN (antidépresseur)': 'bg-indigo-900/30 text-indigo-400',
  'benzodiazépine (anxiolytique)': 'bg-amber-900/30 text-amber-400',
  'antipsychotique (sédatif/anxiolytique)': 'bg-purple-900/30 text-purple-400',
};

export default function CurrentMedications({ medications }: { medications: Medication[] }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-teal-400 mb-4">Traitements actuels</h3>
      <div className="space-y-3">
        {medications.map(med => (
          <div key={med.name} className="bg-zinc-800/50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-zinc-100">{med.name} <span className="text-teal-400">{med.dose_mg}mg</span></span>
              <span className={`px-2 py-0.5 rounded text-xs ${TYPE_COLORS[med.type] || 'bg-zinc-700 text-zinc-300'}`}>
                {med.type}
              </span>
            </div>
            <div className="text-sm text-zinc-400 mt-1">
              {med.schedule} — {FREQ_LABELS[med.frequency] || med.frequency}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
