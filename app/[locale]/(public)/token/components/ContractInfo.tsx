'use client';

import { useState } from 'react';
import { MIND_MINT, LP_POOL, SOL_MINT } from '@/lib/constants/solana';

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs text-zinc-400 hover:text-amber-500 hover:bg-zinc-800 transition"
      title="Copy to clipboard"
    >
      {copied ? (
        <>
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-3.5 h-3.5 text-green-500"
          >
            <path
              fillRule="evenodd"
              d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-green-500">Copied</span>
        </>
      ) : (
        <>
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-3.5 h-3.5"
          >
            <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" />
            <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" />
          </svg>
          <span>Copy</span>
        </>
      )}
    </button>
  );
}

const LINKS = [
  {
    label: 'Solscan',
    href: `https://solscan.io/token/${MIND_MINT}`,
    color: 'text-zinc-300 border-zinc-700 hover:border-zinc-500',
  },
  {
    label: 'Jupiter',
    href: `https://jup.ag/swap/SOL-${MIND_MINT}`,
    color: 'text-amber-500 border-amber-500/50 hover:bg-amber-500/10',
  },
  {
    label: 'FluxBeam LP',
    href: `https://fluxbeam.xyz/app/liquidity?inMint=${SOL_MINT}&outMint=${MIND_MINT}`,
    color: 'text-blue-400 border-blue-500/50 hover:bg-blue-500/10',
  },
  {
    label: 'DexScreener',
    href: `https://dexscreener.com/solana/${MIND_MINT}`,
    color: 'text-green-400 border-green-500/50 hover:bg-green-500/10',
  },
];

const TOKEN_DETAILS = [
  { label: 'Total Supply', value: '1,000,000' },
  { label: 'Decimals', value: '9' },
  { label: 'Transfer Fee', value: '1%' },
  { label: 'Standard', value: 'Token-2022' },
  { label: 'LP Lock', value: 'Until Feb 2027' },
];

export default function ContractInfo() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
      <h2 className="text-lg font-semibold text-white mb-5">
        Contract Details
      </h2>

      {/* Contract address */}
      <div className="mb-5">
        <p className="text-zinc-500 text-xs mb-1.5">Contract Address</p>
        <div className="flex items-center gap-2 flex-wrap">
          <a
            href={`https://solscan.io/token/${MIND_MINT}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-amber-500 hover:text-amber-400 transition text-sm break-all"
          >
            {MIND_MINT}
          </a>
          <CopyButton text={MIND_MINT} />
        </div>
      </div>

      {/* LP Pool address */}
      <div className="mb-6">
        <p className="text-zinc-500 text-xs mb-1.5">LP Pool (FluxBeam)</p>
        <div className="flex items-center gap-2 flex-wrap">
          <a
            href={`https://solscan.io/account/${LP_POOL}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-zinc-400 hover:text-amber-500 transition text-sm break-all"
          >
            {LP_POOL}
          </a>
          <CopyButton text={LP_POOL} />
        </div>
      </div>

      {/* Token details grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-6 pt-5 border-t border-zinc-800">
        {TOKEN_DETAILS.map((detail) => (
          <div key={detail.label}>
            <p className="text-zinc-500 text-xs mb-1">{detail.label}</p>
            <p className="text-white font-semibold text-sm">{detail.value}</p>
          </div>
        ))}
      </div>

      {/* External links */}
      <div className="flex flex-wrap gap-3 pt-5 border-t border-zinc-800">
        {LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border text-sm font-medium transition ${link.color}`}
          >
            {link.label}
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-3.5 h-3.5 opacity-60"
            >
              <path
                fillRule="evenodd"
                d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5zm7.25-.75a.75.75 0 01.75-.75h3.5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0V6.31l-5.47 5.47a.75.75 0 01-1.06-1.06l5.47-5.47H12.25a.75.75 0 01-.75-.75z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
}
