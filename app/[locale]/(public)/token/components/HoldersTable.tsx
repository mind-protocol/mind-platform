'use client';

import { useState, useEffect } from 'react';
import { MIND_WALLET, DEPLOYER_WALLET, LP_POOL } from '@/lib/constants/solana';

interface Holder {
  address: string;
  balance: number;
  percentage: number;
  label?: string;
}

const KNOWN_WALLETS: Record<string, string> = {
  [DEPLOYER_WALLET]: 'Deployer',
  [MIND_WALLET]: 'MIND Wallet',
  [LP_POOL]: 'LP Pool (FluxBeam)',
};

function truncateAddress(addr: string): string {
  if (addr.length <= 12) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function formatBalance(n: number): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded bg-zinc-800 ${className || ''}`} />
  );
}

export default function HoldersTable() {
  const [holders, setHolders] = useState<Holder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchHolders() {
      try {
        const res = await fetch('/api/token/holders');
        if (!res.ok) throw new Error('Failed to fetch holders');
        const json = await res.json();
        setHolders(json.holders || []);
        setError('');
      } catch {
        setError('Unable to load holder data');
      } finally {
        setLoading(false);
      }
    }
    fetchHolders();
  }, []);

  const resolveLabel = (holder: Holder): string | null => {
    if (holder.label) return holder.label;
    return KNOWN_WALLETS[holder.address] || null;
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Top Holders</h2>
        {!loading && !error && (
          <span className="text-zinc-500 text-xs">
            {holders.length} holder{holders.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : error ? (
        <p className="text-zinc-500 text-sm">{error}</p>
      ) : holders.length === 0 ? (
        <p className="text-zinc-500 text-sm">No holder data available</p>
      ) : (
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full min-w-[540px]">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left text-zinc-500 text-xs font-medium pb-3 pr-2 w-12">
                  #
                </th>
                <th className="text-left text-zinc-500 text-xs font-medium pb-3 pr-4">
                  Address
                </th>
                <th className="text-left text-zinc-500 text-xs font-medium pb-3 pr-4">
                  Label
                </th>
                <th className="text-right text-zinc-500 text-xs font-medium pb-3 pr-4">
                  Balance
                </th>
                <th className="text-right text-zinc-500 text-xs font-medium pb-3">
                  Share
                </th>
              </tr>
            </thead>
            <tbody>
              {holders.map((holder, i) => {
                const label = resolveLabel(holder);
                return (
                  <tr
                    key={holder.address}
                    className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
                  >
                    <td className="py-3 pr-2 text-zinc-500 text-sm">
                      {i + 1}
                    </td>
                    <td className="py-3 pr-4">
                      <a
                        href={`https://solscan.io/account/${holder.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-sm text-zinc-400 hover:text-amber-500 transition"
                      >
                        {truncateAddress(holder.address)}
                      </a>
                    </td>
                    <td className="py-3 pr-4">
                      {label ? (
                        <span className="text-xs text-amber-500/80 bg-amber-500/10 px-2 py-0.5 rounded-full">
                          {label}
                        </span>
                      ) : (
                        <span className="text-zinc-600 text-xs">--</span>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-right font-mono text-sm text-white">
                      {formatBalance(holder.balance)}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-amber-500/60"
                            style={{
                              width: `${Math.min(holder.percentage, 100)}%`,
                            }}
                          />
                        </div>
                        <span className="font-mono text-xs text-zinc-400 w-14 text-right">
                          {holder.percentage.toFixed(2)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
