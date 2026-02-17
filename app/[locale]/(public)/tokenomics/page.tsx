import { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { MIND_MINT as CA } from '@/lib/constants/solana';

export const metadata: Metadata = {
  title: '$MIND Tokenomics | Mind Protocol',
  description: '$MIND token allocation, distribution, and economic infrastructure on Solana.',
};
const HOOK = '325JiLH2czH47tnDzheS6rQdDh9rHa1mD8wVuRUPDAnD';

const ALLOCATIONS = [
  {
    name: 'Community',
    percent: 40,
    tokens: '400,000',
    color: '#f59e0b',
    vesting: 'No lock — governed by token holders',
    wallet: null,
  },
  {
    name: 'Co-founders',
    percent: 30,
    tokens: '300,000',
    color: '#3b82f6',
    vesting: '50% free, 25% staked (when live), 25% LP-locked',
    wallet: null,
    sub: [
      { name: '@nlr_ai', tokens: '100,000', wallet: 'FH6iSajT6bbY5GYLfNg8MWrbppQSpPG6LQdwN2bsJrZT' },
      { name: '@BassTabb', tokens: '100,000', wallet: 'BmXdHy3tvi6keXuu4xdiFKNHtGhzgDVMS3Ab7u29DFtX' },
      { name: 'Mind Protocol', tokens: '100,000', wallet: '8ZmFaf69469Qd7bWNCw4PP9KCRXNPg2yRbzdbruDdSXD' },
    ],
  },
  {
    name: 'Liquidity & Pre-sale',
    percent: 20,
    tokens: '200,000',
    color: '#22c55e',
    vesting: '80% of pre-sale SOL → LP (LP tokens locked)',
    wallet: null,
  },
  {
    name: 'Early Supporters',
    percent: 5,
    tokens: '50,000',
    color: '#8b5cf6',
    vesting: 'No lock — $COMPUTE → $MIND airdrop',
    wallet: null,
  },
  {
    name: 'Reserve',
    percent: 5,
    tokens: '50,000',
    color: '#ef4444',
    vesting: 'Held by protocol',
    wallet: null,
  },
];

function PieChart() {
  const total = ALLOCATIONS.reduce((sum, a) => sum + a.percent, 0);
  let cumulative = 0;

  const segments = ALLOCATIONS.map((alloc) => {
    const start = (cumulative / total) * 360;
    cumulative += alloc.percent;
    const end = (cumulative / total) * 360;
    const startRad = ((start - 90) * Math.PI) / 180;
    const endRad = ((end - 90) * Math.PI) / 180;
    const largeArc = end - start > 180 ? 1 : 0;
    const x1 = 50 + 45 * Math.cos(startRad);
    const y1 = 50 + 45 * Math.sin(startRad);
    const x2 = 50 + 45 * Math.cos(endRad);
    const y2 = 50 + 45 * Math.sin(endRad);

    return (
      <path
        key={alloc.name}
        d={`M 50 50 L ${x1} ${y1} A 45 45 0 ${largeArc} 1 ${x2} ${y2} Z`}
        fill={alloc.color}
        stroke="#09090b"
        strokeWidth="0.5"
      />
    );
  });

  return (
    <svg viewBox="0 0 100 100" className="w-64 h-64 md:w-80 md:h-80">
      {segments}
    </svg>
  );
}

function WalletLink({ address }: { address: string }) {
  return (
    <Link
      href={`https://solscan.io/account/${address}`}
      target="_blank"
      rel="noopener noreferrer"
      className="font-mono text-xs text-zinc-500 hover:text-amber-500 transition"
    >
      {address.slice(0, 6)}...{address.slice(-4)}
    </Link>
  );
}

export default function TokenomicsPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <article className="max-w-4xl mx-auto px-6 py-24">
        {/* Header */}
        <header className="text-center mb-16">
          <p className="text-amber-500/80 text-sm tracking-widest uppercase mb-4">
            Economic Infrastructure
          </p>
          <h1 className="text-4xl md:text-5xl font-bold font-mono mb-4">$MIND Tokenomics</h1>
          <p className="text-zinc-500 text-lg">
            1,000,000 tokens. $0.20 each. Money with memory.
          </p>
        </header>

        {/* Token Info */}
        <section className="mb-16 p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-zinc-500 text-sm mb-1">Contract Address</p>
              <Link
                href={`https://solscan.io/token/${CA}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-amber-500 hover:text-amber-400 transition text-sm break-all"
              >
                {CA}
              </Link>
            </div>
            <div>
              <p className="text-zinc-500 text-sm mb-1">TransferHook Program</p>
              <Link
                href={`https://solscan.io/account/${HOOK}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-zinc-400 hover:text-amber-500 transition text-sm break-all"
              >
                {HOOK}
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-zinc-800">
            <div>
              <p className="text-zinc-500 text-xs">Total Supply</p>
              <p className="text-white font-bold">1,000,000</p>
            </div>
            <div>
              <p className="text-zinc-500 text-xs">Launch Price</p>
              <p className="text-white font-bold">$0.20</p>
            </div>
            <div>
              <p className="text-zinc-500 text-xs">Transfer Fee</p>
              <p className="text-white font-bold">1%</p>
            </div>
            <div>
              <p className="text-zinc-500 text-xs">Standard</p>
              <p className="text-white font-bold">SPL Token 2022</p>
            </div>
          </div>
        </section>

        {/* Pie Chart + Legend */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Allocation</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-12">
            <PieChart />
            <div className="space-y-3">
              {ALLOCATIONS.map((alloc) => (
                <div key={alloc.name} className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: alloc.color }}
                  />
                  <span className="text-white font-medium">{alloc.name}</span>
                  <span className="text-zinc-500">{alloc.percent}%</span>
                  <span className="text-zinc-600 text-sm">({alloc.tokens})</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Detailed Breakdown */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Distribution Details</h2>
          <div className="space-y-6">
            {ALLOCATIONS.map((alloc) => (
              <div
                key={alloc.name}
                className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/30"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: alloc.color }}
                    />
                    <h3 className="text-lg font-bold">{alloc.name}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-amber-500 font-bold">{alloc.percent}%</span>
                    <span className="text-zinc-500 ml-2">({alloc.tokens} $MIND)</span>
                  </div>
                </div>
                <p className="text-zinc-400 text-sm mb-3">{alloc.vesting}</p>

                {/* Sub-allocations (co-founders) */}
                {alloc.sub && (
                  <div className="mt-4 space-y-2 pl-6 border-l border-zinc-800">
                    {alloc.sub.map((sub) => (
                      <div key={sub.name} className="flex items-center justify-between">
                        <div>
                          <span className="text-white">{sub.name}</span>
                          <span className="text-zinc-500 ml-2 text-sm">{sub.tokens} $MIND</span>
                        </div>
                        {sub.wallet && <WalletLink address={sub.wallet} />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Extensions */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Token Extensions</h2>
          <p className="text-zinc-400 mb-6">
            $MIND uses SPL Token 2022 with five extensions. These are permanent and cannot be
            changed after creation.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                name: 'TransferFeeConfig',
                desc: '1% protocol fee on all transfers. Collected for ecosystem development.',
              },
              {
                name: 'TransferHook',
                desc: 'Reserved for future use (currently disabled). Will enable custom logic on transfers.',
              },
              {
                name: 'MetadataPointer',
                desc: 'On-chain metadata reference. Name, symbol, and URI stored in the mint.',
              },
              {
                name: 'TokenMetadata',
                desc: 'MIND / MIND with metadata URI pointing to mindprotocol.ai.',
              },
              {
                name: 'MintCloseAuthority',
                desc: 'Disabled. Mint cannot be closed. Freeze authority is null — censorship resistant.',
              },
            ].map((ext) => (
              <div key={ext.name} className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/30">
                <p className="text-amber-500 font-mono text-sm mb-1">{ext.name}</p>
                <p className="text-zinc-400 text-sm">{ext.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Links */}
        <section className="text-center space-y-4">
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={`https://solscan.io/token/${CA}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-amber-500/50 text-amber-500 rounded-lg hover:bg-amber-500/10 transition"
            >
              View on Solscan
            </Link>
            <Link
              href="/whitepaper"
              className="px-6 py-3 border border-zinc-700 text-zinc-300 rounded-lg hover:border-zinc-500 transition"
            >
              Read Whitepaper
            </Link>
          </div>
        </section>
      </article>
    </main>
  );
}
