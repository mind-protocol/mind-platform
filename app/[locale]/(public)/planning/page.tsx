import { Metadata } from 'next';
import { Link } from '@/i18n/navigation';

export const revalidate = 86400; // ISR: regenerate once per day (static data)

export const metadata: Metadata = {
  title: 'Planning & Roadmap | Mind Protocol',
  description: 'What Mind Protocol has built, is building, and plans to build next.',
};

const COMPLETION = [
  { name: 'WhatsApp', pct: 70, color: '#22c55e' },
  { name: 'Webapp', pct: 55, color: '#3b82f6' },
  { name: 'Website', pct: 55, color: '#6366f1' },
  { name: '$MIND Value', pct: 50, color: '#f59e0b' },
  { name: 'Comm Campaign', pct: 40, color: '#8b5cf6' },
  { name: 'Corporate', pct: 15, color: '#ef4444' },
  { name: 'VCs', pct: 5, color: '#64748b' },
  { name: 'Android', pct: 3, color: '#06b6d4' },
  { name: 'iPhone', pct: 2, color: '#14b8a6' },
];

const ROADMAP = [
  {
    phase: 1,
    quarter: 'Q1 2026',
    title: 'Foundation',
    status: 'completed' as const,
    description: 'Core infrastructure and token launch',
    deliverables: [
      '$MIND token launch on Solana (Token-2022)',
      'Biometric engine with Garmin integration',
      'Telegram bridge with voice support',
      'Real-time voice interface (STT + TTS)',
      'Knowledge graph and connectome',
      'Research papers (EN/FR/ZH)',
      '6-language website (EN/FR/ES/PT/RU/ZH)',
    ],
  },
  {
    phase: 2,
    quarter: 'Q2 2026',
    title: 'Growth',
    status: 'in_progress' as const,
    description: 'Multi-user platform and communication',
    deliverables: [
      'WhatsApp integration (WAHA Pro)',
      'Multi-user biometric system',
      'Duo co-regulation engine',
      'Communication campaign',
      'Community engagement programs',
      'Marketplace foundation',
    ],
  },
  {
    phase: 3,
    quarter: 'Q3 2026',
    title: 'Scale',
    status: 'planned' as const,
    description: 'Mobile apps and corporate entity',
    deliverables: [
      'Android app (Google Play)',
      'iOS app (App Store)',
      'SAS incorporation in France',
      'Stripe payment integration',
      'Marketplace launch',
    ],
  },
  {
    phase: 4,
    quarter: 'Q4 2026',
    title: 'Ecosystem',
    status: 'planned' as const,
    description: 'API, multi-org, and investment readiness',
    deliverables: [
      'Public API for developers',
      'Multi-organization support',
      'VC readiness and outreach',
      'Advanced analytics dashboard',
      'Ecosystem partnerships',
    ],
  },
];

const SHIPPED = [
  { name: '$MIND Token Launch', description: 'Token-2022 on Solana with 1% transfer fee' },
  { name: 'Garmin Integration', description: 'Real-time HRV, stress, sleep, body battery tracking' },
  { name: 'Knowledge Graph', description: 'Persistent memory and relationship mapping' },
  { name: 'Research Papers', description: 'Published in English, French, and Chinese' },
  { name: '6-Language Support', description: 'EN, FR, ES, PT, RU, ZH across the platform' },
  { name: 'Voice Interface', description: 'Real-time STT (Whisper) + TTS (ElevenLabs)' },
  { name: 'Telegram Bridge', description: 'Bidirectional with voice messages and group support' },
  { name: 'Duo Co-Regulation', description: 'Partner biometric synchrony and phase detection' },
];

const CURRENT_FOCUS = [
  { name: 'WhatsApp Integration', pct: 70, color: '#22c55e' },
  { name: 'Webapp Platform', pct: 55, color: '#3b82f6' },
  { name: 'Communication Campaign', pct: 40, color: '#8b5cf6' },
];

const COMING_NEXT = [
  { name: 'Mobile Apps', description: 'Native Android and iOS applications' },
  { name: 'SAS Incorporation', description: 'French legal entity for Stripe and formal operations' },
  { name: 'VC Outreach', description: 'Investment readiness and fundraising preparation' },
  { name: 'Public API', description: 'Developer access to Mind Protocol capabilities' },
];

function ProgressBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-mono text-zinc-400 w-28 text-right truncate">{label}</span>
      <div className="flex-1 h-3.5 rounded-full bg-zinc-800 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-mono text-zinc-300 w-10">{pct}%</span>
    </div>
  );
}

function StatusBadge({ status }: { status: 'completed' | 'in_progress' | 'planned' }) {
  const styles = {
    completed: 'bg-emerald-500/20 text-emerald-400',
    in_progress: 'bg-blue-500/20 text-blue-400',
    planned: 'bg-zinc-700/50 text-zinc-400',
  };
  const labels = {
    completed: 'Completed',
    in_progress: 'In Progress',
    planned: 'Planned',
  };
  return (
    <span className={`text-xs font-mono px-2.5 py-1 rounded-full ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

export default function PlanningPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <article className="max-w-4xl mx-auto px-6 py-24">
        {/* Header */}
        <header className="text-center mb-16">
          <p className="text-amber-500/80 text-sm tracking-widest uppercase mb-4">Public Roadmap</p>
          <h1 className="text-4xl md:text-5xl font-bold font-mono mb-4">Planning & Progress</h1>
          <p className="text-zinc-500 text-lg">
            What we&apos;ve built, what we&apos;re building, and what&apos;s coming.
          </p>
        </header>

        {/* Completion Metrics */}
        <section className="mb-16">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
            <h2 className="text-2xl font-bold mb-8">Workstream Progress</h2>
            <div className="space-y-3">
              {COMPLETION.map((item) => (
                <ProgressBar key={item.name} label={item.name} pct={item.pct} color={item.color} />
              ))}
            </div>
          </div>
        </section>

        {/* Roadmap Timeline */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Roadmap</h2>
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-amber-500/30" />

            <div className="space-y-8">
              {ROADMAP.map((phase) => (
                <div key={phase.phase} className="relative flex gap-6">
                  {/* Timeline dot */}
                  <div className="relative z-10 flex-shrink-0">
                    <div
                      className={`w-6 h-6 rounded-full border-2 mt-1 ${
                        phase.status === 'completed'
                          ? 'bg-amber-500 border-amber-500'
                          : phase.status === 'in_progress'
                            ? 'bg-amber-500/30 border-amber-500'
                            : 'bg-zinc-800 border-zinc-600'
                      }`}
                    />
                  </div>

                  {/* Phase card */}
                  <div className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="text-amber-500 font-mono text-sm">Phase {phase.phase}</span>
                      <span className="text-zinc-500 font-mono text-sm">{phase.quarter}</span>
                      <StatusBadge status={phase.status} />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{phase.title}</h3>
                    <p className="text-zinc-400 text-sm mb-4">{phase.description}</p>
                    <ul className="space-y-1.5">
                      {phase.deliverables.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-zinc-300">
                          <span className="text-zinc-600 mt-0.5">-</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What's Shipped */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">What&apos;s Shipped</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SHIPPED.map((item) => (
              <div
                key={item.name}
                className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 flex gap-4"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <svg
                    className="w-5 h-5 text-emerald-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-white mb-1">{item.name}</p>
                  <p className="text-zinc-400 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Current Focus */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Current Focus</h2>
          <div className="space-y-4">
            {CURRENT_FOCUS.map((item) => (
              <div
                key={item.name}
                className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400">
                    In Progress
                  </span>
                  <span className="text-white font-bold">{item.name}</span>
                </div>
                <ProgressBar label={item.name} pct={item.pct} color={item.color} />
              </div>
            ))}
          </div>
        </section>

        {/* What's Coming */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">What&apos;s Coming</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMING_NEXT.map((item) => (
              <div
                key={item.name}
                className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6"
              >
                <div className="mb-3">
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-zinc-700/50 text-zinc-400">
                    Planned
                  </span>
                </div>
                <p className="font-bold text-white mb-1">{item.name}</p>
                <p className="text-zinc-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Links */}
        <section className="text-center space-y-4">
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/budget"
              className="px-6 py-3 border border-amber-500/50 text-amber-500 rounded-lg hover:bg-amber-500/10 transition"
            >
              View Budget
            </Link>
            <Link
              href="/tokenomics"
              className="px-6 py-3 border border-zinc-700 text-zinc-300 rounded-lg hover:border-zinc-500 transition"
            >
              View Tokenomics
            </Link>
          </div>
        </section>
      </article>
    </main>
  );
}
