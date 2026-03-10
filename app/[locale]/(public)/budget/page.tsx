import { Metadata } from 'next';
import { Link } from '@/i18n/navigation';

export const revalidate = 86400; // ISR: regenerate once per day (static data)

export const metadata: Metadata = {
  title: 'Operating Budget | Mind Protocol',
  description: 'How Mind Protocol allocates resources. Full financial transparency.',
};

/* ─── Data ────────────────────────────────────────────────────────────── */

const BUDGET_CATEGORIES = [
  { name: 'AI', monthlyTotal: 910, color: '#f59e0b', description: 'LLM inference, voice synthesis, speech-to-text', items: 'Claude Max x3, Anthropic API, ElevenLabs TTS, OpenAI Whisper' },
  { name: 'Infrastructure', monthlyTotal: 65, color: '#3b82f6', description: 'Messaging, hosting, deployment, domains', items: 'Vercel ($20), Render (TBD), Twilio SMS, WhatsApp SIM, Domain' },
  { name: 'Legal', monthlyTotal: 0, color: '#ef4444', description: 'Corporate formation, compliance' },
  { name: 'DevTools', monthlyTotal: 0, color: '#8b5cf6', description: 'App store accounts, developer tooling' },
];

const MONTHLY_BURN = 975; // USD

const ONE_TIME_COSTS = [
  { name: 'Shiva — Unpaid Invoice', amount: 234, currency: 'EUR', status: 'overdue' as const, note: '1st reminder — cleaning service invoice' },
  { name: 'Vercel — Failed Payment', amount: 20, currency: 'USD', status: 'overdue' as const, note: 'Card declined (Mastercard 3125) — team "Mind Protocol"' },
  { name: 'Render — Outstanding Balance', amount: 0, currency: 'USD', status: 'overdue' as const, note: 'Unpaid balance for 6 services — exact amount TBD (check dashboard)' },
  { name: 'AWS Route 53 — Domain Renewal', amount: 15, currency: 'USD', status: 'pending' as const, note: 'Auto-renewal: debatingsecurityplus.org' },
  { name: 'IONOS Unpaid Invoice', amount: 118.44, currency: 'EUR', status: 'overdue' as const, note: 'Failed SEPA mandate' },
  { name: 'SAS Creation (France)', amount: 1500, currency: 'EUR', status: 'pending' as const, note: 'Required for Stripe payments' },
  { name: 'Apple Developer Program', amount: 99, currency: 'USD', status: 'pending' as const, note: 'Annual — iOS App Store' },
  { name: 'Google Play Developer', amount: 25, currency: 'USD', status: 'pending' as const, note: 'One-time registration' },
  { name: 'WAHA Pro (WhatsApp API)', amount: 99, currency: 'USD', status: 'planned' as const, note: 'Monthly once acquired' },
];

const REVENUE_TIERS = [
  { name: 'Free', price: 0, features: ['10 messages/day', 'Basic biometrics', 'Community access'], color: 'zinc' as const },
  { name: 'Explorer', price: 9.99, features: ['Unlimited messages', 'Voice interface', 'Full biometric suite', 'Priority support'], color: 'blue' as const },
  { name: 'Guardian', price: 29.99, features: ['Everything in Explorer', 'API access', 'Custom integrations', 'Dedicated instance'], color: 'amber' as const },
];

/* ─── Donut Chart ─────────────────────────────────────────────────────── */

