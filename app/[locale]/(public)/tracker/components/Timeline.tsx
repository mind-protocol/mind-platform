'use client';

import { useEffect, useState, useCallback, memo } from 'react';
import { useSanitizeMode, isSanitized, isEffectSanitized } from '@/lib/use-sanitize';
import { useToast } from '@/components/Toast';

interface LogEntry {
  id: string;
  ts: string;
  substance: string;
  dose: { amount: number; unit: string; details: Record<string, unknown> };
  intent: string;
  notes: string;
  biometrics_at_log: {
    hr: number | null;
    stress: number | null;
    body_battery: number | null;
    ans_mode: string;
  } | null;
}

interface AdverseEntry {
  id: string;
  ts: string;
  type: 'adverse_effect';
  effect: string;
  severity: string;
  notes: string;
  biometrics_at_log: {
    hr: number | null;
    stress: number | null;
    body_battery: number | null;
    ans_mode: string;
  } | null;
}

type TimelineItem =
  | { kind: 'substance'; data: LogEntry }
  | { kind: 'adverse'; data: AdverseEntry };

const ADVERSE_CONFIG: Record<string, { color: string; icon: string; label: string }> = {
  // Gastrointestinal
  nausea: { color: '#facc15', icon: '🤢', label: 'Nausée' },
  retching: { color: '#f97316', icon: '😫', label: 'Haut-le-coeur' },
  vomiting: { color: '#ef4444', icon: '🤮', label: 'Vomissement' },
  vomiting_blood: { color: '#ef4444', icon: '🩸', label: 'Vomissement sang' },
  vomiting_bile: { color: '#f97316', icon: '🟡', label: 'Vomissement bile' },
  vomiting_food: { color: '#f97316', icon: '🍽️', label: 'Vomissement nourriture' },
  vomiting_dry: { color: '#f97316', icon: '😖', label: 'Vomissement à vide' },
  diarrhea: { color: '#f97316', icon: '🚽', label: 'Diarrhée' },
  stomach_pain: { color: '#f97316', icon: '🫄', label: 'Douleur abdominale' },
  flatulence: { color: '#facc15', icon: '💨', label: 'Flatulences' },
  bloating: { color: '#facc15', icon: '🫧', label: 'Gaz / ballonnements' },
  acid_reflux: { color: '#f97316', icon: '🔥', label: 'Remontées acides' },
  epigastric_pain: { color: '#f97316', icon: '🎯', label: 'Douleur épigastrique' },
  liver_pain: { color: '#f97316', icon: '🫁', label: 'Douleur foie' },
  subcostal_pain_left: { color: '#f97316', icon: '◀️', label: 'Sous-costal gauche' },
  // ORL
  cough_wet: { color: '#facc15', icon: '💦', label: 'Toux grasse' },
  cough_dry: { color: '#facc15', icon: '😤', label: 'Toux sèche' },
  throat_irritation: { color: '#facc15', icon: '🔴', label: 'Gorge irritée' },
  nasal_irritation: { color: '#facc15', icon: '👃', label: 'Nez irrité' },
  nasal_congestion_both: { color: '#facc15', icon: '🤧', label: 'Nez bouché (2 narines)' },
  nasal_congestion_one: { color: '#facc15', icon: '😤', label: 'Nez bouché (1 narine)' },
  nasal_congestion_fluid: { color: '#facc15', icon: '💧', label: 'Nez qui coule' },
  nosebleed: { color: '#f97316', icon: '🩸', label: 'Saignement de nez' },
  tinnitus: { color: '#f97316', icon: '🔔', label: 'Acouphènes' },
  // Respiratory
  breathing_shallow: { color: '#f97316', icon: '🫁', label: 'Respiration superficielle' },
  breathing_blocked: { color: '#ef4444', icon: '🚫', label: 'Respiration bloquée' },
  breathing_panting: { color: '#ef4444', icon: '💨', label: 'Respiration haletante' },
  respiratory_slow: { color: '#ef4444', icon: '🐢', label: 'Respiration lente' },
  hyperventilation: { color: '#ef4444', icon: '🌬️', label: 'Hyperventilation' },
  chest_tightness: { color: '#ef4444', icon: '🫀', label: 'Oppression thoracique' },
  // Neurological
  headache: { color: '#facc15', icon: '🤕', label: 'Céphalée' },
  migraine: { color: '#f97316', icon: '⚡', label: 'Migraine' },
  dizziness: { color: '#f97316', icon: '💫', label: 'Vertiges' },
  tremors_general: { color: '#f97316', icon: '🫨', label: 'Tremblements' },
  tremors: { color: '#f97316', icon: '🫨', label: 'Tremblements' },
  numbness: { color: '#f97316', icon: '🧊', label: 'Engourdissement' },
  brain_fog: { color: '#facc15', icon: '🌫️', label: 'Brouillard mental' },
  visual_disturbance: { color: '#f97316', icon: '👁️', label: 'Troubles visuels' },
  // Cardiovascular
  tachycardia: { color: '#ef4444', icon: '💓', label: 'Tachycardie' },
  palpitations: { color: '#f97316', icon: '💗', label: 'Palpitations' },
  hypotension: { color: '#f97316', icon: '⬇️', label: 'Vertige orthostatique' },
  chest_pain: { color: '#ef4444', icon: '❤️‍🩹', label: 'Douleur thoracique' },
  // Thermoregulation
  hot_flash: { color: '#facc15', icon: '🥵', label: 'Bouffée de chaleur' },
  cold_flash: { color: '#facc15', icon: '🥶', label: 'Frisson' },
  sweating: { color: '#f97316', icon: '💦', label: 'Sueurs' },
  hyperthermia: { color: '#ef4444', icon: '🌡️', label: 'Fièvre' },
  night_sweats: { color: '#f97316', icon: '🌙', label: 'Sueurs nocturnes' },
  // Psychological
  anxiety_spike: { color: '#f97316', icon: '😰', label: 'Anxiété' },
  panic_attack: { color: '#ef4444', icon: '🚨', label: 'Attaque de panique' },
  mood_crash: { color: '#f97316', icon: '📉', label: "Chute d'humeur" },
  agitation: { color: '#f97316', icon: '⚡', label: 'Agitation' },
  confusion: { color: '#ef4444', icon: '🌀', label: 'Confusion' },
  depersonalization: { color: '#f97316', icon: '👤', label: 'Dépersonnalisation' },
  irritability: { color: '#facc15', icon: '😤', label: 'Irritabilité' },
  insomnia: { color: '#f97316', icon: '🌃', label: 'Insomnie' },
  fatigue_sudden: { color: '#facc15', icon: '🔋', label: 'Fatigue soudaine' },
  // Musculoskeletal
  myoclonus: { color: '#f97316', icon: '💪', label: 'Contractions' },
  ataxia: { color: '#f97316', icon: '🥴', label: "Perte d'équilibre" },
  muscle_tension: { color: '#f97316', icon: '🔗', label: 'Tensions' },
  jaw_clenching: { color: '#f97316', icon: '😬', label: 'Serrement mâchoire' },
  back_pain: { color: '#facc15', icon: '🔙', label: 'Douleur dorsale' },
  joint_pain: { color: '#facc15', icon: '🦴', label: 'Douleur articulaire' },
  excessive_sedation: { color: '#f97316', icon: '😴', label: 'Somnolence' },
  // Cutaneous / Ocular
  rash: { color: '#f97316', icon: '🔴', label: 'Éruption cutanée' },
  itching: { color: '#facc15', icon: '🩹', label: 'Démangeaisons' },
  dry_eyes: { color: '#facc15', icon: '👁️', label: 'Yeux secs' },
  pupil_dilation: { color: '#f97316', icon: '⭕', label: 'Mydriase' },
  // Urogenital
  frequent_urination: { color: '#facc15', icon: '🚿', label: 'Pollakiurie' },
  urinary_retention: { color: '#f97316', icon: '⏸️', label: 'Rétention urinaire' },
  libido_change: { color: '#facc15', icon: '💜', label: 'Changement libido' },
  anorgasmia: { color: '#f97316', icon: '⬜', label: 'Anorgasmie' },
};

