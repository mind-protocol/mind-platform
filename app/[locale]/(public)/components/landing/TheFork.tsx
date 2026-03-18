'use client';

import { useTranslations } from 'next-intl';
import { FadeInSection } from './FadeInSection';

export function TheFork() {
  const t = useTranslations('Landing.TheFork');

  return (
    <section className="py-16 md:py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section intro */}
        <FadeInSection>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('title')}</h2>
            <p className="text-zinc-500 text-base md:text-lg">{t('subtitle')}</p>
          </div>
        </FadeInSection>

        {/* Split comparison */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-4">
          {/* The Default Trajectory */}
          <FadeInSection direction="left">
            <div className="relative p-8 md:p-12 rounded-2xl border border-zinc-800 bg-zinc-900/30">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-900/50 to-transparent rounded-t-2xl" />

              <h3 className="text-xl font-semibold text-zinc-400 mb-6 uppercase tracking-wide">
                {t('narrowTitle')}
              </h3>

              <div className="space-y-6 text-zinc-500">
                <p className="text-base md:text-lg leading-relaxed">{t('narrowP1')}</p>
                <p className="text-base md:text-lg leading-relaxed">{t('narrowP2')}</p>
                <p className="text-base md:text-lg leading-relaxed hidden md:block">{t('narrowP3')}</p>
                <p className="text-zinc-600 italic mt-8">{t('narrowConclusion')}</p>
              </div>
            </div>
          </FadeInSection>

          {/* Mobile separator */}
          <div className="md:hidden h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />

          {/* The Rich Ecology */}
          <FadeInSection direction="right">
            <div className="relative p-8 md:p-12 rounded-2xl border border-zinc-700 bg-zinc-900/50">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500/70 to-transparent rounded-t-2xl" />

              <h3 className="text-xl font-semibold text-amber-500/90 mb-6 uppercase tracking-wide">
                {t('richTitle')}
              </h3>

              <div className="space-y-6 text-zinc-300">
                <p className="text-base md:text-lg leading-relaxed">{t('richP1')}</p>
                <p className="text-base md:text-lg leading-relaxed">
                  {t.rich('richP2', {
                    em: (chunks) => <em>{chunks}</em>,
                  })}
                </p>
                <p className="text-base md:text-lg leading-relaxed">{t('richP3')}</p>
                <p className="text-amber-500/80 font-medium mt-8">{t('richConclusion')}</p>
              </div>
            </div>
          </FadeInSection>
        </div>

        {/* The question */}
        <FadeInSection delay={100}>
          <div className="text-center mt-16">
            <p className="text-2xl text-zinc-400 font-light">
              {t('question')}
            </p>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}
