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
    key: 'narcolepsy',
    label: 'Narcolepsy',
    matchTerms: ['narcolepsy', 'narcolepsie', 'narcolepsia'],
    icon: '😴',
    bullets: [
      'Sleep architecture (deep/REM %) reveals fragmentation patterns invisible to the user',
      'Body Battery crash timing maps daytime sleepiness windows — schedule around them',
      'Stress monitoring catches cataplexy triggers before episodes',
      'Substance interactions (caffeine, modafinil, oxybate) tracked against sleep quality',
    ],
  },
  {
    key: 'diabetes',
    label: 'Type 1 Diabetes',
    matchTerms: ['type 1 diabetes', 'diabète type 1', 'diabetes tipo 1', '1型糖尿病'],
    icon: '🩸',
    bullets: [
      'Stress spikes affect insulin sensitivity — real-time tracking catches surges early',
      'Sleep quality correlates with glucose stability next day',
      'Body Battery tracks energy crashes that mirror glycemic events',
      'HRV detects autonomic neuropathy progression before symptoms appear',
    ],
  },
  {
    key: 'ms',
    label: 'Multiple Sclerosis',
    matchTerms: ['multiple sclerosis', 'sclérose en plaques', 'esclerosis múltiple', 'esclerose múltipla'],
    icon: '🧠',
    bullets: [
      'Fatigue is the #1 MS symptom — Body Battery quantifies it objectively across days',
      'Stress is a validated relapse trigger — continuous monitoring catches escalation early',
      'Sleep disruption worsens neuroinflammation, tracked night by night',
      'Activity levels during flares vs remission reveal personal recovery patterns',
    ],
  },
  {
    key: 'lupus',
    label: 'Lupus (SLE)',
    matchTerms: ['lupus', 'lupus (led)', 'lupus (sle)', 'lupus (les)'],
    icon: '🦋',
    bullets: [
      'HRV is a validated biomarker for systemic inflammation — drops before flares',
      'UV exposure + stress data correlate with flare onset (environmental triggers)',
      'Sleep deprivation triggers immune dysregulation, tracked automatically',
      'Substance tracking catches NSAID/corticosteroid patterns and their biometric impact',
    ],
  },
  {
    key: 'fibromyalgia',
    label: 'Fibromyalgia',
    matchTerms: ['fibromyalgia', 'fibromyalgie', 'fibromialgia'],
    icon: '🔥',
    bullets: [
      'Pain-fatigue cycles correlate with stress levels — biometrics catch the invisible triggers',
      'Sleep quality (deep sleep %) is critical for pain modulation — tracked nightly',
      'Body Battery reveals the real energy envelope — helps avoid crash-boom cycles',
      'Substance tracking (analgesics, supplements) mapped against biometric response',
    ],
  },
  {
    key: 'dependency',
    label: 'Substance Dependency',
    matchTerms: ['dépendance', 'dependency', 'dependencia', 'addiction'],
    icon: '🎯',
    bullets: [
      'Usage patterns (frequency, dose, timing) quantified over 7/30/90 day windows',
      'Biometrics at time of use reveal physiological state driving each dose',
      'Intent tracking identifies emotional/social triggers behind usage patterns',
      'Clean streaks and dose escalation alerts support harm reduction goals',
    ],
  },
  {
    key: 'autoimmune_generic',
    label: 'Other Autoimmune',
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
  // Show matched conditions first, then unmatched
  const matched = CONDITIONS.filter(c => matchesCondition(pathologies, c.matchTerms));
  const unmatched = CONDITIONS.filter(c => !matchesCondition(pathologies, c.matchTerms));
  const ordered = [...matched, ...unmatched];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-teal-400 mb-1">
        Biometric insights for chronic conditions
      </h3>
      <p className="text-sm text-zinc-500 mb-5">
        How real-time wearable data helps manage autoimmune, neurological, and dependency conditions.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ordered.map(condition => {
          const isActive = matchesCondition(pathologies, condition.matchTerms);
          return (
            <div
              key={condition.key}
              className={`rounded-lg p-4 border transition ${
                isActive
                  ? 'bg-teal-900/20 border-teal-700/50'
                  : 'bg-zinc-800/50 border-zinc-700/30'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{condition.icon}</span>
                <h4 className="font-medium text-zinc-100 text-sm">{condition.label}</h4>
                {isActive && (
                  <span className="ml-auto px-2 py-0.5 rounded text-[10px] bg-teal-900/40 text-teal-400 font-mono">
                    active
                  </span>
                )}
              </div>
              <ul className="space-y-1.5">
                {condition.bullets.map((bullet, i) => (
                  <li key={i} className="flex gap-2 text-xs text-zinc-400 leading-relaxed">
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
