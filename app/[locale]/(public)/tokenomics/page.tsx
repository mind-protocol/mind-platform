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

const TOP_HOLDERS = [
  { rank: 1, wallet: '6CiQJ5ab5Qb9c7MPn3BMJDTYsMtBVV3GAizYww7hKgBz', mind: 15345, identity: 'Smithii Staking PDA', isTeam: true },
  { rank: 2, wallet: '8pkCEtFZaRfbyK7nAyBX2hAppEJxuPt1vXT9me3RKCUh', mind: 11526, identity: 'Smithii Staking PDA', isTeam: true },
  { rank: 3, wallet: 'AwvmKM8zsMSRNmvJC4HQ4cQguRMDe9jZYeoYuAE43T1e', mind: 4200, identity: 'External holder (Coinbase Prime)', isTeam: false },
  { rank: 4, wallet: '9jejKXshrwF2qnLPpR1CNYWfnQnZqS7jk54n1ewqtzez', mind: 4072, identity: 'Smithii Staking PDA', isTeam: true },
  { rank: 5, wallet: '2g2PLyFBbCU6eG2kRNyXuMdmtS6kZ5EJibpAF9aNZ9mG', mind: 769, identity: 'Smithii Staking PDA', isTeam: true },
  { rank: 6, wallet: 'FP6jnN3vcmUhNekR7XMjoDU4jRcKo1ZzBFbehGYzy7FN', mind: 769, identity: 'Smithii Staking PDA', isTeam: true },
];

const LP_INFO = {
  platform: 'FluxBeam',
  pool: 'GNpB7YZgCkf4Efz6SATqphM8Q3jUum3dNA7Cj8Ti8MRa',
  locked: true,
  lockPercent: 100,
  unlockDate: '2027-02-09',
  initialSol: 16.21,
  initialMind: 7047,
  lockProvider: 'Streamflow',
};

const AIRDROP_DATA = {
  totalRecipients: 546,
  grossSent: 67437,
  holdRate: 2.8,
  sellRate: 97,
  mindStillHeld: 36682,
  origin: 'Snapshot of $COMPUTE on-chain staking balances',
};

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

        {/* Top Holders */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Top Holders</h2>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left text-zinc-500 font-medium px-6 py-3">#</th>
                    <th className="text-left text-zinc-500 font-medium px-6 py-3">Wallet</th>
                    <th className="text-right text-zinc-500 font-medium px-6 py-3">$MIND</th>
                    <th className="text-left text-zinc-500 font-medium px-6 py-3">Identity</th>
                    <th className="text-left text-zinc-500 font-medium px-6 py-3">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {TOP_HOLDERS.map((holder) => (
                    <tr
                      key={holder.rank}
                      className={`border-b border-zinc-800/50 ${holder.rank % 2 === 0 ? 'bg-zinc-900/40' : ''}`}
                    >
                      <td className="px-6 py-3 text-zinc-400">{holder.rank}</td>
                      <td className="px-6 py-3">
                        <WalletLink address={holder.wallet} />
                      </td>
                      <td className="px-6 py-3 text-right text-white font-medium">
                        {holder.mind.toLocaleString()}
                      </td>
                      <td className="px-6 py-3 text-zinc-400">{holder.identity}</td>
                      <td className="px-6 py-3">
                        {holder.isTeam ? (
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/20 text-emerald-400">
                            Team
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-500/20 text-blue-400">
                            External
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Liquidity Pool */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Liquidity Pool</h2>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-zinc-500 text-sm mb-1">Platform</p>
                <p className="text-white font-bold">{LP_INFO.platform}</p>
              </div>
              <div>
                <p className="text-zinc-500 text-sm mb-1">LP Locked</p>
                <p className="flex items-center gap-2">
                  <span className="text-white font-bold">{LP_INFO.lockPercent}%</span>
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/20 text-emerald-400">
                    Fully Locked
                  </span>
                </p>
              </div>
              <div>
                <p className="text-zinc-500 text-sm mb-1">Unlock Date</p>
                <p className="text-white font-bold">February 9, 2027</p>
              </div>
              <div>
                <p className="text-zinc-500 text-sm mb-1">Initial LP</p>
                <p className="text-white font-bold">
                  {LP_INFO.initialSol} SOL + {LP_INFO.initialMind.toLocaleString()} $MIND
                </p>
              </div>
              <div>
                <p className="text-zinc-500 text-sm mb-1">Lock Provider</p>
                <p className="text-white font-bold">{LP_INFO.lockProvider}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-zinc-800">
              <Link
                href={`https://solscan.io/account/${LP_INFO.pool}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-500 hover:text-amber-400 text-sm transition"
              >
                Solscan Pool
              </Link>
              <Link
                href={`https://dexscreener.com/solana/${LP_INFO.pool}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-500 hover:text-amber-400 text-sm transition"
              >
                DEXScreener
              </Link>
              <Link
                href={`https://jup.ag/swap/SOL-${CA}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-500 hover:text-amber-400 text-sm transition"
              >
                Jupiter
              </Link>
            </div>
          </div>
        </section>

        {/* Airdrop Summary */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">$COMPUTE Airdrop</h2>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div>
                <p className="text-2xl font-bold text-white">{AIRDROP_DATA.totalRecipients.toLocaleString()}</p>
                <p className="text-zinc-500 text-sm">Recipients</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{AIRDROP_DATA.grossSent.toLocaleString()}</p>
                <p className="text-zinc-500 text-sm">$MIND Distributed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{AIRDROP_DATA.holdRate}%</p>
                <p className="text-zinc-500 text-sm">Hold Rate</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{AIRDROP_DATA.mindStillHeld.toLocaleString()}</p>
                <p className="text-zinc-500 text-sm">$MIND Still Held</p>
              </div>
            </div>
            <p className="text-zinc-400 text-sm">
              Origin: {AIRDROP_DATA.origin}
            </p>
            <p className="text-zinc-600 text-xs mt-2">
              {AIRDROP_DATA.sellRate}% of recipients sold — only serious holders remain.
            </p>
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
