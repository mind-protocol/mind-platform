'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useSession } from '@/lib/useSession';
import { getHealthSuggestions } from '@/lib/tracker/health-suggestions';

// ─── Types ────────────────────────────────────────────────────────────

interface HealthProfile {
  user_id: string;
  identity: {
    date_of_birth: string;
    sex: string;
    blood_type: string;
    laterality: string;
  };
  body: {
    height_cm: number | null;
    weight_kg: number | null;
    bmi: number | null;
    skin_type: string;
    eye_color: string;
    hair_color: string;
  };
  allergies: string[];
  conditions: ConditionEntry[];
  medications: MedicationEntry[];
  surgeries: SurgeryEntry[];
  family_history: string[];
  lifestyle: {
    smoker: boolean | null;
    alcohol: string;
    exercise_frequency: string;
    diet: string;
    sleep_hours_avg: number | null;
  };
  vaccinations: VaccinationEntry[];
  notes: string;
  documents_processed: string[];
  updated_at?: string;
}

interface ConditionEntry {
  condition: string;
  status: 'active' | 'monitoring' | 'resolved';
}

interface MedicationEntry {
  name: string;
  dose: string;
  frequency: string;
  duration: string;
}

interface SurgeryEntry {
  name: string;
  date: string;
  notes: string;
}

interface VaccinationEntry {
  name: string;
  date: string;
}

type TabKey = 'manual' | 'document' | 'photo';

// ─── Constants ────────────────────────────────────────────────────────

const BLOOD_TYPES = ['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const LATERALITY = ['', 'droitier', 'gaucher', 'ambidextre'];
const SEX_OPTIONS = ['', 'male', 'female', 'intersex', 'other'];
const ALCOHOL_OPTIONS = ['', 'none', 'occasional', 'moderate', 'regular', 'heavy'];
const EXERCISE_OPTIONS = ['', 'none', 'occasional', '1-2x/week', '3-4x/week', 'daily'];
const DIET_OPTIONS = ['', 'omnivore', 'vegetarian', 'vegan', 'pescatarian', 'keto', 'other'];
const CONDITION_STATUSES: ConditionEntry['status'][] = ['active', 'monitoring', 'resolved'];


// ─── Helpers ──────────────────────────────────────────────────────────

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="border border-zinc-800/60 rounded-2xl bg-zinc-900/40 p-5 sm:p-6">
      <h3 className="text-sm font-mono uppercase tracking-wider text-zinc-400 mb-1">{title}</h3>
      {description && <p className="text-xs text-zinc-600 mb-4">{description}</p>}
      {!description && <div className="mb-4" />}
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-zinc-500 mb-1 font-mono">{label}</label>
      {children}
    </div>
  );
}

const inputClass =
  'w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-teal-500 transition';
const selectClass =
  'w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-teal-500 transition';
const btnPrimary =
  'px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed';
const btnSecondary =
  'px-3 py-1.5 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 text-xs rounded-lg transition';

// ─── Estimation Grid (separate component to handle unknown types) ─────

function EstimationCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-zinc-800/50 rounded-lg p-3">
      <div className="text-xs text-zinc-500 font-mono">{label}</div>
      <div className="text-zinc-200 font-medium">{value}</div>
      {sub && <div className="text-[10px] text-zinc-600">{sub}</div>}
    </div>
  );
}