const SUB_CONFIG: Record<string, { color: string; icon: string; label: string }> = {
  thc: { color: '#22c55e', icon: '🌿', label: 'THC' },
  cbd: { color: '#84cc16', icon: '🌱', label: 'CBD' },
  lions_mane: { color: '#b45309', icon: '🦁', label: "Lion's Mane" },
  caffeine: { color: '#d97706', icon: '☕', label: 'Café' },
  ketamine: { color: '#8b5cf6', icon: '💎', label: 'K' },
  lsd: { color: '#ec4899', icon: '🔮', label: 'LSD' },
  nicotine: { color: '#f59e0b', icon: '💨', label: 'Nic' },
  hydration: { color: '#3b82f6', icon: '💧', label: 'H₂O' },
  melatonin: { color: '#6366f1', icon: '🌙', label: 'Mel' },
  venlafaxine: { color: '#14b8a6', icon: '💊', label: 'Ven' },
  sertraline: { color: '#06b6d4', icon: '💊', label: 'Sert' },
  prazepam: { color: '#94a3b8', icon: '🫧', label: 'Praz' },
  cyamemazine: { color: '#7e22ce', icon: '🌌', label: 'Cya' },
  dynabiane: { color: '#10b981', icon: '🧬', label: 'Dyna' },
  omegabiane: { color: '#0ea5e9', icon: '🐟', label: 'Omega' },
  griffonia: { color: '#a855f7', icon: '🌰', label: 'Griffonia' },
  valeriane: { color: '#65a30d', icon: '🌾', label: 'Valériane' },
  safran: { color: '#f97316', icon: '🌸', label: 'Safran' },
  yoga: { color: '#f472b6', icon: '🧘', label: 'Yoga' },
  vitamine_c: { color: '#fb923c', icon: '🍊', label: 'Vit C' },
  cocaine: { color: '#e2e8f0', icon: '⚠️', label: 'Cocaïne' },
  mmc: { color: '#22d3ee', icon: '⚠️', label: 'MMC' },
  heroine: { color: '#78350f', icon: '🚨', label: 'Héroïne' },
};

