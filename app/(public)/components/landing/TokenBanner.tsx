'use client';

import Link from 'next/link';
import { useState } from 'react';

const CA = 'EgLGfRrjX3du7Pwbj8dzyubSk8ic1WdDfq1ysLqhBm6p';

export function TokenBanner() {
  const [copied, setCopied] = useState(false);

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
          <span className="text-zinc-400">is live on Solana</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyCA}
            className="font-mono text-sm text-zinc-300 bg-zinc-800/50 px-3 py-2 rounded-lg hover:bg-zinc-800 transition cursor-pointer"
            title="Click to copy"
          >
            {copied ? 'Copied!' : `${CA.slice(0, 6)}...${CA.slice(-4)}`}
          </button>

          <Link
            href={`https://solscan.io/token/${CA}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm border border-amber-500/50 text-amber-500 rounded-lg hover:bg-amber-500/10 transition"
          >
            Solscan
          </Link>

          <Link
            href="/tokenomics"
            className="px-4 py-2 text-sm bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-400 transition"
          >
            Tokenomics
          </Link>
        </div>
      </div>
    </section>
  );
}