function EstimationGrid({ photoResult }: { photoResult: Record<string, unknown> }) {
  const t = useTranslations('Tracker');
  const cards: { label: string; value: string; sub?: string }[] = [];

  const h = photoResult.height_cm_estimate as { value?: number; confidence?: string } | undefined;
  if (h?.value) cards.push({ label: t('heightCm'), value: `~${h.value} cm`, sub: h.confidence });

  const w = photoResult.weight_kg_estimate as { value?: number; confidence?: string } | undefined;
  if (w?.value) cards.push({ label: t('weightKg'), value: `~${w.value} kg`, sub: w.confidence });

  const bmi = photoResult.bmi_estimate as { value?: number; category?: string } | undefined;
  if (bmi?.value) cards.push({ label: t('bmiLabel'), value: String(bmi.value), sub: bmi.category });

  const skin = photoResult.skin_type as { fitzpatrick?: number; description?: string } | undefined;
  if (skin?.fitzpatrick) cards.push({ label: t('skinType'), value: `Fitzpatrick ${skin.fitzpatrick}`, sub: skin.description });

  const age = photoResult.apparent_age_range as { min?: number; max?: number } | undefined;
  if (age?.min != null && age?.max != null) cards.push({ label: t('eyeColor'), value: `${age.min}–${age.max}` });

  if (photoResult.build) cards.push({ label: 'Build', value: String(photoResult.build) });
  if (photoResult.eye_color) cards.push({ label: t('eyeColor'), value: String(photoResult.eye_color) });
  if (photoResult.hair_color) cards.push({ label: t('hairColor'), value: String(photoResult.hair_color) });

  const visibleConds = photoResult.visible_conditions as string[] | undefined;
  const disclaimer = photoResult.disclaimer as string | undefined;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 text-sm">
        {cards.map((c, i) => (
          <EstimationCard key={i} label={c.label} value={c.value} sub={c.sub} />
        ))}
      </div>

      {visibleConds?.length ? (
        <div>
          <span className="text-zinc-500 text-xs font-mono">{t('observations')}</span>
          <ul className="mt-1 space-y-1">
            {visibleConds.map((c, i) => (
              <li key={i} className="text-zinc-400 text-xs">{'👁'} {c}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {disclaimer ? (
        <p className="text-[10px] text-zinc-600 italic">{disclaimer}</p>
      ) : null}
    </>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────

export default function HealthProfileEditor() {
  const t = useTranslations('Tracker');
  const locale = useLocale();
  const suggestions = getHealthSuggestions(locale);
  const { session, loading: sessionLoading } = useSession();
  const [profile, setProfile] = useState<HealthProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<TabKey>('manual');

  // ─ Document extraction state
  const [docUploading, setDocUploading] = useState(false);
  const [docResult, setDocResult] = useState<Record<string, unknown> | null>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  // ─ Photo estimation state
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoResult, setPhotoResult] = useState<Record<string, unknown> | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // ─ Fetch profile
  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch('/api/tracker/health/profile');
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch {
      setError(t('cannotLoadProfile'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // ─ Save profile
  async function saveProfile() {
    if (!profile) return;
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const res = await fetch('/api/tracker/health/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ /* non-JSON response */ }));
        setError(data.error || t('saveError'));
        return;
      }
      const data = await res.json();
      if (data.profile) setProfile(data.profile);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError(t('networkError'));
    } finally {
      setSaving(false);
    }
  }

  // ─ Updaters
  function updateIdentity(key: string, value: string) {
    if (!profile) return;
    setProfile({ ...profile, identity: { ...profile.identity, [key]: value } });
  }

  function updateBody(key: string, value: string | number | null) {
    if (!profile) return;
    setProfile({ ...profile, body: { ...profile.body, [key]: value } });
  }

  function updateLifestyle(key: string, value: string | boolean | number | null) {
    if (!profile) return;
    setProfile({ ...profile, lifestyle: { ...profile.lifestyle, [key]: value } });
  }

  // ─ List helpers
  function addAllergy() {
    if (!profile) return;
    setProfile({ ...profile, allergies: [...profile.allergies, ''] });
  }
  function updateAllergy(i: number, val: string) {
    if (!profile) return;
    const a = [...profile.allergies];
    a[i] = val;
    setProfile({ ...profile, allergies: a });
  }
  function removeAllergy(i: number) {
    if (!profile) return;
    setProfile({ ...profile, allergies: profile.allergies.filter((_, j) => j !== i) });
  }

  function addCondition() {
    if (!profile) return;
    setProfile({ ...profile, conditions: [...profile.conditions, { condition: '', status: 'active' }] });
  }
  function updateCondition(i: number, key: string, val: string) {
    if (!profile) return;
    const c = [...profile.conditions];
    c[i] = { ...c[i], [key]: val };
    setProfile({ ...profile, conditions: c });
  }
  function removeCondition(i: number) {
    if (!profile) return;
    setProfile({ ...profile, conditions: profile.conditions.filter((_, j) => j !== i) });
  }

  function addMedication() {
    if (!profile) return;
    setProfile({ ...profile, medications: [...profile.medications, { name: '', dose: '', frequency: '', duration: '' }] });
  }
  function updateMedication(i: number, key: string, val: string) {
    if (!profile) return;
    const m = [...profile.medications];
    m[i] = { ...m[i], [key]: val };
    setProfile({ ...profile, medications: m });
  }
  function removeMedication(i: number) {
    if (!profile) return;
    setProfile({ ...profile, medications: profile.medications.filter((_, j) => j !== i) });
  }

  function addVaccination() {
    if (!profile) return;
    setProfile({ ...profile, vaccinations: [...profile.vaccinations, { name: '', date: '' }] });
  }
  function updateVaccination(i: number, key: string, val: string) {
    if (!profile) return;
    const v = [...profile.vaccinations];
    v[i] = { ...v[i], [key]: val };
    setProfile({ ...profile, vaccinations: v });
  }
  function removeVaccination(i: number) {
    if (!profile) return;
    setProfile({ ...profile, vaccinations: profile.vaccinations.filter((_, j) => j !== i) });
  }

  function addSurgery() {
    if (!profile) return;
    setProfile({ ...profile, surgeries: [...profile.surgeries, { name: '', date: '', notes: '' }] });
  }
  function updateSurgery(i: number, key: string, val: string) {
    if (!profile) return;
    const s = [...profile.surgeries];
    s[i] = { ...s[i], [key]: val };
    setProfile({ ...profile, surgeries: s });
  }
  function removeSurgery(i: number) {
    if (!profile) return;
    setProfile({ ...profile, surgeries: profile.surgeries.filter((_, j) => j !== i) });
  }

  function addFamilyHistory() {
    if (!profile) return;
    setProfile({ ...profile, family_history: [...profile.family_history, ''] });
  }
  function updateFamilyHistory(i: number, val: string) {
    if (!profile) return;
    const f = [...profile.family_history];
    f[i] = val;
    setProfile({ ...profile, family_history: f });
  }
  function removeFamilyHistory(i: number) {
    if (!profile) return;
    setProfile({ ...profile, family_history: profile.family_history.filter((_, j) => j !== i) });
  }

  // ─ Document upload
  async function handleDocUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setDocUploading(true);
    setDocResult(null);
    setError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/tracker/health/extract-document', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t('extractionFailed'));
        return;
      }
      setDocResult(data.extraction);
    } catch {
      setError(t('networkErrorExtraction'));
    } finally {
      setDocUploading(false);
      if (docInputRef.current) docInputRef.current.value = '';
    }
  }

  // ─ Apply extracted document data to profile
  function applyDocExtraction() {
    if (!profile || !docResult) return;
    const p = { ...profile };

    // Medications
    const meds = docResult.medications as MedicationEntry[] | undefined;
    if (meds?.length) {
      const existing = new Set(p.medications.map(m => m.name.toLowerCase()));
      for (const m of meds) {
        if (!existing.has(m.name.toLowerCase())) {
          p.medications.push({ name: m.name, dose: m.dose || '', frequency: m.frequency || '', duration: m.duration || '' });
        }
      }
    }

    // Conditions
    const conds = docResult.conditions as ConditionEntry[] | undefined;
    if (conds?.length) {
      const existing = new Set(p.conditions.map(c => c.condition.toLowerCase()));
      for (const c of conds) {
        if (!existing.has(c.condition.toLowerCase())) {
          p.conditions.push({ condition: c.condition, status: c.status || 'active' });
        }
      }
    }

    // Allergies
    const allergies = docResult.allergies as string[] | undefined;
    if (allergies?.length) {
      const existing = new Set(p.allergies.map(a => a.toLowerCase()));
      for (const a of allergies) {
        if (!existing.has(a.toLowerCase())) p.allergies.push(a);
      }
    }

    // Vaccinations
    const vaccs = docResult.vaccinations as VaccinationEntry[] | undefined;
    if (vaccs?.length) {
      const existing = new Set(p.vaccinations.map(v => v.name.toLowerCase()));
      for (const v of vaccs) {
        if (!existing.has(v.name.toLowerCase())) p.vaccinations.push({ name: v.name, date: v.date || '' });
      }
    }

    // Body data
    const body = docResult.body as Record<string, unknown> | undefined;
    if (body) {
      if (body.height_cm && !p.body.height_cm) p.body.height_cm = Number(body.height_cm);
      if (body.weight_kg && !p.body.weight_kg) p.body.weight_kg = Number(body.weight_kg);
      if (body.blood_type && !p.identity.blood_type) p.identity.blood_type = String(body.blood_type);
    }

    // Track processed document
    const src = docResult.source_file as string | undefined;
    if (src) {
      p.documents_processed = [...(p.documents_processed || []), src];
    }

    setProfile(p);
    setDocResult(null);
  }

  // ─ Photo estimation
  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoUploading(true);
    setPhotoResult(null);
    setError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/tracker/health/estimate-from-photo', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t('estimationFailed'));
        return;
      }
      setPhotoResult(data.estimation);
    } catch {
      setError(t('networkErrorEstimation'));
    } finally {
      setPhotoUploading(false);
      if (photoInputRef.current) photoInputRef.current.value = '';
    }
  }

  // ─ Apply photo estimation to profile
  function applyPhotoEstimation() {
    if (!profile || !photoResult) return;
    const p = { ...profile };

    const heightEst = photoResult.height_cm_estimate as { value?: number } | undefined;
    const weightEst = photoResult.weight_kg_estimate as { value?: number } | undefined;
    const skinType = photoResult.skin_type as { fitzpatrick?: number; description?: string } | undefined;
    const eyeColor = photoResult.eye_color as string | undefined;
    const hairColor = photoResult.hair_color as string | undefined;
    const sexApparent = photoResult.sex_apparent as string | undefined;

    if (heightEst?.value && !p.body.height_cm) p.body.height_cm = Math.round(heightEst.value);
    if (weightEst?.value && !p.body.weight_kg) p.body.weight_kg = Math.round(weightEst.value);
    if (skinType?.description && !p.body.skin_type) p.body.skin_type = skinType.description;
    if (eyeColor && !p.body.eye_color) p.body.eye_color = eyeColor;
    if (hairColor && !p.body.hair_color) p.body.hair_color = hairColor;
    if (sexApparent && !p.identity.sex) p.identity.sex = sexApparent;

    setProfile(p);
    setPhotoResult(null);
  }

  // ─ Auth guard
  if (sessionLoading || loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-500 text-sm">{t('loadingProfile')}</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-4xl mb-4">{'🔒'}</div>
          <p className="text-zinc-400 mb-4">{t('loginRequired')}</p>
          <Link href="/login" className={btnPrimary}>{t('signIn')}</Link>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-red-400 text-sm">{error || t('profileNotFound')}</div>
      </div>
    );
  }

  const bmi = profile.body.height_cm && profile.body.weight_kg
    ? (profile.body.weight_kg / ((profile.body.height_cm / 100) ** 2)).toFixed(1)
    : null;

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Link href="/tracker" className="text-zinc-500 hover:text-white text-xs font-mono transition">
              &larr; tracker
            </Link>
            <span className="text-zinc-700">/</span>
            <h1 className="text-xl font-bold font-mono">{t('healthRecord')}</h1>
          </div>
          <p className="text-zinc-500 text-sm">
            {t('healthRecordDesc')}
          </p>
        </header>

        {/* Tab bar */}
        <div className="flex gap-1 mb-8 p-1 bg-zinc-900 rounded-xl border border-zinc-800/50">
          {([
            { key: 'manual' as TabKey, label: t('manualTab'), icon: '📝' },
            { key: 'document' as TabKey, label: t('documentTab'), icon: '📄' },
            { key: 'photo' as TabKey, label: t('photoTab'), icon: '📸' },
          ]).map(tb => (
            <button
              key={tb.key}
              onClick={() => setTab(tb.key)}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition ${
                tab === tb.key
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <span className="mr-1.5">{tb.icon}</span>
              {tb.label}
            </button>
          ))}
        </div>

        {/* ═══ MANUAL TAB ═══ */}
        {tab === 'manual' && (
          <div className="space-y-6">
            {/* Identity */}
            <Section title={t('identitySection')} description={t('basicInfo')}>
              <div className="grid grid-cols-2 gap-4">
                <Field label={t('dateOfBirth')}>
                  <input
                    type="date"
                    value={profile.identity.date_of_birth}
                    onChange={e => updateIdentity('date_of_birth', e.target.value)}
                    className={inputClass}
                  />
                </Field>
                <Field label={t('sex')}>
                  <select value={profile.identity.sex} onChange={e => updateIdentity('sex', e.target.value)} className={selectClass}>
                    {SEX_OPTIONS.map(o => <option key={o} value={o}>{o || '—'}</option>)}
                  </select>
                </Field>
                <Field label={t('bloodType')}>
                  <select value={profile.identity.blood_type} onChange={e => updateIdentity('blood_type', e.target.value)} className={selectClass}>
                    {BLOOD_TYPES.map(o => <option key={o} value={o}>{o || '—'}</option>)}
                  </select>
                </Field>
                <Field label={t('laterality')}>
                  <select value={profile.identity.laterality} onChange={e => updateIdentity('laterality', e.target.value)} className={selectClass}>
                    {LATERALITY.map(o => <option key={o} value={o}>{o || '—'}</option>)}
                  </select>
                </Field>
              </div>
            </Section>

            {/* Body */}
            <Section title={t('bodySection')} description={t('bodyDesc')}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Field label={t('heightCm')}>
                  <input
                    type="number"
                    value={profile.body.height_cm ?? ''}
                    onChange={e => updateBody('height_cm', e.target.value ? Number(e.target.value) : null)}
                    placeholder="175"
                    className={inputClass}
                  />
                </Field>
                <Field label={t('weightKg')}>
                  <input
                    type="number"
                    value={profile.body.weight_kg ?? ''}
                    onChange={e => updateBody('weight_kg', e.target.value ? Number(e.target.value) : null)}
                    placeholder="70"
                    className={inputClass}
                  />
                </Field>
                <Field label={t('bmiLabel')}>
                  <div className="px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-400 font-mono">
                    {bmi || '—'}
                  </div>
                </Field>
                <Field label={t('skinType')}>
                  <select value={profile.body.skin_type} onChange={e => updateBody('skin_type', e.target.value)} className={selectClass}>
                    {suggestions.SKIN_TYPE_OPTIONS.map(o => <option key={o} value={o}>{o || '—'}</option>)}
                  </select>
                </Field>
                <Field label={t('eyeColor')}>
                  <select value={profile.body.eye_color} onChange={e => updateBody('eye_color', e.target.value)} className={selectClass}>
                    {suggestions.EYE_COLOR_OPTIONS.map(o => <option key={o} value={o}>{o || '—'}</option>)}
                  </select>
                </Field>
                <Field label={t('hairColor')}>
                  <select value={profile.body.hair_color} onChange={e => updateBody('hair_color', e.target.value)} className={selectClass}>
                    {suggestions.HAIR_COLOR_OPTIONS.map(o => <option key={o} value={o}>{o || '—'}</option>)}
                  </select>
                </Field>
              </div>
            </Section>

            {/* Allergies */}
            <Section title={t('allergiesSection')}>
              <datalist id="allergy-suggestions">
                {suggestions.ALLERGY_SUGGESTIONS.map(s => <option key={s} value={s} />)}
              </datalist>
              <div className="space-y-2">
                {profile.allergies.map((a, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      list="allergy-suggestions"
                      value={a}
                      onChange={e => updateAllergy(i, e.target.value)}
                      placeholder="Ex: pénicilline, arachides..."
                      className={`${inputClass} flex-1`}
                    />
                    <button onClick={() => removeAllergy(i)} className="text-red-400 hover:text-red-300 text-xs px-2">
                      {'✕'}
                    </button>
                  </div>
                ))}
                <button onClick={addAllergy} className={btnSecondary}>{t('addAllergiesBtn')}</button>
              </div>
            </Section>

            {/* Conditions */}
            <Section title={t('pathologiesSection')}>
              <datalist id="condition-suggestions">
                {suggestions.CONDITION_SUGGESTIONS.map(s => <option key={s} value={s} />)}
              </datalist>
              <div className="space-y-3">
                {profile.conditions.map((c, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <input
                      type="text"
                      list="condition-suggestions"
                      value={c.condition}
                      onChange={e => updateCondition(i, 'condition', e.target.value)}
                      placeholder="Ex: asthme, hypertension..."
                      className={`${inputClass} flex-1`}
                    />
                    <select
                      value={c.status}
                      onChange={e => updateCondition(i, 'status', e.target.value)}
                      className={`${selectClass} w-32`}
                    >
                      {CONDITION_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button onClick={() => removeCondition(i)} className="text-red-400 hover:text-red-300 text-xs px-2 mt-2">
                      {'✕'}
                    </button>
                  </div>
                ))}
                <button onClick={addCondition} className={btnSecondary}>{t('addPathologyBtn')}</button>
              </div>
            </Section>

            {/* Medications */}
            <Section title={t('currentMedications')}>
              <datalist id="medication-suggestions">
                {suggestions.MEDICATION_SUGGESTIONS.map(s => <option key={s} value={s} />)}
              </datalist>
              <div className="space-y-3">
                {profile.medications.map((m, i) => (
                  <div key={i} className="grid grid-cols-2 sm:grid-cols-4 gap-2 items-start">
                    <input
                      type="text"
                      list="medication-suggestions"
                      value={m.name}
                      onChange={e => updateMedication(i, 'name', e.target.value)}
                      placeholder="Nom"
                      className={inputClass}
                    />
                    <input
                      type="text"
                      value={m.dose}
                      onChange={e => updateMedication(i, 'dose', e.target.value)}
                      placeholder="Ex: 500mg, 10ml..."
                      className={inputClass}
                    />
                    <select
                      value={m.frequency}
                      onChange={e => updateMedication(i, 'frequency', e.target.value)}
                      className={selectClass}
                    >
                      {suggestions.FREQUENCY_OPTIONS.map(o => <option key={o} value={o}>{o || '—'}</option>)}
                    </select>
                    <div className="flex gap-1">
                      <select
                        value={m.duration}
                        onChange={e => updateMedication(i, 'duration', e.target.value)}
                        className={`${selectClass} flex-1`}
                      >
                        {suggestions.DURATION_OPTIONS.map(o => <option key={o} value={o}>{o || '—'}</option>)}
                      </select>
                      <button onClick={() => removeMedication(i)} className="text-red-400 hover:text-red-300 text-xs px-1">
                        {'✕'}
                      </button>
                    </div>
                  </div>
                ))}
                <button onClick={addMedication} className={btnSecondary}>{t('addMedicationBtn')}</button>
              </div>
            </Section>

            {/* Surgeries */}
            <Section title={t('surgicalInterventions')}>
              <datalist id="surgery-suggestions">
                {suggestions.SURGERY_SUGGESTIONS.map(s => <option key={s} value={s} />)}
              </datalist>
              <div className="space-y-3">
                {profile.surgeries.map((s, i) => (
                  <div key={i} className="grid grid-cols-3 gap-2 items-start">
                    <input
                      type="text"
                      list="surgery-suggestions"
                      value={s.name}
                      onChange={e => updateSurgery(i, 'name', e.target.value)}
                      placeholder="Intervention"
                      className={inputClass}
                    />
                    <input
                      type="date"
                      value={s.date}
                      onChange={e => updateSurgery(i, 'date', e.target.value)}
                      className={inputClass}
                    />
                    <div className="flex gap-1">
                      <input
                        type="text"
                        value={s.notes}
                        onChange={e => updateSurgery(i, 'notes', e.target.value)}
                        placeholder="Notes"
                        className={`${inputClass} flex-1`}
                      />
                      <button onClick={() => removeSurgery(i)} className="text-red-400 hover:text-red-300 text-xs px-1">
                        {'✕'}
                      </button>
                    </div>
                  </div>
                ))}
                <button onClick={addSurgery} className={btnSecondary}>{t('addSurgeryBtn')}</button>
              </div>
            </Section>

            {/* Vaccinations */}
            <Section title={t('vaccinationsSection')}>
              <datalist id="vaccination-suggestions">
                {suggestions.VACCINATION_SUGGESTIONS.map(s => <option key={s} value={s} />)}
              </datalist>
              <div className="space-y-2">
                {profile.vaccinations.map((v, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      list="vaccination-suggestions"
                      value={v.name}
                      onChange={e => updateVaccination(i, 'name', e.target.value)}
                      placeholder="Vaccin"
                      className={`${inputClass} flex-1`}
                    />
                    <input
                      type="date"
                      value={v.date}
                      onChange={e => updateVaccination(i, 'date', e.target.value)}
                      className={`${inputClass} w-40`}
                    />
                    <button onClick={() => removeVaccination(i)} className="text-red-400 hover:text-red-300 text-xs px-2">
                      {'✕'}
                    </button>
                  </div>
                ))}
                <button onClick={addVaccination} className={btnSecondary}>{t('addVaccinationBtn')}</button>
              </div>
            </Section>

            {/* Family history */}
            <Section title={t('familyHistory')}>
              <datalist id="family-history-suggestions">
                {suggestions.FAMILY_HISTORY_SUGGESTIONS.map(s => <option key={s} value={s} />)}
              </datalist>
              <div className="space-y-2">
                {profile.family_history.map((h, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      list="family-history-suggestions"
                      value={h}
                      onChange={e => updateFamilyHistory(i, e.target.value)}
                      placeholder="Ex: diabète (mère), cancer colon (père)..."
                      className={`${inputClass} flex-1`}
                    />
                    <button onClick={() => removeFamilyHistory(i)} className="text-red-400 hover:text-red-300 text-xs px-2">
                      {'✕'}
                    </button>
                  </div>
                ))}
                <button onClick={addFamilyHistory} className={btnSecondary}>{t('addFamilyHistoryBtn')}</button>
              </div>
            </Section>

            {/* Lifestyle */}
            <Section title={t('lifestyleTitle')}>
              <div className="grid grid-cols-2 gap-4">
                <Field label={t('smokerLabel')}>
                  <select
                    value={profile.lifestyle.smoker === null ? '' : profile.lifestyle.smoker ? 'true' : 'false'}
                    onChange={e => updateLifestyle('smoker', e.target.value === '' ? null : e.target.value === 'true')}
                    className={selectClass}
                  >
                    <option value="">—</option>
                    <option value="true">{t('yes')}</option>
                    <option value="false">{t('no')}</option>
                  </select>
                </Field>
                <Field label={t('alcoholLabel')}>
                  <select value={profile.lifestyle.alcohol} onChange={e => updateLifestyle('alcohol', e.target.value)} className={selectClass}>
                    {ALCOHOL_OPTIONS.map(o => <option key={o} value={o}>{o || '—'}</option>)}
                  </select>
                </Field>
                <Field label={t('exerciseLabel')}>
                  <select value={profile.lifestyle.exercise_frequency} onChange={e => updateLifestyle('exercise_frequency', e.target.value)} className={selectClass}>
                    {EXERCISE_OPTIONS.map(o => <option key={o} value={o}>{o || '—'}</option>)}
                  </select>
                </Field>
                <Field label={t('dietLabel')}>
                  <select value={profile.lifestyle.diet} onChange={e => updateLifestyle('diet', e.target.value)} className={selectClass}>
                    {DIET_OPTIONS.map(o => <option key={o} value={o}>{o || '—'}</option>)}
                  </select>
                </Field>
                <Field label={t('sleepHoursLabel')}>
                  <input
                    type="number"
                    step="0.5"
                    value={profile.lifestyle.sleep_hours_avg ?? ''}
                    onChange={e => updateLifestyle('sleep_hours_avg', e.target.value ? Number(e.target.value) : null)}
                    placeholder="7.5"
                    className={inputClass}
                  />
                </Field>
              </div>
            </Section>

            {/* Notes */}
            <Section title={t('freeNotesTitle')}>
              <textarea
                value={profile.notes}
                onChange={e => setProfile({ ...profile, notes: e.target.value })}
                rows={4}
                placeholder={t('additionalInfo')}
                className={`${inputClass} resize-y`}
              />
            </Section>
          </div>
        )}

        {/* ═══ DOCUMENT TAB ═══ */}
        {tab === 'document' && (
          <div className="space-y-6">
            <Section
              title={t('scanDocument')}
              description={t('scanDocumentDesc')}
            >
              <div className="space-y-4">
                <div
                  onClick={() => docInputRef.current?.click()}
                  className="border-2 border-dashed border-zinc-700 hover:border-teal-500/50 rounded-xl p-8 text-center cursor-pointer transition group"
                >
                  <input
                    ref={docInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/heic"
                    onChange={handleDocUpload}
                    className="hidden"
                  />
                  {docUploading ? (
                    <div>
                      <div className="text-2xl mb-2 animate-pulse">{'🔍'}</div>
                      <p className="text-sm text-zinc-400">{t('analyzing2')}</p>
                      <p className="text-xs text-zinc-600 mt-1">{t('aiReading')}</p>
                    </div>
                  ) : (
                    <div>
                      <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{'📄'}</div>
                      <p className="text-sm text-zinc-300">{t('clickToUpload')}</p>
                      <p className="text-xs text-zinc-600 mt-1">{t('fileFormats')}</p>
                    </div>
                  )}
                </div>

                {/* Extraction result preview */}
                {docResult && (
                  <div className="bg-zinc-900 border border-teal-500/30 rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-teal-400">
                        {'🔍'} {t('extractedData')}
                        {docResult.confidence !== undefined && (
                          <span className="ml-2 text-xs text-zinc-500 font-mono">
                            {t('confidence')}: {Math.round(Number(docResult.confidence) * 100)}%
                          </span>
                        )}
                      </h4>
                      <span className="text-xs text-zinc-500 font-mono">{String(docResult.document_type || 'document')}</span>
                    </div>

                    {/* Show extracted fields */}
                    <div className="space-y-2 text-sm">
                      {(docResult.medications as MedicationEntry[] | undefined)?.length ? (
                        <div>
                          <span className="text-zinc-500 text-xs font-mono">{t('medicationsLabel')}:</span>
                          <ul className="mt-1 space-y-1">
                            {(docResult.medications as MedicationEntry[]).map((m, i) => (
                              <li key={i} className="text-zinc-300 text-xs">
                                {'💊'} {m.name} {m.dose && `— ${m.dose}`} {m.frequency && `(${m.frequency})`}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {(docResult.conditions as ConditionEntry[] | undefined)?.length ? (
                        <div>
                          <span className="text-zinc-500 text-xs font-mono">{t('conditionsLabel')}:</span>
                          <ul className="mt-1 space-y-1">
                            {(docResult.conditions as ConditionEntry[]).map((c, i) => (
                              <li key={i} className="text-zinc-300 text-xs">{'🏥'} {c.condition} ({c.status})</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {(docResult.allergies as string[] | undefined)?.length ? (
                        <div>
                          <span className="text-zinc-500 text-xs font-mono">{t('allergiesSection')}:</span>
                          <span className="text-zinc-300 text-xs ml-2">
                            {(docResult.allergies as string[]).join(', ')}
                          </span>
                        </div>
                      ) : null}

                      {(docResult.vaccinations as VaccinationEntry[] | undefined)?.length ? (
                        <div>
                          <span className="text-zinc-500 text-xs font-mono">{t('vaccinesLabel')}:</span>
                          <ul className="mt-1 space-y-1">
                            {(docResult.vaccinations as VaccinationEntry[]).map((v, i) => (
                              <li key={i} className="text-zinc-300 text-xs">{'💉'} {v.name} {v.date && `(${v.date})`}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {(docResult.lab_results as Array<Record<string, string>> | undefined)?.length ? (
                        <div>
                          <span className="text-zinc-500 text-xs font-mono">{t('labResults')}:</span>
                          <ul className="mt-1 space-y-1">
                            {(docResult.lab_results as Array<Record<string, string>>).map((r, i) => (
                              <li key={i} className={`text-xs ${r.flag === 'high' ? 'text-red-400' : r.flag === 'low' ? 'text-amber-400' : 'text-zinc-300'}`}>
                                {'🧪'} {r.test}: {r.value} {r.unit} {r.reference && `(ref: ${r.reference})`}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {docResult.raw_text ? (
                        <details className="mt-2">
                          <summary className="text-zinc-500 text-xs font-mono cursor-pointer hover:text-zinc-300">
                            {t('rawText')}
                          </summary>
                          <pre className="mt-1 text-xs text-zinc-600 whitespace-pre-wrap max-h-40 overflow-y-auto">
                            {String(docResult.raw_text)}
                          </pre>
                        </details>
                      ) : null}
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-zinc-800">
                      <button onClick={applyDocExtraction} className={btnPrimary}>
                        {t('applyToProfile')}
                      </button>
                      <button onClick={() => setDocResult(null)} className={btnSecondary}>
                        {t('ignore')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </Section>

            <div className="text-xs text-zinc-600 text-center">
              {t('docDisclaimer')}
            </div>
          </div>
        )}

        {/* ═══ PHOTO TAB ═══ */}
        {tab === 'photo' && (
          <div className="space-y-6">
            <Section
              title={t('photoEstimation')}
              description={t('photoEstimationDesc')}
            >
              <div className="space-y-4">
                <div
                  onClick={() => photoInputRef.current?.click()}
                  className="border-2 border-dashed border-zinc-700 hover:border-teal-500/50 rounded-xl p-8 text-center cursor-pointer transition group"
                >
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/heic"
                    capture="user"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  {photoUploading ? (
                    <div>
                      <div className="text-2xl mb-2 animate-pulse">{'🔍'}</div>
                      <p className="text-sm text-zinc-400">{t('analyzing2')}</p>
                      <p className="text-xs text-zinc-600 mt-1">{t('estimatingFeatures')}</p>
                    </div>
                  ) : (
                    <div>
                      <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{'📸'}</div>
                      <p className="text-sm text-zinc-300">{t('clickToTakePhoto')}</p>
                      <p className="text-xs text-zinc-600 mt-1">{t('photoFormats')}</p>
                    </div>
                  )}
                </div>

                {/* Estimation result preview */}
                {photoResult && (
                  <div className="bg-zinc-900 border border-teal-500/30 rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-teal-400">
                        {'📊'} {t('estimationsLabel')}
                      </h4>
                      {photoResult.overall_confidence !== undefined && (
                        <span className="text-xs text-zinc-500 font-mono">
                          {t('confidence')}: {Math.round(Number(photoResult.overall_confidence) * 100)}%
                        </span>
                      )}
                    </div>

                    <EstimationGrid photoResult={photoResult} />

                    <div className="flex gap-2 pt-2 border-t border-zinc-800">
                      <button onClick={applyPhotoEstimation} className={btnPrimary}>
                        {t('applyEstimations')}
                      </button>
                      <button onClick={() => setPhotoResult(null)} className={btnSecondary}>
                        {t('ignore')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </Section>

            <div className="text-xs text-zinc-600 text-center">
              {t('photoDisclaimer')}
            </div>
          </div>
        )}

        {/* ═══ SAVE BAR ═══ */}
        <div className="sticky bottom-0 mt-8 py-4 bg-zinc-950/90 backdrop-blur-sm border-t border-zinc-800/50">
          <div className="flex items-center justify-between gap-4">
            <div className="text-xs text-zinc-600 font-mono">
              {profile.updated_at && `${t('updatedAt')} ${new Date(profile.updated_at).toLocaleDateString()}`}
            </div>
            <div className="flex items-center gap-3">
              {error && <span className="text-red-400 text-xs">{error}</span>}
              {saved && <span className="text-emerald-400 text-xs">{t('savedProfile')}</span>}
              <button onClick={saveProfile} disabled={saving} className={btnPrimary}>
                {saving ? t('savingProfile') : t('saveProfile')}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-4 text-center">
          <p className="text-xs text-zinc-600 font-mono">
            {t('privateDataFooter')}
          </p>
        </footer>
      </div>
    </main>
  );
}
