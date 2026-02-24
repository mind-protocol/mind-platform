'use client';
import type { MedicalIdentity, CurrentStatus, BirthData } from '@/lib/tracker/types/health';

interface Props {
  identity: MedicalIdentity;
  status: CurrentStatus;
  birth: BirthData;
}

export default function ProfileHeader({ identity, status, birth }: Props) {
  const age = status.computed_age || status.age;
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">{identity.full_name}</h2>
          <p className="text-zinc-400 mt-1">
            Né le {new Date(identity.date_of_birth).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            {' '}à {identity.time_of_birth} — {identity.place_of_birth}
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="px-3 py-1 bg-red-900/30 text-red-400 rounded-full text-sm font-medium">
              {identity.blood_type}
            </span>
            {identity.organ_donor && (
              <span className="px-3 py-1 bg-teal-900/30 text-teal-400 rounded-full text-sm font-medium">
                Donneur d&apos;organes
              </span>
            )}
            <span className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full text-sm">
              {identity.laterality === 'droite' ? 'Droitier' : 'Gaucher'}
            </span>
          </div>
        </div>
        <div className="flex gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-teal-400">{age}</div>
            <div className="text-xs text-zinc-500">ans</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-zinc-200">{status.height_cm}</div>
            <div className="text-xs text-zinc-500">cm</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-zinc-200">{status.weight_kg}</div>
            <div className="text-xs text-zinc-500">kg</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-zinc-200">{status.bmi}</div>
            <div className="text-xs text-zinc-500">IMC</div>
          </div>
        </div>
      </div>
      {/* Birth summary */}
      <div className="mt-4 pt-4 border-t border-zinc-800 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div><span className="text-zinc-500">Naissance:</span> <span className="text-zinc-300">{birth.birth_weight_g}g, {birth.birth_height_cm}cm</span></div>
        <div><span className="text-zinc-500">Apgar:</span> <span className="text-zinc-300">{birth.apgar_1min}/{birth.apgar_5min}</span></div>
        <div><span className="text-zinc-500">Terme:</span> <span className="text-zinc-300">{birth.term_weeks} sem.</span></div>
        <div><span className="text-zinc-500">Accouchement:</span> <span className="text-zinc-300">{birth.delivery}</span></div>
      </div>
    </div>
  );
}
