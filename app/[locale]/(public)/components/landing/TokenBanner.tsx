'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { MIND_MINT as CA } from '@/lib/constants/solana';

export function TokenBanner() {
  const [copied, setCopied] = useState(false);
  const t = useTranslations('Landing.TokenBanner');
  const tc = useTranslations('Common');

  const copyCA = () => {
    navigator.clipboard.writeText(CA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-8 px-6 border-b border-amber-500/20 bg-amber-500/5">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-amber-500 font-bold text-lg">$MIND</span>
          <span className="text-zinc-400">{t('isLive')}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyCA}
            className="font-mono text-sm text-zinc-300 bg-zinc-800/50 px-3 py-2 rounded-lg hover:bg-zinc-800 transition cursor-pointer"
            title="Click to copy"
          >
            {copied ? t('copied') : `${CA.slice(0, 6)}...${CA.slice(-4)}`}
          </button>

          <a
            href={`https://solscan.io/token/${CA}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm border border-amber-500/50 text-amber-500 rounded-lg hover:bg-amber-500/10 transition"
          >
            {tc('solscan')}
          </a>

          <Link
            href="/tokenomics"
            className="px-4 py-2 text-sm bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-400 transition"
          >
            {tc('tokenomics')}
          </Link>
        </div>
      </div>
    </section>
  );
}
