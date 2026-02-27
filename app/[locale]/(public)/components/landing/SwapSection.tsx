'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { SwapWidget } from '../SwapWidget';
import { MIND_MINT as CA } from '@/lib/constants/solana';
import { FadeInSection } from './FadeInSection';

export function SwapSection() {
  const [copied, setCopied] = useState(false);
  const t = useTranslations('Landing.Swap');
  const tc = useTranslations('Common');

  const copyCA = () => {
    navigator.clipboard.writeText(CA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <FadeInSection direction="up">
      <section id="swap" className="py-16 px-6 border-b border-amber-500/20 bg-gradient-to-b from-zinc-950 via-zinc-900/50 to-zinc-950">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center lg:items-start gap-12">
          {/* Left: Token info */}
          <div className="flex-1 text-center lg:text-left lg:pt-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              <span className="text-amber-500">{t('title')}</span> {t('isLive')}
            </h2>
            <p className="text-zinc-400 text-lg mb-6">
              {t('tokenInfo')}
            </p>

            <div className="flex flex-col sm:flex-row items-center lg:items-start gap-3 mb-6">
              <button
                onClick={copyCA}
                className="font-mono text-sm text-zinc-300 bg-zinc-800/50 px-4 py-2.5 rounded-lg hover:bg-zinc-800 transition cursor-pointer"
                title="Click to copy CA"
              >
                {copied ? t('copied') : `${CA.slice(0, 6)}...${CA.slice(-4)}`}
              </button>

              <a
                href={`https://solscan.io/token/${CA}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 text-sm border border-amber-500/50 text-amber-500 rounded-lg hover:bg-amber-500/10 transition"
              >
                {tc('solscan')}
              </a>

              <a
                href="https://dexscreener.com/solana/gnpb7yzgckf4efz6satqphm8q3juum3dna7cj8ti8mra"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 text-sm border border-amber-500/50 text-amber-500 rounded-lg hover:bg-amber-500/10 transition"
              >
                {tc('dexscreener')}
              </a>

              <a
                href="/tokenomics"
                className="px-4 py-2.5 text-sm border border-zinc-700 text-zinc-300 rounded-lg hover:bg-zinc-800 transition"
              >
                {tc('tokenomics')}
              </a>
            </div>

            <div className="text-sm text-zinc-500 space-y-1.5">
              <p>{t('transferFee')}</p>
              <p>{t('lpLocked')}</p>
            </div>
          </div>

          {/* Right: Swap widget */}
          <div className="flex justify-center">
            <SwapWidget />
          </div>
        </div>
      </section>
    </FadeInSection>
  );
}
