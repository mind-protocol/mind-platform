'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useSession } from '@/lib/useSession';
import { useHealthProfile, useGrowthData } from '@/lib/tracker/hooks/useHealthProfile';
import SanitizeToggle from '@/components/SanitizeToggle';
import ProfileHeader from './components/ProfileHeader';
import CurrentMedications from './components/CurrentMedications';
import CurrentPathologies from './components/CurrentPathologies';
import SupportedConditions from './components/SupportedConditions';
import GrowthChart from './components/GrowthChart';
import VaccinationTimeline from './components/VaccinationTimeline';
import MedicalHistory from './components/MedicalHistory';
import DoctorsGrid from './components/DoctorsGrid';

function HealthDashboard({ onLogout }: { onLogout: () => Promise<void> }) {
  const t = useTranslations('Tracker');
  const { profile, loading: profileLoading, error } = useHealthProfile(true);
  const { points, dob } = useGrowthData(true);

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="text-red-400">Failed to load medical record</div>
          <div className="text-sm text-zinc-500">{error}</div>
          <button onClick={() => window.location.reload()} className="text-sm text-teal-400 hover:underline mt-2">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (profileLoading || !profile) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-500">{t('loadingRecord')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-teal-400">{t('medicalRecord')}</h1>
          <div className="flex gap-2 items-center">
            <SanitizeToggle />
            <button
              onClick={onLogout}
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {t('lock')}
            </button>
          </div>
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

        {/* Biometric insights for chronic conditions */}
        <SupportedConditions pathologies={profile.current_pathologies} />

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
          {t('lastUpdated')} {profile.last_updated} — {t('privateData')}
        </div>
      </div>
    </div>
  );
}

export default function HealthProfilePage() {
  const t = useTranslations('Tracker');
  const { session, loading, logout } = useSession();

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-500">Authenticating...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 w-full max-w-sm space-y-6 text-center">
          <div className="text-3xl mb-2">🔒</div>
          <h1 className="text-xl font-semibold text-zinc-100">{t('medicalRecord')}</h1>
          <p className="text-sm text-zinc-500 mt-1">{t('protectedAccess')}</p>
          <Link
            href="/login"
            className="block w-full bg-teal-600 hover:bg-teal-500 text-white font-medium py-3 rounded-lg transition-colors"
          >
            {t('login')}
          </Link>
        </div>
      </div>
    );
  }

  return <HealthDashboard onLogout={logout} />;
}