function DonutChart() {
  const categories = BUDGET_CATEGORIES.filter((c) => c.monthlyTotal > 0);
  const total = categories.reduce((s, c) => s + c.monthlyTotal, 0);

  let cumulative = 0;
  const outerR = 45;
  const innerR = 28;

  const segments = categories.map((cat) => {
    const startAngle = (cumulative / total) * 360;
    cumulative += cat.monthlyTotal;
    const endAngle = (cumulative / total) * 360;

    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    const ox1 = 50 + outerR * Math.cos(startRad);
    const oy1 = 50 + outerR * Math.sin(startRad);
    const ox2 = 50 + outerR * Math.cos(endRad);
    const oy2 = 50 + outerR * Math.sin(endRad);

    const ix1 = 50 + innerR * Math.cos(endRad);
    const iy1 = 50 + innerR * Math.sin(endRad);
    const ix2 = 50 + innerR * Math.cos(startRad);
    const iy2 = 50 + innerR * Math.sin(startRad);

    return (
      <path
        key={cat.name}
        d={[
          `M ${ox1} ${oy1}`,
          `A ${outerR} ${outerR} 0 ${largeArc} 1 ${ox2} ${oy2}`,
          `L ${ix1} ${iy1}`,
          `A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix2} ${iy2}`,
          'Z',
        ].join(' ')}
        fill={cat.color}
        stroke="#09090b"
        strokeWidth="0.5"
      />
    );
  });

  return (
    <div className="flex flex-col items-center gap-6">
      <svg viewBox="0 0 100 100" className="w-56 h-56 md:w-72 md:h-72">
        {segments}
        <text
          x="50"
          y="47"
          textAnchor="middle"
          className="fill-amber-500 text-[7px] font-bold font-mono"
        >
          ${MONTHLY_BURN}
        </text>
        <text
          x="50"
          y="56"
          textAnchor="middle"
          className="fill-zinc-500 text-[4px]"
        >
          per month
        </text>
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4">
        {categories.map((cat) => (
          <div key={cat.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: cat.color }}
            />
            <span className="text-zinc-300 text-sm">{cat.name}</span>
            <span className="text-zinc-500 text-sm">
              ({Math.round((cat.monthlyTotal / total) * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Status Badge ────────────────────────────────────────────────────── */

function StatusBadge({ status }: { status: 'pending' | 'planned' | 'overdue' }) {
  const styles = {
    overdue: 'bg-red-500/10 text-red-500 border-red-500/30',
    pending: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
    planned: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}
    >
      {status}
    </span>
  );
}

/* ─── Tier Border Color ───────────────────────────────────────────────── */

function tierBorderClass(color: 'zinc' | 'blue' | 'amber') {
  switch (color) {
    case 'blue':
      return 'border-blue-500/50';
    case 'amber':
      return 'border-amber-500/50';
    default:
      return 'border-zinc-700';
  }
}

function tierPriceColor(color: 'zinc' | 'blue' | 'amber') {
  switch (color) {
    case 'blue':
      return 'text-blue-400';
    case 'amber':
      return 'text-amber-500';
    default:
      return 'text-zinc-300';
  }
}

/* ─── Page ────────────────────────────────────────────────────────────── */

export default function BudgetPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <article className="max-w-4xl mx-auto px-6 py-24">
        {/* Header */}
        <header className="text-center mb-16">
          <p className="text-amber-500/80 text-sm tracking-widest uppercase mb-4">
            Financial Transparency
          </p>
          <h1 className="text-4xl md:text-5xl font-bold font-mono mb-4">
            Operating Budget
          </h1>
          <p className="text-zinc-500 text-lg">
            How Mind Protocol allocates resources. Updated monthly.
          </p>
        </header>

        {/* Monthly Burn Hero Card */}
        <section className="mb-16">
          <div className="p-8 rounded-xl border border-zinc-800 bg-zinc-900/50 text-center">
            <p className="text-zinc-500 text-sm uppercase tracking-widest mb-3">
              Monthly Burn Rate
            </p>
            <p className="text-5xl md:text-6xl font-bold font-mono">
              <span className="text-amber-500">${MONTHLY_BURN}</span>
              <span className="text-zinc-500 text-2xl md:text-3xl">/month</span>
            </p>
            <p className="text-zinc-500 mt-4">
              ~{Math.ceil(MONTHLY_BURN / 9.99)} Explorer subscribers to break even
            </p>
          </div>
        </section>

        {/* Category Breakdown */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Category Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {BUDGET_CATEGORIES.map((cat) => {
              const proportion = MONTHLY_BURN > 0 ? (cat.monthlyTotal / MONTHLY_BURN) * 100 : 0;
              return (
                <div
                  key={cat.name}
                  className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      <h3 className="text-lg font-bold">{cat.name}</h3>
                    </div>
                    <span className="text-amber-500 font-bold font-mono">
                      ${cat.monthlyTotal}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-sm mb-1">{cat.description}</p>
                  {cat.items && (
                    <p className="text-zinc-600 text-xs mb-3">{cat.items}</p>
                  )}
                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${proportion}%`,
                        backgroundColor: cat.color,
                        minWidth: cat.monthlyTotal > 0 ? '2%' : '0%',
                      }}
                    />
                  </div>
                  <p className="text-zinc-600 text-xs mt-1 text-right">
                    {proportion.toFixed(1)}% of total
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Donut Chart */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Cost Distribution</h2>
          <DonutChart />
        </section>

        {/* One-Time & Upcoming Costs */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">One-Time &amp; Upcoming Costs</h2>

          {/* Overdue alert banner */}
          {(() => {
            const overdue = ONE_TIME_COSTS.filter((c) => c.status === 'overdue');
            const overdueEur = overdue.filter((c) => c.currency === 'EUR').reduce((s, c) => s + c.amount, 0);
            const overdueUsd = overdue.filter((c) => c.currency === 'USD').reduce((s, c) => s + c.amount, 0);
            const hasUnknown = overdue.some((c) => c.amount === 0);
            return overdue.length > 0 ? (
              <div className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/5">
                <p className="text-red-400 font-medium text-sm">
                  {overdue.length} overdue payment{overdue.length > 1 ? 's' : ''} —{' '}
                  {overdueEur > 0 && <span className="font-mono">{'\u20AC'}{overdueEur.toFixed(2)}</span>}
                  {overdueEur > 0 && overdueUsd > 0 && ' + '}
                  {overdueUsd > 0 && <span className="font-mono">${overdueUsd}</span>}
                  {hasUnknown && ' + Render (TBD)'}
                  {' '}{'\u2248'} <span className="font-mono">{'\u20AC'}{Math.round(overdueEur + overdueUsd * 0.93)}</span> total
                </p>
              </div>
            ) : null;
          })()}

          <div className="space-y-4">
            {ONE_TIME_COSTS.map((cost) => (
              <div
                key={cost.name}
                className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/30 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-white font-medium">{cost.name}</h3>
                    <StatusBadge status={cost.status} />
                  </div>
                  <p className="text-zinc-500 text-sm">{cost.note}</p>
                </div>
                <div className="text-right">
                  <p className={`font-bold font-mono text-lg ${cost.status === 'overdue' ? 'text-red-400' : 'text-amber-500'}`}>
                    {cost.amount === 0 ? (
                      'TBD'
                    ) : (
                      <>
                        {cost.currency === 'EUR' ? '\u20AC' : '$'}
                        {cost.amount.toLocaleString('en-US', {
                          minimumFractionDigits: cost.amount % 1 !== 0 ? 2 : 0,
                          maximumFractionDigits: 2,
                        })}
                      </>
                    )}
                  </p>
                  <p className="text-zinc-600 text-xs">{cost.currency}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Revenue Model */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Revenue Model</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {REVENUE_TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`p-6 rounded-xl border bg-zinc-900/30 flex flex-col ${tierBorderClass(tier.color)}`}
              >
                <h3 className="text-lg font-bold mb-1">{tier.name}</h3>
                <p className={`text-3xl font-bold font-mono mb-4 ${tierPriceColor(tier.color)}`}>
                  {tier.price === 0 ? (
                    '$0'
                  ) : (
                    <>
                      ${tier.price}
                      <span className="text-zinc-500 text-sm font-normal">/mo</span>
                    </>
                  )}
                </p>
                <ul className="space-y-2 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-zinc-400 text-sm">
                      <span className="text-zinc-600 mt-0.5">-</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Treasury Status */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Treasury Status</h2>
          <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
            <div className="space-y-5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <p className="text-zinc-500 text-sm">Liquidity Pool</p>
                  <p className="text-white font-medium">100% locked on FluxBeam</p>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Locked
                </span>
              </div>
              <div className="border-t border-zinc-800" />
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <p className="text-zinc-500 text-sm">Unlock Date</p>
                  <p className="text-white font-medium">February 9, 2027</p>
                </div>
                <span className="text-zinc-500 text-sm font-mono">
                  Streamflow vesting contract
                </span>
              </div>
              <div className="border-t border-zinc-800" />
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <p className="text-zinc-500 text-sm">Reserve</p>
                  <p className="text-white font-medium">50,000 $MIND held by protocol</p>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Held
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Links */}
        <section className="text-center space-y-4">
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/tokenomics"
              className="px-6 py-3 border border-amber-500/50 text-amber-500 rounded-lg hover:bg-amber-500/10 transition"
            >
              View Tokenomics
            </Link>
            <Link
              href="/planning"
              className="px-6 py-3 border border-zinc-700 text-zinc-300 rounded-lg hover:border-zinc-500 transition"
            >
              View Planning
            </Link>
          </div>
        </section>
      </article>
    </main>
  );
}
