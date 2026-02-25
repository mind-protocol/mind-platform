'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export function TheInvitation() {
  const t = useTranslations('Landing.Invitation');

  return (
    <section id="invitation" className="py-24 px-6 bg-zinc-900/30">
      <div className="max-w-3xl mx-auto text-center">
        {/* The declaration */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t('title')}
          </h2>
          <p className="text-xl text-zinc-400 leading-relaxed mb-8">
            {t('description')}
          </p>
          <p className="text-lg text-zinc-500">
            {t('resonance')}
            <br />
            {t('noApplication')}
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            href="/register"
            className="px-8 py-4 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-400 transition"
          >
            {t('manifestoCta')}
          </Link>
          <Link
            href="/tracker"
            className="px-8 py-4 bg-zinc-800 border border-zinc-700 text-white font-medium rounded-lg hover:bg-zinc-700 transition"
          >
            Body Tracker
          </Link>
          <Link
            href="/connectome"
            className="px-8 py-4 border border-zinc-700 rounded-lg hover:border-zinc-500 hover:bg-zinc-900/50 transition"
          >
            {t('protocolCta')}
          </Link>
        </div>

        {/* Closing quotes */}
        <div className="border-t border-zinc-800 pt-12 space-y-3 text-zinc-600 text-sm">
          <p>{t('quote1')}</p>
          <p>{t('quote2')}</p>
          <p>{t('quote3')}</p>
        </div>
      </div>
    </section>
  );
}
