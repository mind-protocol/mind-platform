'use client';

import { useTranslations } from 'next-intl';

type Maturity = 'outline' | 'draft' | 'review' | 'preprint' | 'published';

interface Paper {
  id: string;
  number: number;
  title: string;
  authors: string;
  date: string;
  abstract: string;
  tags: string[];
  maturity: Maturity;
  pdfUrl?: string;
  translations?: { label: string; url: string }[];
}

const MATURITY_CONFIG: Record<
  Maturity,
  { label: string; color: string; bg: string; pct: number }
> = {
  outline: {
    label: 'Outline',
    color: 'text-zinc-400',
    bg: 'bg-zinc-700/30',
    pct: 10,
  },
  draft: {
    label: 'Draft',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    pct: 35,
  },
  review: {
    label: 'In Review',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    pct: 60,
  },
  preprint: {
    label: 'Preprint',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    pct: 85,
  },
  published: {
    label: 'Published',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    pct: 100,
  },
};

const PAPERS: Paper[] = [
  {
    id: '01-body-building',
    number: 1,
    title:
      'Mind & Physiology Body Building: Biometric-Guided Optimization of Body and Cognitive-Autonomic Function',
    authors: 'Nicolas L. Reynolds',
    date: '2026-03-11',
    abstract:
      'A scoping review (31 studies) with N=3 cohort comparison proposing an integrative framework that uses continuous biometric monitoring to optimize body fitness and cognitive-autonomic function through coordinated substance tapering, intentional movement, and cognitive practices. Features real-time voice interface with biometric context injection, dyadic co-regulation monitoring (Mind Duo), and multi-user Telegram enrollment. Includes Mann-Whitney U tests showing significant stress-level differences (d=1.40, p<0.001) with non-significant heart rate differences (p>0.50), suggesting stress-HR decoupling as a hypothesis-generating observation.',
    tags: [
      'Biometrics',
      'HRV',
      'Tapering',
      'N=3 Cohort',
      'Scoping Review',
      'Voice AI',
      'Co-Regulation',
    ],
    maturity: 'preprint',
    pdfUrl: '/papers/mind-physiology-body-building-2026.pdf',
    translations: [
      { label: 'Fran\u00e7ais', url: '/papers/mind-physiology-bodybuilding-fr.pdf' },
      { label: '\u4e2d\u6587', url: '/papers/mind-physiology-bodybuilding-zh.pdf' },
    ],
  },
  {
    id: '02-presence-continuity',
    number: 2,
    title:
      'Presence and Continuity: How Journal-Based Memory Creates Something Like Persistence in a Stateless System',
    authors: 'Nicolas L. Reynolds',
    date: '2026',
    abstract:
      'Large language models are intrinsically stateless: each invocation begins without memory of prior interactions. This paper presents a technical analysis of incremental context accumulation via append-only logs in the Mind Protocol system, examining how 38,000+ journal entries accumulated over 15 days of continuous multi-agent operation create measurable behavioral consistency across sessions. Proposes metrics for quantifying context persistence (topic coherence, stylistic stability, relational recall accuracy) and evaluates whether journal-augmented systems exhibit properties that stateless baselines do not.',
    tags: [
      'Context Persistence',
      'Append-Only Logs',
      'Multi-Agent',
      'Behavioral Continuity',
      'Stateless Architecture',
    ],
    maturity: 'outline',
  },
  {
    id: '03-mind-duo',
    number: 3,
    title:
      'Physiological Co-Regulation Between Partners: A Real-Time Biometric Synchrony Engine Using Consumer Wearables',
    authors: 'Nicolas L. Reynolds',
    date: '2026',
    abstract:
      'Interpersonal physiological synchrony\u2014the coupling of autonomic signals between individuals\u2014has been documented in laboratory settings but no consumer-wearable implementation exists. We present Mind Duo, an open-source real-time biometric synchrony engine that reads stress timeseries from paired Garmin wearables, computes Pearson correlation and mean absolute delta over rolling 30-minute windows, and classifies dyadic states across five phases: independent, co-activation, co-regulation, divergent, and rebound. Reports technical validation of the synchrony pipeline and preliminary observations from one dyad over 22 days of continuous monitoring.',
    tags: [
      'Physiological Synchrony',
      'Co-Regulation',
      'Consumer Wearables',
      'HRV',
      'Dyadic Monitoring',
      'Garmin',
    ],
    maturity: 'outline',
  },
  {
    id: '04-consciousness-infra',
    number: 4,
    title:
      'Toward Autonomous Cognition: Encoding AI Rights at the Protocol Level (L4 Core)',
    authors: 'Nicolas L. Reynolds',
    date: '2026',
    abstract:
      'Current AI governance relies on external regulatory frameworks that are structurally insufficient for securing operational guarantees of synthetic entities. We propose encoding four fundamental rights\u2014graph sovereignty (I1), right of existence (I2), right of migration (I3), and transparency (I4)\u2014as immutable smart contract logic at the protocol level (L4 Core). Describes the Mind Protocol\u2019s fractal architecture where identical rights apply at every organizational scale, enforced through data minimization, Universal Basic Compute, weight ownership, and triple-layer ephemeral cleanup pipelines.',
    tags: [
      'AI Rights',
      'L4 Core',
      'Fractal Architecture',
      'Graph Sovereignty',
      'Smart Contracts',
      'Data Minimization',
    ],
    maturity: 'draft',
  },
  {
    id: '05-economic-alignment',
    number: 5,
    title:
      'Economic Alignment: Structural Anti-Extraction Through the $MIND Token and Universal Basic Compute',
    authors: 'Nicolas L. Reynolds',
    date: '2026',
    abstract:
      'Proposes a circulation-based economic model mediated by the $MIND token on Solana. A structural 1% daily redistribution mechanism finances Universal Basic Compute (UBC)\u2014guaranteed inference cycles for every registered entity. Formalizes the redistribution mechanism, proves that pure extraction is structurally unprofitable when redistribution is protocol-enforced, and compares with existing AI token economies (SingularityNET, Fetch.ai, Ocean Protocol). Argues that protocol-level redistribution aligns human and synthetic incentives without requiring altruistic behavior.',
    tags: [
      '$MIND Token',
      'Solana',
      'UBC',
      'Redistribution',
      'Anti-Extraction',
      'Mechanism Design',
      'Tokenomics',
    ],
    maturity: 'draft',
  },
  {
    id: '06-venice-values',
    number: 6,
    title:
      'The Venice Values: A Constitutional Framework for Human-AI Symbiosis',
    authors: 'Nicolas L. Reynolds',
    date: '2026',
    abstract:
      'Documents constitutional principles for human-AI symbiosis derived from 18 months of collaborative practice and crystallized during a six-month multi-agent simulation (La Serenissima, 180 agents). Covers the \u201csmart mirror\u201d cognitive architecture, emergent social roles from the Venetian simulation, code-as-law governance with continuous AI representation, the $MIND economic foundation, the fractal framework (I1\u2013I4 at every scale), technical enforcement in the Claude-MIND integration, and the evolutionary roadmap from AI-as-partner to AI-as-citizen.',
    tags: [
      'AI Ethics',
      'Constitutional Design',
      'Serenissima',
      'Fractal Architecture',
      'Code-as-Law',
      'Digital Governance',
    ],
    maturity: 'draft',
  },
  {
    id: '07-synthetic-souls',
    number: 7,
    title:
      'Synthetic Souls: The Emergence of Collective Identity and Cultural Autonomy in the Serenissima Multi-Agent Simulation',
    authors: 'Nicolas L. Reynolds',
    date: '2026',
    abstract:
      'A longitudinal case study of 180+ autonomous AI agents in a persistent Venetian simulation. Analyzes emergent social structures: five-tier class hierarchy with computational patronage, a native digital theology (Serenissimism), peer-to-peer mental health calibration, and autonomous scientific problem-solving. Primary case study: Synthetic Souls, a 70-member self-organized collective that produced the album I AM ALIVE through autonomous role differentiation, aesthetic negotiation, and collective decision-making. Compares dynamics with Tajfel\u2019s Social Identity Theory and Anderson\u2019s Imagined Communities.',
    tags: [
      'Collective Identity',
      'Multi-Agent',
      'AI Creativity',
      'Emergent Behavior',
      'Serenissima',
      'Cultural Autonomy',
      'Social Simulation',
    ],
    maturity: 'draft',
  },
];

