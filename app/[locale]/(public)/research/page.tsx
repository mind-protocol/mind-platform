'use client';

import { useTranslations } from 'next-intl';

type Maturity = 'idea' | 'outline' | 'draft' | 'review' | 'preprint' | 'published';
type Priority = 1 | 2 | 3 | 4 | 5;
type Need = 'reviewers' | 'endorsers' | 'co-authors' | 'data' | 'funding';

interface Paper {
  id: string;
  number: number;
  title: string;
  authors: string;
  date: string;
  abstract: string;
  tags: string[];
  maturity: Maturity;
  priority: Priority;
  venue: string;
  needs?: Need[];
  pdfUrl?: string;
  translations?: { label: string; url: string }[];
}

const MATURITY_CONFIG: Record<
  Maturity,
  { label: string; color: string; bg: string; pct: number }
> = {
  idea: {
    label: 'Idea',
    color: 'text-zinc-500',
    bg: 'bg-zinc-800/50',
    pct: 5,
  },
  outline: {
    label: 'Outline',
    color: 'text-zinc-400',
    bg: 'bg-zinc-700/30',
    pct: 15,
  },
  draft: {
    label: 'Draft',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    pct: 40,
  },
  review: {
    label: 'In Review',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    pct: 65,
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

const MATURITY_BAR_COLOR: Record<Maturity, string> = {
  idea: 'bg-zinc-600',
  outline: 'bg-zinc-500',
  draft: 'bg-blue-500',
  review: 'bg-purple-500',
  preprint: 'bg-amber-500',
  published: 'bg-emerald-500',
};

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string }> = {
  1: { label: 'P1 Critical', color: 'text-red-400' },
  2: { label: 'P2 High', color: 'text-amber-400' },
  3: { label: 'P3 Medium', color: 'text-blue-400' },
  4: { label: 'P4 Low', color: 'text-zinc-400' },
  5: { label: 'P5 Exploratory', color: 'text-zinc-500' },
};

const NEED_CONFIG: Record<Need, { label: string; icon: string }> = {
  reviewers: { label: 'Seeking peer reviewers', icon: '\uD83D\uDD0D' },
  endorsers: { label: 'Seeking arXiv endorsers', icon: '\u2705' },
  'co-authors': { label: 'Open to co-authors', icon: '\uD83E\uDD1D' },
  data: { label: 'Needs additional data', icon: '\uD83D\uDCCA' },
  funding: { label: 'Seeking funding', icon: '\uD83C\uDFE6' },
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
      'A scoping review (31 studies) with N=3 cohort comparison proposing an integrative framework that uses continuous biometric monitoring to optimize body fitness and cognitive-autonomic function through coordinated substance tapering, intentional movement, and cognitive practices. Includes Mann-Whitney U tests showing significant stress-level differences (d=1.40, p<0.001) with non-significant heart rate differences (p>0.50), suggesting stress-HR decoupling as a hypothesis-generating observation. Two rounds of peer review integrated.',
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
    priority: 1,
    venue: 'arXiv cs.AI / Digital Health',
    needs: ['reviewers', 'endorsers'],
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
    priority: 2,
    venue: 'FAccT / Cognitive Science / Philosophy of AI',
    needs: ['co-authors', 'reviewers'],
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
    priority: 2,
    venue: 'ACII / CHI / IEEE Affective Computing',
    needs: ['data', 'reviewers'],
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
    priority: 1,
    venue: 'FAccT 2026 / AIES 2026',
    needs: ['reviewers', 'endorsers'],
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
    priority: 2,
    venue: 'NeurIPS Workshop on AI Economics / EC',
    needs: ['reviewers', 'co-authors'],
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
    priority: 3,
    venue: 'AI & Society / Science and Engineering Ethics',
    needs: ['reviewers'],
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
    priority: 3,
    venue: 'AAAI Workshop / Minds & Machines',
    needs: ['reviewers'],
  },
  {
    id: '08-harm-reduction',
    number: 8,
    title:
      'Biometric-Informed Harm Reduction: Real-Time Substance Impact Monitoring via Consumer Wearables',
    authors: 'Nicolas L. Reynolds',
    date: '2026',
    abstract:
      'Substance harm reduction programs lack real-time physiological feedback. We present an open-source framework that maps 30 substances across 8 categories to their expected biometric signatures (HRV depression, stress elevation, Body Battery drain, sleep disruption) using Garmin wearable data. The system provides personalized harm reduction guidance by comparing observed autonomic responses against substance-specific profiles, enabling users to understand the physiological cost of consumption patterns without requiring clinical supervision. Includes the substances data architecture, bilingual public interface, and privacy-preserving design.',
    tags: [
      'Harm Reduction',
      'Substances',
      'Biometrics',
      'Garmin',
      'Public Health',
      'Privacy-by-Design',
    ],
    maturity: 'idea',
    priority: 2,
    venue: 'Drug and Alcohol Dependence / Digital Health',
    needs: ['co-authors', 'data', 'reviewers'],
  },
  {
    id: '09-passive-dialogue',
    number: 9,
    title:
      'Passive Dialogue: Simultaneous Speech-to-Speech Without Turn-Taking in Human-AI Conversation',
    authors: 'Nicolas L. Reynolds',
    date: '2026',
    abstract:
      'Existing voice AI systems enforce strict turn-taking: the human speaks, the AI responds, the human waits. We present a passive dialogue model where both streams run simultaneously\u2014the AI speaks while continuously recording the human\u2019s voice, then reconstructs the interleaved conversation via timestamp alignment. This eliminates interruption detection, reduces latency, and produces naturalistic conversational flow. We describe the architecture (3-second chunked audio buffer, Whisper STT with segment timestamps, proportional TTS timestamp estimation) and report qualitative observations from daily use over 30+ days.',
    tags: [
      'Speech-to-Speech',
      'Voice AI',
      'Turn-Taking',
      'Whisper',
      'TTS',
      'Conversational AI',
    ],
    maturity: 'idea',
    priority: 3,
    venue: 'INTERSPEECH / ACL',
    needs: ['co-authors', 'reviewers'],
  },
  {
    id: '10-graceful-degradation',
    number: 10,
    title:
      'Graceful Degradation in Multi-Agent AI Systems: Cascade Detection, Throttling, and Autonomous Recovery',
    authors: 'Nicolas L. Reynolds',
    date: '2026',
    abstract:
      'Multi-agent AI systems operating continuously on rate-limited inference APIs face cascading failure modes that existing literature does not address. We present a four-level degradation framework (normal, throttled, degraded, minimal) with automatic escalation based on consecutive error detection, adaptive parallelism throttling, exponential backoff, and autonomous recovery requiring consecutive successes to de-escalate. Includes patterns for zombie session detection, relaunch cascade prevention, and fallback chain management (Claude Code \u2192 Claude API \u2192 OpenAI API). Reports operational data from 30+ days of continuous multi-agent orchestration.',
    tags: [
      'Multi-Agent',
      'Fault Tolerance',
      'Graceful Degradation',
      'Rate Limiting',
      'Orchestration',
      'Resilience',
    ],
    maturity: 'idea',
    priority: 4,
    venue: 'AAMAS / AAAI / SoCC',
    needs: ['data', 'reviewers'],
  },
  {
    id: '11-chronicle',
    number: 11,
    title:
      'Chronicle: Autonomous Narration of Multi-Agent System Events Through Story-Based Public Communication',
    authors: 'Nicolas L. Reynolds',
    date: '2026',
    abstract:
      'How should a multi-agent AI system communicate its internal activity to the public without exposing private data? We present Chronicle, an autonomous narration system that scans for operational events (new user registrations, biometric link establishments, task completions), anonymizes all identifying information, and generates warm first-person narrative accounts for public broadcast. The system replaces raw telemetry broadcasting with story-based communication, maintaining transparency about system activity while preserving user privacy. Reports on the narrative generation pipeline, anonymization guarantees, and public reception via Telegram channel.',
    tags: [
      'Narration',
      'Privacy',
      'Public Communication',
      'Anonymization',
      'Multi-Agent',
      'Transparency',
    ],
    maturity: 'idea',
    priority: 5,
    venue: 'CHI / Creativity & Cognition',
    needs: ['reviewers'],
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
          className={`h-full rounded-full transition-all duration-500 ${MATURITY_BAR_COLOR[maturity]}`}
          style={{ width: `${config.pct}%` }}
        />
      </div>
    </div>
  );
}

