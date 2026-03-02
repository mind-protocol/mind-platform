'use client';

import type { Pathology } from '@/lib/tracker/types/health';

interface ConditionInfo {
  key: string;
  label: string;
  matchTerms: string[];
  icon: string;
  bullets: string[];
}

const CONDITIONS: ConditionInfo[] = [
  {
    key: 'diabetes',
    label: 'Type 1 Diabetes',
    matchTerms: ['type 1 diabetes', 'diabète type 1', 'diabetes tipo 1', 'сахарный диабет 1 типа', '1型糖尿病'],
    icon: '🩸',
    bullets: [
      'Stress spikes affect insulin sensitivity — real-time stress tracking catches surges early',
      'Sleep quality correlates with glucose stability next day',
      'Body Battery tracks energy crashes that mirror glycemic events',
      'HRV detects autonomic neuropathy progression before symptoms appear',
    ],
  },
  {
    key: 'narcolepsy',
    label: 'Narcolepsy',
    matchTerms: ['narcolepsy', 'narcolepsie', 'narcolepsia', 'нарколепсия', '嗜睡症'],
    icon: '😴',
    bullets: [
      'Sleep architecture (deep/REM %) reveals fragmentation patterns',
      'Stress monitoring catches cataplexy triggers before episodes',
      'Body Battery shows energy patterns and crash timing throughout the day',
      'Activity data quantifies daytime fatigue and sleep attack windows',
    ],
  },
  {
    key: 'autoimmune',
    label: 'Autoimmune conditions',
    matchTerms: [],
    icon: '🛡️',
    bullets: [
      'Chronic stress worsens flares — continuous monitoring catches escalation early',
      'Sleep deprivation triggers immune dysregulation, tracked night by night',
      'HRV is a validated biomarker for systemic inflammation',
      'Correlating symptoms with biometric patterns reveals invisible triggers',
    ],
  },
];

function matchesCondition(pathologies: Pathology[], matchTerms: string[]): boolean {
  if (matchTerms.length === 0) return false;
  return pathologies.some(p =>
    matchTerms.some(term => p.condition.toLowerCase().includes(term.toLowerCase()))
  );
}

export default function SupportedConditions({ pathologies }: { pathologies: Pathology[] }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-teal-400 mb-2">
        Biometric insights for chronic conditions
      </h3>
      <p className="text-sm text-zinc-500 mb-5">
        How real-time biometric data from your wearable helps manage autoimmune and neurological conditions.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CONDITIONS.map(condition => {
          const isActive = matchesCondition(pathologies, condition.matchTerms);
          return (
            <div
              key={condition.key}
              className={`rounded-lg p-4 border ${
                isActive
                  ? 'bg-teal-900/20 border-teal-700/50'
                  : 'bg-zinc-800/50 border-zinc-700/30'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{condition.icon}</span>
                <h4 className="font-medium text-zinc-100">{condition.label}</h4>
                {isActive && (
                  <span className="ml-auto px-2 py-0.5 rounded text-xs bg-teal-900/40 text-teal-400">
                    active
                  </span>
                )}
              </div>
              <ul className="space-y-2">
                {condition.bullets.map((bullet, i) => (
                  <li key={i} className="flex gap-2 text-sm text-zinc-400">
                    <span className="text-teal-500 mt-0.5 shrink-0">&#x2022;</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