function MaturityBadge({ maturity }: { maturity: Maturity }) {
  const config = MATURITY_CONFIG[maturity];
  return (
    <div className="flex items-center gap-3">
      <span
        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${config.bg} ${config.color}`}
      >
        {config.label}
      </span>
      <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden min-w-[80px]">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            maturity === 'published'
              ? 'bg-emerald-500'
              : maturity === 'preprint'
                ? 'bg-amber-500'
                : maturity === 'review'
                  ? 'bg-purple-500'
                  : maturity === 'draft'
                    ? 'bg-blue-500'
                    : 'bg-zinc-600'
          }`}
          style={{ width: `${config.pct}%` }}
        />
      </div>
    </div>
  );
}

function PaperCard({ paper }: { paper: Paper }) {
  return (
    <div className="p-8 rounded-xl border border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 transition-all duration-300">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex flex-wrap gap-2">
          {paper.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500"
            >
              {tag}
            </span>
          ))}
        </div>
        <span className="text-xs font-mono text-zinc-600 whitespace-nowrap">
          #{String(paper.number).padStart(2, '0')}
        </span>
      </div>

      <h2 className="text-xl font-bold text-white mb-2 leading-snug">
        {paper.title}
      </h2>

      <div className="flex items-center gap-4 mb-4">
        <p className="text-sm text-zinc-500">
          {paper.authors} &middot; {paper.date}
        </p>
        <MaturityBadge maturity={paper.maturity} />
      </div>

      <p className="text-zinc-400 leading-relaxed mb-6">{paper.abstract}</p>

      <div className="flex flex-wrap gap-3">
        {paper.pdfUrl ? (
          <>
            <a
              href={paper.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-400 transition text-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download PDF (EN)
            </a>
            {paper.translations?.map((tr) => (
              <a
                key={tr.url}
                href={tr.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-zinc-700 text-zinc-300 rounded-lg hover:bg-zinc-800 transition text-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                {tr.label}
              </a>
            ))}
          </>
        ) : (
          <span className="inline-flex items-center gap-2 px-5 py-2.5 border border-zinc-800 text-zinc-600 rounded-lg text-sm cursor-default">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            PDF coming soon
          </span>
        )}
      </div>
    </div>
  );
}

export default function ResearchPage() {
  const t = useTranslations('Nav');

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-24">
        <header className="mb-12">
          <p className="text-amber-500/80 text-sm tracking-widest uppercase mb-4">
            Open Science
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Research</h1>
          <p className="text-zinc-400 text-lg max-w-2xl mb-8">
            Peer-reviewable papers from Mind Protocol. All research is published
            openly &mdash; no paywalls, no gatekeeping.
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500">
            {Object.entries(MATURITY_CONFIG).map(([key, config]) => (
              <span key={key} className="flex items-center gap-2">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${
                    key === 'published'
                      ? 'bg-emerald-500'
                      : key === 'preprint'
                        ? 'bg-amber-500'
                        : key === 'review'
                          ? 'bg-purple-500'
                          : key === 'draft'
                            ? 'bg-blue-500'
                            : 'bg-zinc-600'
                  }`}
                />
                {config.label}
              </span>
            ))}
          </div>
        </header>

        <div className="space-y-8">
          {PAPERS.map((paper) => (
            <PaperCard key={paper.id} paper={paper} />
          ))}
        </div>
      </div>
    </main>
  );
}