function formatTime(ts: string): string {
  return new Date(ts).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(ts: string): string {
  return new Date(ts).toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

function doseLabel(entry: LogEntry): string {
  const { substance, dose } = entry;
  const amt = dose.amount;
  if (substance === 'thc') return `${amt} chamber${amt > 1 ? 's' : ''}`;
  if (substance === 'ketamine') {
    if (dose.details?.form === 'crystal' || dose.unit === 'mg') {
      return `~${amt}mg crystal`;
    }
    const mg = dose.details?.total_mg || (dose.details?.mg_per_spray as number || 0) * amt;
    return `${amt} spray${amt > 1 ? 's' : ''}${mg ? ` (${mg}mg)` : ''}`;
  }
  if (substance === 'lsd') {
    const ug = dose.details?.ug_estimate as number;
    if (amt === 0.25) return `¼ carton${ug ? ` (~${ug}ug)` : ''}`;
    if (amt === 0.5) return `½ carton${ug ? ` (~${ug}ug)` : ''}`;
    if (amt === 1.5) return `1½ cartons${ug ? ` (~${ug}ug)` : ''}`;
    return `${amt} carton${amt > 1 ? 's' : ''}${ug ? ` (~${ug}ug)` : ''}`;
  }
  if (substance === 'nicotine') {
    const mode = dose.details?.mode || '';
    const w = dose.details?.wattage as number;
    const v = dose.details?.voltage_v as number;
    const parts = [`~${amt} puff${amt > 1 ? 's' : ''}`, mode];
    if (w) parts.push(`${w}W`);
    if (v) parts.push(`${v}V`);
    return parts.filter(Boolean).join(' ');
  }
  if (substance === 'hydration') {
    const adds = (dose.details?.additives as string[]) || [];
    return `${amt}ml${adds.length ? ` + ${adds.join(', ')}` : ''}`;
  }
  if (substance === 'melatonin') return `${amt}mg ${dose.details?.form || 'tablet'}`;
  if (substance === 'venlafaxine') return `${amt}mg ${dose.details?.release === 'extended' ? 'LP' : ''}`.trim();
  if (substance === 'sertraline') return `${amt}mg`;
  if (substance === 'prazepam') return `${amt} goutte${amt > 1 ? 's' : ''} sublingual`;
  if (substance === 'cyamemazine') return `${amt}mg`;
  if (substance === 'cbd') {
    if (dose.details?.route === 'vaporized') return `${amt} chamber${amt > 1 ? 's' : ''} CBD`;
    if (dose.details?.route === 'sublingual') return `${amt}mg sublingual`;
    return `${amt} comprimé${amt > 1 ? 's' : ''}`;
  }
  if (substance === 'lions_mane') return `${amt}mg`;
  if (substance === 'caffeine') {
    const shots = dose.details?.shots as number;
    return shots ? `${shots} shot${shots > 1 ? 's' : ''} (${amt}mg)` : `${amt}mg`;
  }
  if (substance === 'dynabiane') return `${amt} gélule${amt > 1 ? 's' : ''}`;
  if (substance === 'omegabiane') return `${amt} gélule${amt > 1 ? 's' : ''}`;
  if (substance === 'griffonia') return `${amt}mg 5-HTP`;
  if (substance === 'valeriane') return `${amt}mg`;
  if (substance === 'safran') return `${amt}mg`;
  if (substance === 'yoga') {
    const style = dose.details?.style as string || '';
    return `${amt}min ${style}`;
  }
  return `${amt} ${dose.unit}`;
}

// ── Memoized entry row — isolates re-renders to single row ─────────────
const EntryRow = memo(function EntryRow({
  entry,
  onUpdate,
  onDelete,
}: {
  entry: LogEntry;
  onUpdate: (id: string, data: Partial<LogEntry>) => void;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editAmount, setEditAmount] = useState(entry.dose.amount);
  const [editIntent, setEditIntent] = useState(entry.intent);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { toast } = useToast();

  const cfg = SUB_CONFIG[entry.substance] || { color: '#71717a', icon: '💊', label: entry.substance };
  const bio = entry.biometrics_at_log;

  const toggle = () => {
    if (!editing) setExpanded((p) => !p);
  };

  const startEdit = () => {
    setEditing(true);
    setEditAmount(entry.dose.amount);
    setEditIntent(entry.intent);
    setExpanded(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setConfirmDelete(false);
  };

  const saveEdit = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/tracker/log/${entry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dose: { amount: editAmount },
          intent: editIntent,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        onUpdate(entry.id, updated);
        setEditing(false);
        toast('Entry updated', 'success');
      } else {
        toast('Failed to update', 'error');
      }
    } catch {
      toast('Network error', 'error');
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/tracker/log/${entry.id}`, { method: 'DELETE' });
      if (res.ok) {
        onDelete(entry.id);
        toast('Entry deleted', 'info');
      } else {
        toast('Failed to delete', 'error');
      }
    } catch {
      toast('Network error', 'error');
    }
  };

  return (
    <div>
      <button
        onClick={toggle}
        className="w-full flex items-center gap-3 px-2 py-1.5 rounded hover:bg-zinc-800/50 transition text-left"
      >
        <span className="text-xs text-zinc-500 font-mono w-12 shrink-0">
          {formatTime(entry.ts)}
        </span>
        <div
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: cfg.color }}
        />
        <span className="text-sm">
          <span style={{ color: cfg.color }} className="font-medium">
            {cfg.icon} {cfg.label}
          </span>
          <span className="text-zinc-400 ml-1.5">
            — {doseLabel(entry)}
          </span>
          {entry.intent && (
            <span className="text-zinc-600 ml-1.5">{entry.intent}</span>
          )}
        </span>
        {bio && (
          <span className="ml-auto text-xs text-zinc-600 shrink-0 hidden sm:inline">
            {bio.hr && `♡${bio.hr}`}
            {bio.stress != null && ` σ${bio.stress}`}
            {bio.body_battery != null && ` ⚡${bio.body_battery}`}
          </span>
        )}
      </button>

      {expanded && (
        <div className="ml-16 pl-3 border-l border-zinc-800 text-xs text-zinc-500 py-1 space-y-2">
          {!editing ? (
            <>
              {entry.notes && <div className="text-zinc-400">{entry.notes}</div>}
              {bio && (
                <div className="flex flex-wrap gap-3">
                  {bio.hr && <span>HR: {bio.hr} bpm</span>}
                  {bio.stress != null && <span>Stress: {bio.stress}</span>}
                  {bio.body_battery != null && <span>BB: {bio.body_battery}</span>}
                  {bio.ans_mode && <span>ANS: {bio.ans_mode}</span>}
                </div>
              )}
              <div className="text-zinc-600">
                {JSON.stringify(entry.dose.details)}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); startEdit(); }}
                className="text-zinc-600 hover:text-zinc-400 transition text-[10px] border border-zinc-800 rounded px-2 py-0.5 mt-1"
              >
                Corriger
              </button>
            </>
          ) : (
            <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
              {/* Dose amount edit */}
              <div className="flex items-center gap-2">
                <label className="text-zinc-500 w-12">Dose:</label>
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(Number(e.target.value))}
                  min={0}
                  step={entry.substance === 'hydration' ? 50 : 1}
                  className="w-24 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-white font-mono text-xs focus:outline-none focus:border-zinc-500"
                />
                <span className="text-zinc-600">{entry.dose.unit}</span>
              </div>

              {/* Quick correction buttons */}
              {entry.dose.amount >= 10 && (
                <div className="flex gap-1.5 flex-wrap">
                  {[
                    Math.round(entry.dose.amount / 10),
                    Math.round(entry.dose.amount / 5),
                    Math.round(entry.dose.amount / 2),
                  ].filter((v, i, a) => v > 0 && v < entry.dose.amount && a.indexOf(v) === i)
                   .map((v) => (
                    <button
                      key={v}
                      onClick={() => setEditAmount(v)}
                      className={`px-2 py-0.5 rounded text-[10px] border transition ${
                        editAmount === v
                          ? 'border-amber-500/50 text-amber-300 bg-amber-500/10'
                          : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {v} {entry.dose.unit}
                    </button>
                  ))}
                </div>
              )}

              {/* Intent edit */}
              <div className="flex items-center gap-2">
                <label className="text-zinc-500 w-12">Intent:</label>
                <input
                  type="text"
                  value={editIntent}
                  onChange={(e) => setEditIntent(e.target.value)}
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-zinc-500"
                />
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={saveEdit}
                  disabled={saving}
                  className="px-3 py-1 rounded text-xs font-medium transition border"
                  style={{ borderColor: cfg.color + '60', color: cfg.color, backgroundColor: cfg.color + '10' }}
                >
                  {saving ? '...' : 'Sauvegarder'}
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-3 py-1 rounded text-xs text-zinc-500 border border-zinc-700 hover:text-zinc-300 transition"
                >
                  Annuler
                </button>
                {confirmDelete ? (
                  <span className="ml-auto flex items-center gap-1.5">
                    <span className="text-red-400/80 text-[10px]">Sûr ?</span>
                    <button
                      onClick={handleDelete}
                      className="px-2 py-0.5 rounded text-[10px] text-red-400 border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 transition"
                    >
                      Oui
                    </button>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="px-2 py-0.5 rounded text-[10px] text-zinc-500 border border-zinc-700 hover:text-zinc-300 transition"
                    >
                      Non
                    </button>
                  </span>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="px-3 py-1 rounded text-xs text-red-500/60 border border-red-500/20 hover:text-red-400 hover:border-red-500/40 transition ml-auto"
                  >
                    Supprimer
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

// ── Adverse effect row ─────────────────────────────────────────────────
const AdverseRow = memo(function AdverseRow({ entry }: { entry: AdverseEntry }) {
  const cfg = ADVERSE_CONFIG[entry.effect] || { color: '#ef4444', icon: '⚠️', label: entry.effect };
  const sevColor = entry.severity === 'severe' ? '#ef4444' : entry.severity === 'moderate' ? '#f97316' : '#facc15';

  return (
    <div className="flex items-center gap-3 px-2 py-1.5 rounded bg-red-500/5 border border-red-500/10">
      <span className="text-xs text-zinc-500 font-mono w-12 shrink-0">
        {formatTime(entry.ts)}
      </span>
      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: sevColor }} />
      <span className="text-sm">
        <span style={{ color: cfg.color }} className="font-medium">
          {cfg.icon} {cfg.label}
        </span>
        <span className="text-zinc-500 ml-1.5 text-xs" style={{ color: sevColor }}>
          {entry.severity}
        </span>
        {entry.notes && (
          <span className="text-zinc-600 ml-1.5 text-xs">— {entry.notes}</span>
        )}
      </span>
    </div>
  );
});

// ── Main Timeline ──────────────────────────────────────────────────────
export default function Timeline({ refreshKey, filter }: { refreshKey: number; filter?: string[] }) {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [adverseEntries, setAdverseEntries] = useState<AdverseEntry[]>([]);
  const { sanitized } = useSanitizeMode();
  const { toast } = useToast();

  useEffect(() => {
    fetch('/api/tracker/log?days=7')
      .then((r) => r.json())
      .then((d) => setEntries(d.entries || []))
      .catch(() => toast('Failed to load timeline', 'error'));
    fetch('/api/tracker/adverse?days=7')
      .then((r) => r.json())
      .then((d) => setAdverseEntries(Array.isArray(d) ? d : []))
      .catch(() => toast('Failed to load effects', 'error'));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  // Build unified timeline items
  const items: TimelineItem[] = [];
  const filteredSubs = filter ? entries.filter((e) => filter.includes(e.substance)) : entries;
  for (const e of filteredSubs) {
    if (sanitized && isSanitized(e.substance)) continue;
    items.push({ kind: 'substance', data: e });
  }
  for (const e of adverseEntries) {
    if (sanitized && isEffectSanitized(e.effect)) continue;
    items.push({ kind: 'adverse', data: e });
  }
  items.sort((a, b) => b.data.ts.localeCompare(a.data.ts));

  // Group by date
  const grouped: Record<string, TimelineItem[]> = {};
  for (const item of items) {
    const dateKey = formatDate(item.data.ts);
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(item);
  }

  const handleUpdate = useCallback((id: string, data: Partial<LogEntry>) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...data } : e)));
  }, []);

  const handleDelete = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  if (items.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 text-center text-zinc-500 text-sm">
        {sanitized ? 'Aucune entrée visible en mode privé.' : 'No entries yet. Log your first substance above.'}
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
      <h3 className="text-sm font-medium text-zinc-400 mb-4">
        Timeline (7 days)
        {sanitized && <span className="text-amber-400/60 ml-2 text-xs">🙈 mode privé</span>}
      </h3>

      {Object.entries(grouped).map(([date, dayItems]) => (
        <div key={date} className="mb-4 last:mb-0">
          <div className="text-xs text-zinc-600 uppercase tracking-wider mb-2 border-b border-zinc-800 pb-1">
            {date}
          </div>
          <div className="space-y-1.5">
            {dayItems.map((item) =>
              item.kind === 'substance' ? (
                <EntryRow
                  key={item.data.id}
                  entry={item.data}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              ) : (
                <AdverseRow key={item.data.id} entry={item.data as AdverseEntry} />
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
