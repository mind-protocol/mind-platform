'use client';
import { useState } from 'react';
import type { DoctorRecord } from '@/lib/tracker/types/health';

const ROLE_COLORS: Record<string, string> = {
  'pédiatre': 'text-blue-400',
  'néonatal': 'text-purple-400',
  'généraliste': 'text-green-400',
  'médecin scolaire': 'text-amber-400',
  'urgentiste': 'text-red-400',
  'généraliste/suivi': 'text-green-400',
};

export default function DoctorsGrid({ doctors }: { doctors: DoctorRecord[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-teal-400 mb-4">M&eacute;decins ({doctors.length})</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {doctors.map(doc => {
          const isExpanded = expanded === doc.name;
          return (
            <button
              key={doc.name}
              onClick={() => setExpanded(isExpanded ? null : doc.name)}
              className="bg-zinc-800/50 rounded-lg p-3 text-left hover:bg-zinc-800 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-zinc-200">{doc.name}</span>
                <span className="text-xs text-zinc-500">{doc.period}</span>
              </div>
              <div className={`text-sm mt-1 ${ROLE_COLORS[doc.role] || 'text-zinc-400'}`}>{doc.role}</div>
              {isExpanded && (
                <div className="mt-2 pt-2 border-t border-zinc-700 text-sm space-y-1">
                  {doc.location && <div className="text-zinc-400">{doc.location}</div>}
                  {doc.phone && <div className="text-zinc-500">T&eacute;l: {doc.phone}</div>}
                  {doc.n_ordre && <div className="text-zinc-600">N&deg; ordre: {doc.n_ordre}</div>}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
