'use client';

import { useState } from 'react';
import Link from 'next/link';
import SanitizeToggle from '@/components/SanitizeToggle';

// ── Protocol data ────────────────────────────────────────────────────

interface ProtocolPhase {
  label: string;
  duration: string;
  details: string[];
}

interface DailyObservation {
  label: string;
  scale: string;
}

interface Protocol {
  id: string;
  substance: string;
  icon: string;
  color: string;
  title: string;
  purpose: string;
  product: { name: string; serving: string; perUnit: string };
  dose: { amount: string; frequency: string; timing: string; avoid: string };
  phases: ProtocolPhase[];
  logging: { required: string[]; observations: DailyObservation[]; optional: string[] };
  stopRules: string[];
  caution: string;
  oneLiner: string;
}

const PROTOCOLS: Protocol[] = [
  {
    id: 'lions_mane',
    substance: 'lions_mane',
    icon: '🍄',
    color: 'orange',
    title: "Lion's Mane — Intake Protocol",
    purpose:
      'Practical, low-noise intake plan: avoid unnecessary redosing, keep the signal clear for tracking, reduce sleep-confounding effects, evaluate whether the supplement is actually helping.',
    product: {
      name: 'Human Pro Lion\'s Mane',
      serving: '1260 mg (3 capsules)',
      perUnit: '420 mg per capsule',
    },
    dose: {
      amount: '1260 mg (3 capsules)',
      frequency: 'Once daily',
      timing: 'After a meal, preferably 09:00-14:00',
      avoid: 'Late evening / night (confounds sleep data)',
    },
    phases: [
      {
        label: 'Baseline (mandatory)',
        duration: '10-14 days',
        details: [
          'Same dose (1260 mg) every day',
          'Same time window (ideally same hour)',
          'Same "after meal" condition',
          'Do NOT change dose and timing simultaneously',
        ],
      },
      {
        label: 'Variant A — Earlier dosing',
        duration: '5-7 days (after baseline)',
        details: [
          'Move intake to morning only (09:00-10:00)',
          'Keep everything else unchanged',
          'Focus test: does earlier timing improve focus?',
        ],
      },
      {
        label: 'Variant B — Midday dosing',
        duration: '5-7 days (after baseline)',
        details: [
          'Take after lunch (12:00-14:00)',
          'Keep dose unchanged',
          'Tolerance / GI comfort test',
        ],
      },
    ],
    logging: {
      required: ['Time taken', 'Dose (mg) = 1260 mg', 'With food? (yes/no)', 'Notes (optional)'],
      observations: [
        { label: 'Focus / mental clarity', scale: '0-10' },
        { label: 'Anxiety / tension', scale: '0-10' },
        { label: 'Energy (clean, not agitation)', scale: '0-10' },
        { label: 'GI comfort', scale: '0-10' },
        { label: 'Sleep quality (next morning)', scale: '0-10' },
        { label: 'Sleep onset latency', scale: 'optional estimate' },
      ],
      optional: [
        'Caffeine used close to dose',
        'Nicotine use unusually high',
        'Unusual stress day / poor sleep debt',
      ],
    },
    stopRules: [
      'Rash / allergic-type reaction',
      'Significant GI discomfort (persistent nausea, abdominal pain, vomiting)',
      'Unusual worsening of anxiety / agitation',
      'Any reaction clearly reproducible after dosing',
    ],
    caution:
      'Do not change prescribed medications based on supplement effects. Keep Lion\'s Mane as a stable, non-urgent variable. Mention it to your doctor/pharmacist in a poly-medication context.',
    oneLiner:
      '1260 mg (3 capsules) once daily after a meal, ideally morning or midday, for 10-14 days with consistent logging.',
  },
];

// ── Components ───────────────────────────────────────────────────────