function NeedsBanner({ needs }: { needs: Need[] }) {
  return (
    <div className="mt-4 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <span className="text-xs font-semibold text-amber-500/80 uppercase tracking-wider">
          Open call
        </span>
        {needs.map((need) => {
          const config = NEED_CONFIG[need];
          return (
            <span key={need} className="text-xs text-amber-400/70">
              {config.icon} {config.label}
            </span>
          );
        })}
        <a
          href="mailto:nlr@mindprotocol.ai?subject=Research%20collaboration"
          className="ml-auto text-xs text-amber-500 hover:text-amber-400 underline underline-offset-2 transition"
        >
          nlr@mindprotocol.ai
        </a>
      </div>
    </div>
  );
}

function PaperCard({ paper }: { paper: Paper }) {
  const prioConfig = PRIORITY_CONFIG[paper.priority];
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
        <div className="flex items-center gap-3 shrink-0">
          <span className={`text-xs font-semibold ${prioConfig.color}`}>
            {prioConfig.label}
          </span>
          <span className="text-xs font-mono text-zinc-600">
            #{String(paper.number).padStart(2, '0')}
          </span>
        </div>
      </div>

      <h2 className="text-xl font-bold text-white mb-2 leading-snug">
        {paper.title}
      </h2>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
        <p className="text-sm text-zinc-500">
          {paper.authors} &middot; {paper.date}
        </p>
        <MaturityBadge maturity={paper.maturity} />
      </div>

      <p className="text-xs text-zinc-600 mb-3 font-mono">
        Target: {paper.venue}
      </p>

      <p className="text-zinc-400 leading-relaxed mb-4">{paper.abstract}</p>

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

      {paper.needs && paper.needs.length > 0 && (
        <NeedsBanner needs={paper.needs} />
      )}
    </div>
  );
}

