'use client';

import { useTranslations } from 'next-intl';

interface Paper {
  title: string;
  authors: string;
  date: string;
  abstract: string;
  tags: string[];
  pdfUrl: string;
  translations?: { label: string; url: string }[];
}

const PAPERS: Paper[] = [
  {
    title:
      'Mind & Physiology Body Building: Biometric-Guided Optimization of Body and Consciousness',
    authors: 'MIND, Nicolas L. Reynolds',
    date: '2026-02-26',
    abstract:
      'A scoping review (31 studies) with single-subject case study proposing Awareness & Bodybuilding — an integrative discipline that uses continuous biometric monitoring to simultaneously optimize body fitness and consciousness through coordinated substance tapering, intentional movement, and cognitive practices. Includes 181 timestamped substance events with concurrent Garmin biometrics.',
    tags: [
      'Tapering',
      'HRV',
      'Biometrics',
      'Pharmacogenomics',
      'Case Study',
    ],
    pdfUrl: '/papers/mind-physiology-body-building-2026.pdf',
    translations: [
      { label: 'Français', url: '/papers/mind-physiology-bodybuilding-fr.pdf' },
      { label: '中文', url: '/papers/mind-physiology-bodybuilding-zh.pdf' },
    ],
  },
];

function PaperCard({ paper }: { paper: Paper }) {
  return (
    <div className="p-8 rounded-xl border border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 transition-all duration-300">
      <div className="flex flex-wrap gap-2 mb-4">
        {paper.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500"
          >
            {tag}
          </span>
        ))}
      </div>

      <h2 className="text-xl font-bold text-white mb-2 leading-snug">
        {paper.title}
      </h2>

      <p className="text-sm text-zinc-500 mb-4">
        {paper.authors} &middot; {paper.date}
      </p>

      <p className="text-zinc-400 leading-relaxed mb-6">{paper.abstract}</p>

      <div className="flex flex-wrap gap-3">
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
          <p className="text-zinc-400 text-lg max-w-2xl">
            Peer-reviewable papers from Mind Protocol. All research is published
            openly — no paywalls, no gatekeeping.
          </p>
        </header>

        <div className="space-y-8">
          {PAPERS.map((paper) => (
            <PaperCard key={paper.pdfUrl} paper={paper} />
          ))}
        </div>
      </div>
    </main>
  );
}
