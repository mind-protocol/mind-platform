'use client';

import dynamic from 'next/dynamic';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { FadeInSection } from './FadeInSection';

const HeroGraph = dynamic(
  () => import('./HeroGraph').then((m) => ({ default: m.HeroGraph })),
  { ssr: false },
);

export function Hero() {
  const t = useTranslations('Landing.Hero');

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-16">
      {/* Animated graph background */}
      <HeroGraph />

      {/* Radial vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none dark:block hidden"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, transparent 0%, rgb(9 9 11) 100%)',
        }}
      />

      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-900/50 to-zinc-950 opacity-60 dark:block hidden" />

      {/* Amber radial glow behind title */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(212,146,11,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 text-center max-w-4xl">
        {/* The Declaration */}
        <p className="text-amber-500/80 text-sm tracking-widest uppercase mb-8">
          {t('subtitle')}
        </p>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
          {t('title1')}
          <br />
          <span className="text-zinc-400">
            {t('title2')}
          </span>
        </h1>

        <p className="text-xl text-zinc-500 mb-12 max-w-2xl mx-auto leading-relaxed">
          {t('description')}
        </p>

        <FadeInSection delay={200} direction="up">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-white text-black font-medium rounded-lg hover:bg-zinc-200 transition shadow-lg shadow-white/5"
            >
              {t('joinCta')}
            </Link>
            <Link
              href="/tracker"
              className="px-8 py-4 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-400 transition shadow-lg shadow-amber-500/10"
            >
              {t('trackerCta')}
            </Link>
            <Link
              href="/manifesto"
              className="px-8 py-4 border border-zinc-700 rounded-lg hover:border-zinc-500 hover:bg-zinc-900/50 transition"
            >
              {t('manifestoCta')}
            </Link>
          </div>
        </FadeInSection>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 animate-bounce">
        <svg
          className="w-6 h-6 text-zinc-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}