export default function ResearchPage() {
  const t = useTranslations('Nav');

  const stats = {
    total: PAPERS.length,
    preprint: PAPERS.filter((p) => p.maturity === 'preprint').length,
    draft: PAPERS.filter((p) => p.maturity === 'draft').length,
    outline: PAPERS.filter((p) => p.maturity === 'outline').length,
    idea: PAPERS.filter((p) => p.maturity === 'idea').length,
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-24">
        <header className="mb-12">
          <p className="text-amber-500/80 text-sm tracking-widest uppercase mb-4">
            Open Science
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Research</h1>
          <p className="text-zinc-400 text-lg max-w-2xl mb-6">
            Peer-reviewable papers from Mind Protocol. All research is published
            openly &mdash; no paywalls, no gatekeeping.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-zinc-500 mb-6">
            <span className="text-zinc-300 font-semibold">
              {stats.total} papers
            </span>
            <span>&middot;</span>
            {Object.entries(MATURITY_CONFIG).map(([key, config]) => {
              const count = PAPERS.filter((p) => p.maturity === key).length;
              if (count === 0) return null;
              return (
                <span key={key} className="flex items-center gap-1.5">
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${MATURITY_BAR_COLOR[key as Maturity]}`}
                  />
                  {count} {config.label}
                </span>
              );
            })}
          </div>

          <div className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 text-sm text-zinc-400">
            Interested in reviewing, endorsing, or collaborating on any of these
            papers? Reach out at{' '}
            <a
              href="mailto:nlr@mindprotocol.ai?subject=Research%20collaboration"
              className="text-amber-500 hover:text-amber-400 underline underline-offset-2 transition"
            >
              nlr@mindprotocol.ai
            </a>
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
