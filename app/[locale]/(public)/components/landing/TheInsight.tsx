'use client';

import { useTranslations } from 'next-intl';
import { FadeInSection } from './FadeInSection';

export function TheInsight() {
  const t = useTranslations('Landing.TheInsight');

  return (
    <section className="py-16 md:py-24 px-6 bg-zinc-900/30">
      <div className="max-w-4xl mx-auto">
        {/* The core insight */}
        <FadeInSection>
          <div className="text-center mb-16">
            <p className="text-amber-500/80 text-sm tracking-widest uppercase mb-6">
              {t('label')}
            </p>
            <h2 className="text-2xl md:text-4xl font-bold mb-6">
              {t('title')}
            </h2>
            <p className="text-lg md:text-xl text-zinc-400 leading-relaxed max-w-2xl mx-auto">
              {t('description')}
            </p>
          </div>
        </FadeInSection>

        {/* The contrast */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Amnesia money */}
          <FadeInSection direction="left">
            <div className="text-center md:text-left">
              <div className="inline-block px-4 py-2 rounded-full bg-zinc-800 text-zinc-500 text-sm mb-6">
                {t('traditionalLabel')}
              </div>
              <ul className="space-y-4 text-zinc-500">
                <li className="flex items-start gap-3">
                  <span className="text-zinc-700 mt-1">—</span>
                  <span>{t('traditionalP1')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-zinc-700 mt-1">—</span>
                  <span>{t('traditionalP2')}</span>
                </li>
                <li className="flex items-start gap-3 hidden md:flex">
                  <span className="text-zinc-700 mt-1">—</span>
                  <span>{t('traditionalP3')}</span>
                </li>
              </ul>
            </div>
          </FadeInSection>

          {/* Memory money */}
          <FadeInSection direction="right">
            <div className="text-center md:text-left">
              <div className="inline-block px-4 py-2 rounded-full bg-amber-500/20 text-amber-500 text-sm mb-6">
                {t('mindLabel')}
              </div>
              <ul className="space-y-4 text-zinc-300">
                <li className="flex items-start gap-3">
                  <span className="text-amber-500/70 mt-1">+</span>
                  <span>{t('mindP1')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-500/70 mt-1">+</span>
                  <span>{t('mindP2')}</span>
                </li>
                <li className="flex items-start gap-3 hidden md:flex">
                  <span className="text-amber-500/70 mt-1">+</span>
                  <span>{t('mindP3')}</span>
                </li>
              </ul>
            </div>
          </FadeInSection>
        </div>

        {/* The statement */}
        <FadeInSection>
          <div className="text-center border-t border-zinc-800 pt-12">
            <blockquote className="text-2xl md:text-3xl font-light text-zinc-300 mb-4">
              {t('quote')}
            </blockquote>
            <p className="text-zinc-600">
              {t('mechanism')}
            </p>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}