function ProtocolCard({ protocol, expanded, onToggle }: { protocol: Protocol; expanded: boolean; onToggle: () => void }) {
  const colorMap: Record<string, { border: string; bg: string; text: string; badge: string }> = {
    orange: { border: 'border-orange-500/30', bg: 'bg-orange-500/10', text: 'text-orange-400', badge: 'bg-orange-500/20' },
    teal: { border: 'border-teal-500/30', bg: 'bg-teal-500/10', text: 'text-teal-400', badge: 'bg-teal-500/20' },
    purple: { border: 'border-purple-500/30', bg: 'bg-purple-500/10', text: 'text-purple-400', badge: 'bg-purple-500/20' },
    green: { border: 'border-green-500/30', bg: 'bg-green-500/10', text: 'text-green-400', badge: 'bg-green-500/20' },
  };
  const c = colorMap[protocol.color] || colorMap.teal;

  return (
    <div className={`rounded-xl border ${c.border} ${expanded ? c.bg : 'bg-zinc-900/50'} transition-all`}>
      {/* Header — always visible */}
      <button
        onClick={onToggle}
        className="w-full text-left px-5 py-4 flex items-center gap-4"
      >
        <span className="text-2xl">{protocol.icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold ${c.text}`}>{protocol.title}</h3>
          <p className="text-zinc-500 text-sm mt-0.5 truncate">{protocol.oneLiner}</p>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded ${c.badge} ${c.text}`}>
          {protocol.dose.frequency}
        </span>
        <svg
          className={`w-4 h-4 text-zinc-500 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-5 pb-5 space-y-5">
          {/* Purpose */}
          <p className="text-zinc-400 text-sm">{protocol.purpose}</p>

          {/* Product + Dose */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-zinc-900/80 rounded-lg p-4 border border-zinc-800">
              <div className="text-[10px] uppercase tracking-wider text-zinc-600 mb-2">Produit</div>
              <div className="text-sm text-white font-medium">{protocol.product.name}</div>
              <div className="text-xs text-zinc-500 mt-1">{protocol.product.serving}</div>
              <div className="text-xs text-zinc-600">{protocol.product.perUnit}</div>
            </div>
            <div className="bg-zinc-900/80 rounded-lg p-4 border border-zinc-800">
              <div className="text-[10px] uppercase tracking-wider text-zinc-600 mb-2">Posologie</div>
              <div className={`text-sm font-medium ${c.text}`}>{protocol.dose.amount}</div>
              <div className="text-xs text-zinc-500 mt-1">{protocol.dose.timing}</div>
              <div className="text-xs text-red-400/70 mt-1">{protocol.dose.avoid}</div>
            </div>
          </div>

          {/* Phases */}
          <div>
            <div className="text-[10px] uppercase tracking-wider text-zinc-600 mb-3">Phases du protocole</div>
            <div className="space-y-3">
              {protocol.phases.map((phase, i) => (
                <div key={i} className="bg-zinc-900/80 rounded-lg p-4 border border-zinc-800">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${c.badge} ${c.text}`}>
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium text-white">{phase.label}</span>
                    <span className="text-xs text-zinc-600 ml-auto">{phase.duration}</span>
                  </div>
                  <ul className="space-y-1">
                    {phase.details.map((d, j) => (
                      <li key={j} className="text-xs text-zinc-400 flex items-start gap-2">
                        <span className="text-zinc-600 mt-0.5">-</span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Logging protocol */}
          <div>
            <div className="text-[10px] uppercase tracking-wider text-zinc-600 mb-3">Protocole de logging</div>
            <div className="bg-zinc-900/80 rounded-lg p-4 border border-zinc-800">
              <div className="text-xs text-zinc-500 mb-2 font-medium">Champs requis</div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {protocol.logging.required.map((r, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                    {r}
                  </span>
                ))}
              </div>
              <div className="text-xs text-zinc-500 mb-2 font-medium">Observations quotidiennes</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {protocol.logging.observations.map((obs, i) => (
                  <div key={i} className="text-xs text-zinc-400 flex items-center gap-1.5">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${c.badge} ${c.text} font-mono`}>
                      {obs.scale}
                    </span>
                    {obs.label}
                  </div>
                ))}
              </div>
              {protocol.logging.optional.length > 0 && (
                <>
                  <div className="text-xs text-zinc-600 mt-3 mb-1">Notes contextuelles (optionnel)</div>
                  <div className="text-xs text-zinc-500">
                    {protocol.logging.optional.join(' / ')}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Stop rules */}
          <div className="bg-red-500/5 rounded-lg p-4 border border-red-500/20">
            <div className="text-[10px] uppercase tracking-wider text-red-400/70 mb-2">Stop / Reassess</div>
            <ul className="space-y-1">
              {protocol.stopRules.map((rule, i) => (
                <li key={i} className="text-xs text-red-400/80 flex items-start gap-2">
                  <span className="text-red-500/50 mt-0.5">!</span>
                  {rule}
                </li>
              ))}
            </ul>
          </div>

          {/* Clinical caution */}
          <div className="bg-amber-500/5 rounded-lg p-4 border border-amber-500/20">
            <div className="text-[10px] uppercase tracking-wider text-amber-400/70 mb-2">Precaution clinique</div>
            <p className="text-xs text-amber-400/80">{protocol.caution}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────

export default function ProtocolsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(PROTOCOLS[0]?.id ?? null);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-mono">
              Protocoles
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Plans d&apos;intake recommandes &middot; Tracking comportemental
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <SanitizeToggle />
            <Link
              href="/tracker"
              className="text-sm px-3 py-1.5 rounded border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition"
            >
              Tracker
            </Link>
            <Link
              href="/tracker/health"
              className="text-sm px-3 py-1.5 rounded border border-teal-500/30 text-teal-400 hover:bg-teal-500/10 transition"
            >
              Sante
            </Link>
            <Link
              href="/tracker/dependencies"
              className="text-sm px-3 py-1.5 rounded border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 transition"
            >
              Dependances
            </Link>
          </div>
        </header>

        {/* Protocol list */}
        <div className="space-y-4">
          {PROTOCOLS.map((p) => (
            <ProtocolCard
              key={p.id}
              protocol={p}
              expanded={expandedId === p.id}
              onToggle={() => setExpandedId(expandedId === p.id ? null : p.id)}
            />
          ))}
        </div>

        {/* Empty state for future protocols */}
        {PROTOCOLS.length === 1 && (
          <div className="mt-8 text-center text-zinc-700 text-sm font-mono">
            D&apos;autres protocoles seront ajoutes ici au fur et a mesure.
          </div>
        )}
      </div>
    </main>
  );
}
