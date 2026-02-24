'use client';

import { useState } from 'react';
import { useHealthAuth, useHealthProfile, useGrowthData } from '@/lib/tracker/hooks/useHealthProfile';
import ProfileHeader from './components/ProfileHeader';
import CurrentMedications from './components/CurrentMedications';
import CurrentPathologies from './components/CurrentPathologies';
import GrowthChart from './components/GrowthChart';
import VaccinationTimeline from './components/VaccinationTimeline';
import MedicalHistory from './components/MedicalHistory';
import DoctorsGrid from './components/DoctorsGrid';

function AuthGate({ onAuthenticated }: { onAuthenticated: (token: string) => void }) {
  const { error, authenticate } = useHealthAuth();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    const ok = await authenticate(input.trim());
    if (ok) onAuthenticated(input.trim());
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="text-3xl mb-2">🔒</div>
          <h1 className="text-xl font-semibold text-zinc-100">Dossier Médical</h1>
          <p className="text-sm text-zinc-500 mt-1">Accès protégé</p>
        </div>
        <div>
          <input
            type="password"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Clé d'accès"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            autoFocus
          />
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="w-full bg-teal-600 hover:bg-teal-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-medium py-3 rounded-lg transition-colors"
        >
          {loading ? 'Vérification...' : 'Déverrouiller'}
        </button>
      </form>
    </div>
  );
}

function HealthDashboard({ token }: { token: string }) {
  const { profile, loading } = useHealthProfile(token);
  const { points, dob } = useGrowthData(token);

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-500">Chargement du dossier...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-teal-400">Dossier Médical</h1>
          <button
            onClick={() => {
              sessionStorage.removeItem('health_access_token');
              window.location.reload();
            }}
            className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Verrouiller
          </button>
        </div>

        {/* Profile header */}
        <ProfileHeader
          identity={profile.identity}
          status={profile.current_status}
          birth={profile.birth}
        />

        {/* Current meds + pathologies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CurrentMedications medications={profile.current_medications} />
          <CurrentPathologies pathologies={profile.current_pathologies} allergies={profile.allergies} />
        </div>

        {/* Growth chart */}
        {points.length > 0 && <GrowthChart points={points} dob={dob} />}

        {/* Vaccination timeline */}
        <VaccinationTimeline vaccinations={profile.vaccinations} />

        {/* Medical history */}
        <MedicalHistory events={profile.childhood_medical_history} />

        {/* Doctors */}
        <DoctorsGrid doctors={profile.doctors_history} />

        {/* Footer */}
        <div className="text-center text-xs text-zinc-600 pt-4 pb-8">
          Dernière mise à jour: {profile.last_updated} — Données privées, jamais transmises
        </div>
      </div>
    </div>
  );
}

export default function HealthProfilePage() {
  const { token } = useHealthAuth();
  const [activeToken, setActiveToken] = useState<string | null>(null);

  // Check sessionStorage on mount
  const effectiveToken = activeToken || token;

  if (!effectiveToken) {
    return <AuthGate onAuthenticated={setActiveToken} />;
  }

  return <HealthDashboard token={effectiveToken} />;
}
