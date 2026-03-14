'use client';

import { useTranslations } from 'next-intl';
import { FadeInSection } from './FadeInSection';

interface PillarProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function Pillar({ icon, title, description }: PillarProps) {
  return (
    <div className="p-6 sm:p-8 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-900/30 hover:bg-zinc-900/50 transition-all duration-300">
      <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-5 text-amber-500">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
      <p className="text-zinc-500 leading-relaxed">{description}</p>
    </div>
  );
}

// Inline SVG icons to avoid external dependencies
function GraphIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="6" cy="6" r="2.5" strokeWidth={1.5} />
      <circle cx="18" cy="6" r="2.5" strokeWidth={1.5} />
      <circle cx="6" cy="18" r="2.5" strokeWidth={1.5} />
      <circle cx="18" cy="18" r="2.5" strokeWidth={1.5} />
      <path strokeLinecap="round" strokeWidth={1.5} d="M8.5 6h7M8.5 18h7M6 8.5v7M18 8.5v7" />
    </svg>
  );
}

function TrustIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function GovernanceIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4M9 9h.01M15 9h.01M9 13h.01M15 13h.01" />
    </svg>
  );
}

function PlacesIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  );
}

export function HowItWorks() {
  const t = useTranslations('Landing.HowItWorks');

  const pillars: PillarProps[] = [
    {
      icon: <GraphIcon />,
      title: t('graphTitle'),
      description: t('graphDescription'),
    },
    {
      icon: <TrustIcon />,
      title: t('trustTitle'),
      description: t('trustDescription'),
    },
    {
      icon: <GovernanceIcon />,
      title: t('governanceTitle'),
      description: t('governanceDescription'),
    },
    {
      icon: <PlacesIcon />,
      title: t('placesTitle'),
      description: t('placesDescription'),
    },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <FadeInSection>
          <div className="text-center mb-16">
            <p className="text-amber-500/80 text-sm tracking-widest uppercase mb-4">
              {t('label')}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('title')}
            </h2>
            <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
          </div>
        </FadeInSection>

        <div className="grid md:grid-cols-2 gap-6">
          {pillars.map((pillar, index) => (
            <FadeInSection key={pillar.title} delay={index * 100}>
              <Pillar {...pillar} />
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}
