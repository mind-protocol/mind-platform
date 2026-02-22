'use client';

import { useState, useEffect, useCallback } from 'react';

interface PriceData {
  mind_price_usd: number;
  sol_price_usd: number;
  mind_per_sol: number;
  sol_per_mind: number;
  market_cap?: number;
  volume_24h?: number;
}

function formatUsd(n: number, decimals = 4): string {
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals,
  });
}

function formatCompact(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return formatUsd(n, 2);
}

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-zinc-800 ${className || ''}`}
    />
  );
}

export default function PriceCard() {
  const [data, setData] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPrice = useCallback(async () => {
    try {
      const res = await fetch('/api/wallet/price');
      if (!res.ok) throw new Error('Failed to fetch price');
      const json: PriceData = await res.json();
      setData(json);
      setError('');
    } catch {
      setError('Price unavailable');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrice();
    const interval = setInterval(fetchPrice, 30_000);
    return () => clearInterval(interval);
  }, [fetchPrice]);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">$MIND Price</h2>
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-block w-2 h-2 rounded-full ${
              error ? 'bg-red-500' : 'bg-green-500'
            }`}
          />
          <span className="text-zinc-500 text-xs">
            {error ? 'Offline' : 'Live'}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-40" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Skeleton className="h-14" />
            <Skeleton className="h-14" />
            <Skeleton className="h-14" />
          </div>
        </div>
      ) : error && !data ? (
        <p className="text-zinc-500 text-sm">{error}</p>
      ) : data ? (
        <>
          <p className="text-3xl sm:text-4xl font-bold font-mono text-amber-500 mb-6">
            {formatUsd(data.mind_price_usd, 6)}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {data.market_cap != null && data.market_cap > 0 && (
              <div>
                <p className="text-zinc-500 text-xs mb-1">Market Cap</p>
                <p className="text-white font-semibold text-sm font-mono">
                  {formatCompact(data.market_cap)}
                </p>
              </div>
            )}
            {data.volume_24h != null && data.volume_24h > 0 && (
              <div>
                <p className="text-zinc-500 text-xs mb-1">24h Volume</p>
                <p className="text-white font-semibold text-sm font-mono">
                  {formatCompact(data.volume_24h)}
                </p>
              </div>
            )}
            <div>
              <p className="text-zinc-500 text-xs mb-1">MIND / SOL</p>
              <p className="text-white font-semibold text-sm font-mono">
                {data.mind_per_sol.toLocaleString('en-US', {
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div>
              <p className="text-zinc-500 text-xs mb-1">SOL Price</p>
              <p className="text-white font-semibold text-sm font-mono">
                {formatUsd(data.sol_price_usd, 2)}
              </p>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
