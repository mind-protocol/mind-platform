'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function TrackerError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('Tracker');

  useEffect(() => {
    console.error('[tracker] Unhandled error:', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-4xl mb-4">&#x26A0;&#xFE0F;</div>
        <h2 className="text-xl font-bold font-mono mb-2">{t('somethingWrong')}</h2>
        <p className="text-sm text-zinc-500 mb-6 font-mono leading-relaxed">
          {t('errorDataSafe')}
        </p>
        {error.message && (
          <pre className="text-xs text-zinc-600 bg-zinc-900/60 border border-zinc-800 rounded-lg p-3 mb-6 text-left overflow-x-auto">
            {error.message}
          </pre>
        )}
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 text-sm font-mono hover:bg-blue-500/20 transition"
          >
            {t('tryAgain')}
          </button>
          <a
            href="/tracker"
            className="px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm font-mono hover:bg-zinc-700 transition"
          >
            {t('reloadTracker')}
          </a>
        </div>
      </div>
    </main>
  );
}
