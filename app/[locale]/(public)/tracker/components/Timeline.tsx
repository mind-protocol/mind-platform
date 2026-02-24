'use client';

import { useEffect, useState } from 'react';

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
  prazepam: { color: '#94a3b8', icon: '🫧', label: 'Praz' },
  cyamemazine: { color: '#7e22ce', icon: '🌌', label: 'Cya' },
  dynabiane: { color: '#10b981', icon: '🧬', label: 'Dyna' },
  omegabiane: { color: '#0ea5e9', icon: '🐟', label: 'Omega' },
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
  if (substance === 'nicotine') return `~${amt} puff${amt > 1 ? 's' : ''} ${dose.details?.mode || ''}`;
  if (substance === 'hydration') {
    const adds = (dose.details?.additives as string[]) || [];
    return `${amt}ml${adds.length ? ` + ${adds.join(', ')}` : ''}`;
  }
  if (substance === 'melatonin') return `${amt}mg ${dose.details?.form || 'tablet'}`;
  if (substance === 'venlafaxine') return `${amt}mg ${dose.details?.release === 'extended' ? 'LP' : ''}`.trim();
  if (substance === 'prazepam') return `${amt}mg ${dose.details?.route || 'sublingual'}`;
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
  return `${amt} ${dose.unit}`;
}

export default function Timeline({ refreshKey, filter }: { refreshKey: number; filter?: string[] }) {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState(0);
  const [editIntent, setEditIntent] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/tracker/log?days=7')
      .then((r) => r.json())
      .then((d) => setEntries(d.entries || []))
      .catch(() => {});
  }, [refreshKey]);

  // Filter entries by substance category if filter provided
  const filtered = filter ? entries.filter((e) => filter.includes(e.substance)) : entries;

  // Group by date
  const grouped: Record<string, LogEntry[]> = {};
  for (const e of filtered) {
    const dateKey = formatDate(e.ts);
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(e);
  }

  const toggle = (id: string) => {
    if (editing === id) return; // Don't collapse while editing
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const startEdit = (entry: LogEntry) => {
    setEditing(entry.id);
    setEditAmount(entry.dose.amount);
    setEditIntent(entry.intent);
    setExpanded((prev) => new Set(prev).add(entry.id));
  };

  const cancelEdit = () => {
    setEditing(null);
  };

  const saveEdit = async (entry: LogEntry) => {
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
        setEntries((prev) =>
          prev.map((e) => (e.id === entry.id ? { ...e, ...updated } : e))
        );
        setEditing(null);
      }
    } catch { /* ignore */ }
    setSaving(false);
  };

  const deleteEntry = async (id: string) => {
    try {
      const res = await fetch(`/api/tracker/log/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setEntries((prev) => prev.filter((e) => e.id !== id));
        setEditing(null);
      }
    } catch { /* ignore */ }
  };

  if (filtered.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 text-center text-zinc-500 text-sm">
        No entries yet. Log your first substance above.
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
      <h3 className="text-sm font-medium text-zinc-400 mb-4">Timeline (7 days)</h3>

      {Object.entries(grouped).map(([date, dayEntries]) => (
        <div key={date} className="mb-4 last:mb-0">
          <div className="text-xs text-zinc-600 uppercase tracking-wider mb-2 border-b border-zinc-800 pb-1">
            {date}
          </div>
          <div className="space-y-1.5">
            {dayEntries.map((entry) => {
              const cfg = SUB_CONFIG[entry.substance] || { color: '#71717a', icon: '💊', label: entry.substance };
              const isExpanded = expanded.has(entry.id);
              const isEditing = editing === entry.id;
              const bio = entry.biometrics_at_log;

              return (
                <div key={entry.id}>
                  <button
                    onClick={() => toggle(entry.id)}
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

                  {isExpanded && (
                    <div className="ml-16 pl-3 border-l border-zinc-800 text-xs text-zinc-500 py-1 space-y-2">
                      {!isEditing ? (
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
                            onClick={(e) => { e.stopPropagation(); startEdit(entry); }}
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
                              onClick={() => saveEdit(entry)}
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
                            <button
                              onClick={() => { if (confirm('Supprimer cette entrée ?')) deleteEntry(entry.id); }}
                              className="px-3 py-1 rounded text-xs text-red-500/60 border border-red-500/20 hover:text-red-400 hover:border-red-500/40 transition ml-auto"
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
