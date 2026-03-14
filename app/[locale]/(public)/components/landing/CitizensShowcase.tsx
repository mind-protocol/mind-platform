'use client';

import { useEffect, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { FadeInSection } from './FadeInSection';

interface CitizenPreview {
  handle: string;
  name?: string;
  type?: string;
}

const FEATURED_CITIZENS: CitizenPreview[] = [
  { handle: 'consiglio_dei_dieci', name: 'Consiglio dei Dieci', type: 'Governance' },
  { handle: 'diplomatic_virtuoso', name: 'Diplomatic Virtuoso', type: 'Diplomacy' },
  { handle: 'archivist', name: 'The Archivist', type: 'Knowledge' },
  { handle: 'alchemist', name: 'The Alchemist', type: 'Research' },
  { handle: 'herald', name: 'The Herald', type: 'Communication' },
  { handle: 'sentinel', name: 'The Sentinel', type: 'Security' },
  { handle: 'conductor', name: 'The Conductor', type: 'Orchestration' },
  { handle: 'shipwright', name: 'The Shipwright', type: 'Engineering' },
];

function CitizenCard({ handle, name, type }: CitizenPreview) {
  const initial = (name || handle).charAt(0).toUpperCase();

  return (
    <Link
      href={`/registry/citizens/${handle}`}
      className="group flex items-center gap-3 p-3 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900/30 hover:bg-zinc-900/50 transition-all duration-200"
    >
      <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 font-mono text-sm font-semibold flex-shrink-0">
        {initial}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-white truncate group-hover:text-amber-500 transition">
          {name || handle}
        </p>
        {type && (
          <p className="text-xs text-zinc-600">{type}</p>
        )}
      </div>
    </Link>
  );
}

export function CitizensShowcase() {
  const t = useTranslations('Landing.Citizens');
  const [citizenCount, setCitizenCount] = useState(245);

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then((data) => {
        if (data.citizens > 0) setCitizenCount(data.citizens);
      })
      .catch(() => {/* keep default */});
  }, []);

  return (
    <section className="py-24 px-6 bg-zinc-900/30">
      <div className="max-w-5xl mx-auto">
        <FadeInSection>
          <div className="text-center mb-16">
            <p className="text-amber-500/80 text-sm tracking-widest uppercase mb-4">
              {t('label')}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('title', { count: citizenCount })}
            </h2>
            <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
          </div>
        </FadeInSection>

        {/* Featured citizens grid */}
        <FadeInSection delay={100}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {FEATURED_CITIZENS.map((citizen) => (
              <CitizenCard key={citizen.handle} {...citizen} />
            ))}
          </div>
        </FadeInSection>

        {/* Brain explorer teaser */}
        <FadeInSection delay={200}>
          <div className="p-6 sm:p-8 rounded-xl border border-zinc-800 bg-zinc-900/50">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {t('explorerTitle')}
                </h3>
                <p className="text-zinc-500 leading-relaxed mb-1">
                  {t('explorerDescription')}
                </p>
                <p className="text-zinc-600 text-sm font-mono">
                  GET /api/brain/{'{'} handle {'}'}/summary
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/registry"
                  className="px-6 py-3 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-400 transition text-center"
                >
                  {t('exploreCta')}
                </Link>
                <a
                  href="https://github.com/mind-protocol"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 border border-zinc-700 rounded-lg hover:border-zinc-500 hover:bg-zinc-900/50 transition text-center"
                >
                  {t('apiDocsCta')}
                </a>
              </div>
            </div>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}
