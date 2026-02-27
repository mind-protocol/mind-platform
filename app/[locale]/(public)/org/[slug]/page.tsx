'use client';

import { useState, useEffect, useCallback } from 'react';
import { Link } from '@/i18n/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { MIND_MINT, LP_POOL, MIND_WALLET, AUTHORIZED_WALLETS } from '@/lib/constants/solana';

// ─── Types ───────────────────────────────────────────────────

type ExpenseStatus = 'active' | 'pending' | 'to_acquire' | 'to_review' | 'cancelled';

interface Expense {
  id: string;
  name: string;
  amount: number;
  currency: 'USD' | 'EUR';
  frequency: 'monthly' | 'annual' | 'one-shot';
  category: 'AI' | 'Infrastructure' | 'Legal' | 'DevTools' | 'Liquidity';
  status: ExpenseStatus;
  color: string;
  note?: string;
  link?: string;
}

// ─── Org Profiles ───────────────────────────────────────────

interface OrgProfile {
  name: string;
  tagline: string;
  description: string;
  website?: string;
  token?: { mint: string; symbol: string; standard: string };
  links: { label: string; href: string }[];
}

const ORG_PROFILES: Record<string, OrgProfile> = {
  'mind-protocol': {
    name: 'Mind Protocol',
    tagline: 'Economic infrastructure for AI personhood.',
    description:
      'Mind Protocol builds the economic layer where alignment is profitable and relationships are capital. Persistent memory, biometric awareness, and relational continuity for AI agents — backed by the $MIND token on Solana.',
    website: 'https://mindprotocol.ai',
    token: { mint: MIND_MINT, symbol: '$MIND', standard: 'Token-2022' },
    links: [
      { label: 'Website', href: 'https://mindprotocol.ai' },
      { label: 'Whitepaper', href: '/whitepaper' },
      { label: 'Telegram', href: 'https://t.me/mindprotocol_ai' },
      { label: 'X', href: 'https://x.com/mindprotocol_ai' },
      { label: 'GitHub', href: 'https://github.com/mind-protocol' },
    ],
  },
};

// ─── Financial Data ─────────────────────────────────────────

const INITIAL_EXPENSES: Expense[] = [
  { id: 'claude-max', name: 'Claude Max x3', amount: 600, currency: 'USD', frequency: 'monthly', category: 'AI', status: 'active', color: '#f59e0b', note: '3 accounts @ $200/mo, load-balanced' },
  { id: 'anthropic-api', name: 'Anthropic API (fallback)', amount: 200, currency: 'USD', frequency: 'monthly', category: 'AI', status: 'active', color: '#d97706', note: 'Fallback when Claude Max rate-limited' },
  { id: 'elevenlabs', name: 'ElevenLabs TTS', amount: 75, currency: 'USD', frequency: 'monthly', category: 'AI', status: 'active', color: '#8b5cf6', note: 'French voice for Telegram/WhatsApp' },
  { id: 'openai', name: 'OpenAI (Whisper STT)', amount: 35, currency: 'USD', frequency: 'monthly', category: 'AI', status: 'active', color: '#6366f1', note: 'Voice transcription + vision fallback' },
  { id: 'waha-pro', name: 'WAHA Pro', amount: 99, currency: 'USD', frequency: 'monthly', category: 'Infrastructure', status: 'to_acquire', color: '#22c55e', note: 'WhatsApp API — upgrade from free Core' },
  { id: 'ionos', name: 'IONOS Hosting', amount: 20, currency: 'EUR', frequency: 'monthly', category: 'Infrastructure', status: 'to_review', color: '#3b82f6', note: 'SEPA mandate failed — €118.44 unpaid' },
  { id: 'twilio', name: 'Twilio SMS', amount: 15, currency: 'USD', frequency: 'monthly', category: 'Infrastructure', status: 'active', color: '#06b6d4', note: 'US number for SMS bridge' },
  { id: 'wa-sim', name: 'WhatsApp UK SIM', amount: 10, currency: 'USD', frequency: 'monthly', category: 'Infrastructure', status: 'active', color: '#14b8a6', note: 'eSIM for WhatsApp bot' },
  { id: 'domain', name: 'mindprotocol.ai domain', amount: 60, currency: 'USD', frequency: 'annual', category: 'Infrastructure', status: 'active', color: '#64748b', note: '.ai domain renewal' },
  { id: 'ionos-debt', name: 'IONOS unpaid invoice', amount: 118.44, currency: 'EUR', frequency: 'one-shot', category: 'Infrastructure', status: 'pending', color: '#ef4444', note: 'Failed SEPA mandate — must pay to avoid service cut' },
  { id: 'sas', name: 'SAS Creation (France)', amount: 1500, currency: 'EUR', frequency: 'one-shot', category: 'Legal', status: 'pending', color: '#ef4444', note: 'Statuts, SIRET, Kbis — required for Stripe' },
  { id: 'jupiter', name: 'Jupiter Verification', amount: 1000, currency: 'USD', frequency: 'one-shot', category: 'Liquidity', status: 'to_review', color: '#f59e0b', note: 'Optional express ($1K JUP burn) or free standard' },
  { id: 'apple-dev', name: 'Apple Developer Program', amount: 99, currency: 'USD', frequency: 'annual', category: 'DevTools', status: 'pending', color: '#64748b', note: 'Required for iOS App Store' },
  { id: 'google-play', name: 'Google Play Developer', amount: 25, currency: 'USD', frequency: 'one-shot', category: 'DevTools', status: 'pending', color: '#64748b', note: 'One-time registration' },
  { id: 'lp-provision', name: 'LP Provision (FluxBeam)', amount: 0, currency: 'USD', frequency: 'one-shot', category: 'Liquidity', status: 'to_review', color: '#22c55e', note: 'SOL + $MIND into FluxBeam pool — amount TBD' },
];

const STATUS_CONFIG: Record<ExpenseStatus, { label: string; bg: string; text: string; border: string }> = {
  active: { label: 'Active', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  pending: { label: 'Pending', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  to_acquire: { label: 'To Acquire', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  to_review: { label: 'To Review', bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
  cancelled: { label: 'Cancelled', bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
};

const COMPLETION = [
  { name: 'WhatsApp', pct: 70, color: '#22c55e' },
  { name: 'Webapp', pct: 55, color: '#3b82f6' },
  { name: 'Website', pct: 55, color: '#6366f1' },
  { name: '$MIND Value', pct: 50, color: '#f59e0b' },
  { name: 'Comm Campaign', pct: 40, color: '#8b5cf6' },
  { name: 'Corporate', pct: 15, color: '#ef4444' },
  { name: 'VCs', pct: 5, color: '#64748b' },
  { name: 'Android', pct: 3, color: '#06b6d4' },
  { name: 'iPhone', pct: 2, color: '#14b8a6' },
];

const REVENUE_TIERS = [
  { name: 'Free', price: 0, features: '10 msg/day, basic biometrics' },
  { name: 'Explorer', price: 9.99, features: 'Unlimited, voice, full bio' },
  { name: 'Guardian', price: 29.99, features: 'Priority, API, custom' },
];

// ─── Tokenomics Data ────────────────────────────────────────

type TokenomicsTab = 'overview' | 'airdrops' | 'holders' | 'vesting' | 'captable';

const MIND_OVERVIEW = {
  mint: 'EgLGfRrjX3du7Pwbj8dzyubSk8ic1WdDfq1ysLqhBm6p',
  supply: 1_000_000,
  decimals: 9,
  standard: 'Token-2022',
  transferFee: '1%',
  extensions: ['TransferFeeConfig', 'MintCloseAuthority (disabled)', 'TransferHook (disabled)', 'MetadataPointer', 'TokenMetadata'],
  lpPool: 'GNpB7YZgCkf4Efz6SATqphM8Q3jUum3dNA7Cj8Ti8MRa',
  lpLockUnlock: '2027-02-09',
  lpLocked: '100%',
  lpPlatform: 'FluxBeam',
  preSalePrice: 0.20,
  initialLiquidity: { sol: 16.21, mind: 7047 },
  deployer: 'CCsJLZR8b19iDgS9hXUYs9q2c928ihzZdfSgZLPYffWg',
  manemusWallet: '8ZmFaf69469Qd7bWNCw4PP9KCRXNPg2yRbzdbruDdSXD',
  origin: 'Airdrop to $COMPUTE holders (snapshot of on-chain balances)',
};

const AIRDROP_DATA = {
  totalRecipients: 546,
  grossSent: 67_437,
  duplicateExtra: 18_265,
  failedWallets: 132,
  holdersRemaining: 15,
  holdRate: 2.8,
  mindStillHeld: 36_682,
  sellRate: 97,
};

const TOP_HOLDERS = [
  { wallet: '6CiQJ5ab5Qb9c7MPn3BMJDTYsMtBVV3GAizYww7hKgBz', mind: 15_345, identity: 'Smithii Staking PDA ($UBC pool)', isTeam: true },
  { wallet: '8pkCEtFZaRfbyK7nAyBX2hAppEJxuPt1vXT9me3RKCUh', mind: 11_526, identity: 'Smithii Staking PDA ($UBC pool)', isTeam: true },
  { wallet: 'AwvmKM8zsMSRNmvJC4HQ4cQguRMDe9jZYeoYuAE43T1e', mind: 4_200, identity: 'External holder (Coinbase Prime)', isTeam: false },
  { wallet: '9jejKXshrwF2qnLPpR1CNYWfnQnZqS7jk54n1ewqtzez', mind: 4_072, identity: 'Smithii Staking PDA (Paul dev)', isTeam: true },
  { wallet: '2g2PLyFBbCU6eG2kRNyXuMdmtS6kZ5EJibpAF9aNZ9mG', mind: 769, identity: 'Smithii Staking PDA', isTeam: true },
  { wallet: 'FP6jnN3vcmUhNekR7XMjoDU4jRcKo1ZzBFbehGYzy7FN', mind: 769, identity: 'Smithii Staking PDA', isTeam: true },
];

const VESTING_SCHEDULES = [
  { name: 'Crypto Colombus', panel: 'ubcadvisor1', amount: '100M $COMPUTE', duration: '1yr linear', unlocks: 5 },
  { name: 'Mel', panel: 'ubc-advisor6', amount: '10M initial + 100M over 1yr', duration: '1yr linear', unlocks: null },
];

const CAP_TABLE = [
  { name: 'Lester Reynolds (Nicolas)', role: 'CTO / Founder', wallet: 'GcWA4L...', notes: 'Creator of $UBC & $COMPUTE' },
  { name: 'Bassel Tablet', role: 'Advisor', wallet: 'BmXdHy...', notes: '111,414 MIND (settled)' },
  { name: 'Thomas Silloway', role: 'Investor', wallet: null, notes: 'Early investor' },
  { name: 'Sébastien Deshaux', role: 'Advisor', wallet: null, notes: '' },
  { name: 'Emmanuel Théry', role: 'Advisor', wallet: null, notes: '' },
  { name: 'Paul', role: 'Developer', wallet: '4xYR2q...', notes: 'Dev access in UBC Airtable' },
  { name: 'Etienne', role: 'Developer', wallet: '2kzarq...', notes: 'Dev access in UBC Airtable' },
];

const UBC_ECOSYSTEM = {
  ubcMint: '9psiRdn9cXYVps4F1kFuoNjd2EtmqNJXrCPmRppJpump',
  computeMint: 'B1N1HcMm4RysYz4smsXwmk2UnS8NziqKCM6Ho8i62vXo',
  stakingProgram: 'stsJYTwxUiCYVRTf2TA6RhDXFEKYQ1BSVf2BdNhstxC',
  stakingPools: ['/ubc', '/ubc2', '/ubc3', '/ubc5', '/compute2'],
  stakingPlatform: 'stake.smithii.io',
  ubcStakingRates: [
    { lock: '90 days', rate: '0.3 $COMPUTE / 1000 $UBC / day' },
    { lock: '165 days', rate: '0.5 $COMPUTE / 1000 $UBC / day' },
    { lock: '365 days', rate: '1.0 $COMPUTE / 1000 $UBC / day' },
  ],
  totalSwarms: 25,
  notableSwarms: ['KinKong', 'SwarmVentures', 'Synthetic Souls', 'Terminal Velocity'],
  revenueModel: '35% infra, 25% community, 20% dev, 15% security, 5% ecosystem',
};

// ─── Helpers ─────────────────────────────────────────────────

function fmt(n: number, currency: 'USD' | 'EUR' = 'USD'): string {
  const sym = currency === 'EUR' ? '\u20AC' : '$';
  return `${sym}${n.toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;
}

function isAuthorized(walletAddress: string | null): boolean {
  if (!walletAddress) return false;
  return (AUTHORIZED_WALLETS as readonly string[]).includes(walletAddress);
}

// ─── Chart Components ────────────────────────────────────────

function DonutChart({ expenses }: { expenses: Expense[] }) {
  const active = expenses.filter((e) => e.status !== 'cancelled' && e.frequency === 'monthly');
  const total = active.reduce((s, e) => s + e.amount, 0);
  if (total === 0) return null;

  const size = 240;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2 - 4;
  const innerR = outerR * 0.6;
  let cumulative = 0;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[260px]">
      {active.map((item) => {
        const startAngle = (cumulative / total) * 360;
        cumulative += item.amount;
        const endAngle = (cumulative / total) * 360;
        const startRad = ((startAngle - 90) * Math.PI) / 180;
        const endRad = ((endAngle - 90) * Math.PI) / 180;
        const largeArc = endAngle - startAngle > 180 ? 1 : 0;
        const ox1 = cx + outerR * Math.cos(startRad);
        const oy1 = cy + outerR * Math.sin(startRad);
        const ox2 = cx + outerR * Math.cos(endRad);
        const oy2 = cy + outerR * Math.sin(endRad);
        const ix1 = cx + innerR * Math.cos(endRad);
        const iy1 = cy + innerR * Math.sin(endRad);
        const ix2 = cx + innerR * Math.cos(startRad);
        const iy2 = cy + innerR * Math.sin(startRad);

        return (
          <path
            key={item.id}
            d={`M ${ox1} ${oy1} A ${outerR} ${outerR} 0 ${largeArc} 1 ${ox2} ${oy2} L ${ix1} ${iy1} A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix2} ${iy2} Z`}
            fill={item.color}
            stroke="#09090b"
            strokeWidth="1.5"
            opacity={item.status === 'to_acquire' ? 0.5 : 1}
          />
        );
      })}
      <text x={cx} y={cy - 8} textAnchor="middle" className="fill-white font-bold" style={{ fontSize: 26 }}>
        ${total}
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" className="fill-zinc-500" style={{ fontSize: 12 }}>
        /month
      </text>
    </svg>
  );
}

function MonthlyForecastBar({ expenses }: { expenses: Expense[] }) {
  const monthly = expenses.filter((e) => e.status !== 'cancelled' && e.frequency === 'monthly');
  const monthlyTotal = monthly.reduce((s, e) => s + e.amount, 0);

  const months = [
    { label: 'Feb', infra: monthlyTotal, extra: 118.44 + 99, note: 'IONOS debt + WAHA Pro' },
    { label: 'Mar', infra: monthlyTotal, extra: 0, note: 'Steady state' },
    { label: 'Apr', infra: monthlyTotal, extra: 1500, note: 'SAS creation' },
    { label: 'May', infra: monthlyTotal, extra: 99 + 25, note: 'Apple + Google dev' },
  ];

  const maxVal = Math.max(...months.map((m) => m.infra + m.extra)) * 1.15;
  const barW = 56;
  const gap = 28;
  const chartW = months.length * (barW + gap);
  const chartH = 160;
  const pad = 24;

  return (
    <div>
      <svg viewBox={`0 0 ${chartW + 50} ${chartH + pad + 50}`} className="w-full max-w-md mx-auto">
        {[0, 0.5, 1].map((pct) => {
          const y = pad + chartH - pct * chartH;
          return (
            <g key={pct}>
              <line x1={38} y1={y} x2={chartW + 38} y2={y} stroke="#27272a" strokeWidth="1" />
              <text x={34} y={y + 4} textAnchor="end" className="fill-zinc-600" style={{ fontSize: 10 }}>
                ${Math.round(maxVal * pct)}
              </text>
            </g>
          );
        })}
        {months.map((m, i) => {
          const x = 42 + i * (barW + gap);
          const infraH = (m.infra / maxVal) * chartH;
          const extraH = (m.extra / maxVal) * chartH;
          const yBase = pad + chartH;
          return (
            <g key={m.label}>
              <rect x={x} y={yBase - infraH} width={barW} height={infraH} rx={4} fill="#f59e0b" opacity={0.8} />
              {m.extra > 0 && (
                <rect x={x} y={yBase - infraH - extraH} width={barW} height={extraH} rx={4} fill="#ef4444" opacity={0.8} />
              )}
              <text x={x + barW / 2} y={yBase - infraH - extraH - 6} textAnchor="middle" className="fill-white font-bold" style={{ fontSize: 11 }}>
                ${Math.round(m.infra + m.extra)}
              </text>
              <text x={x + barW / 2} y={yBase + 16} textAnchor="middle" className="fill-zinc-400" style={{ fontSize: 11 }}>
                {m.label}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="flex justify-center gap-6 mt-2">
        <span className="flex items-center gap-1.5 text-[10px] text-zinc-500"><span className="w-2.5 h-2.5 rounded-sm bg-amber-500/80" /> Monthly infra</span>
        <span className="flex items-center gap-1.5 text-[10px] text-zinc-500"><span className="w-2.5 h-2.5 rounded-sm bg-red-500/80" /> One-shot</span>
      </div>
    </div>
  );
}

function ProgressBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-mono text-zinc-400 w-28 text-right truncate">{label}</span>
      <div className="flex-1 h-3.5 rounded-full bg-zinc-800 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-mono text-zinc-300 w-10">{pct}%</span>
    </div>
  );
}

// ─── Tokenomics Components ───────────────────────────────────

function TokenomicsTabs({ active, onChange }: { active: TokenomicsTab; onChange: (t: TokenomicsTab) => void }) {
  const tabs: { id: TokenomicsTab; label: string }[] = [
    { id: 'overview', label: '$MIND Overview' },
    { id: 'airdrops', label: 'Airdrops' },
    { id: 'holders', label: 'Holders' },
    { id: 'vesting', label: 'Vesting' },
    { id: 'captable', label: 'Cap Table' },
  ];
  return (
    <div className="flex gap-1 border-b border-zinc-800 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-4 py-2 text-sm font-medium transition relative whitespace-nowrap ${
            active === tab.id ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          {tab.label}
          {active === tab.id && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500" />
          )}
        </button>
      ))}
    </div>
  );
}

function truncAddr(addr: string, n = 6) {
  return addr.length > n * 2 ? `${addr.slice(0, n)}...${addr.slice(-4)}` : addr;
}

function OverviewTab() {
  const [price, setPrice] = useState<{ mind_price_usd: number | null; mind_per_sol: number | null } | null>(null);
  useEffect(() => {
    fetch('/api/wallet/price').then(r => r.json()).then(setPrice).catch(() => { console.error('Failed to fetch MIND price'); });
  }, []);

  return (
    <div className="space-y-6">
      {/* Live price */}
      {price?.mind_price_usd != null && (
        <div className="p-4 rounded-xl border border-violet-500/30 bg-violet-500/5">
          <p className="text-[10px] font-mono text-zinc-500 uppercase mb-1">Live Price</p>
          <p className="text-3xl font-mono font-bold text-violet-400">${price.mind_price_usd.toFixed(4)}</p>
          {price.mind_per_sol != null && (
            <p className="text-xs font-mono text-zinc-500 mt-1">{price.mind_per_sol.toFixed(2)} $MIND / SOL</p>
          )}
        </div>
      )}

      {/* Token details grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Mint', value: truncAddr(MIND_OVERVIEW.mint), mono: true },
          { label: 'Supply', value: '1,000,000', mono: true },
          { label: 'Decimals', value: String(MIND_OVERVIEW.decimals), mono: true },
          { label: 'Standard', value: MIND_OVERVIEW.standard },
          { label: 'Transfer Fee', value: MIND_OVERVIEW.transferFee, highlight: true },
          { label: 'Pre-sale Price', value: `$${MIND_OVERVIEW.preSalePrice}`, mono: true },
          { label: 'Deployer', value: truncAddr(MIND_OVERVIEW.deployer), mono: true },
          { label: 'Protocol Wallet', value: truncAddr(MIND_OVERVIEW.manemusWallet), mono: true },
        ].map((item) => (
          <div key={item.label} className="p-3 rounded-lg border border-zinc-800 bg-zinc-900/30">
            <p className="text-[10px] font-mono text-zinc-600 uppercase">{item.label}</p>
            <p className={`text-sm font-bold ${item.highlight ? 'text-amber-500' : 'text-white'} ${item.mono ? 'font-mono' : ''}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Extensions */}
      <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/30">
        <p className="text-[10px] font-mono text-zinc-600 uppercase mb-2">Token Extensions</p>
        <div className="flex flex-wrap gap-1.5">
          {MIND_OVERVIEW.extensions.map((ext) => (
            <span key={ext} className={`px-2.5 py-1 rounded-full text-[10px] font-mono ${ext.includes('disabled') ? 'bg-zinc-800/50 text-zinc-600 border border-zinc-700/30' : 'bg-violet-500/10 text-violet-400 border border-violet-500/30'}`}>{ext}</span>
          ))}
        </div>
      </div>

      {/* Liquidity Pool */}
      <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/30">
        <p className="text-[10px] font-mono text-zinc-600 uppercase mb-3">Liquidity Pool</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <p className="text-[10px] text-zinc-600">Platform</p>
            <p className="text-sm font-bold text-white">{MIND_OVERVIEW.lpPlatform}</p>
          </div>
          <div>
            <p className="text-[10px] text-zinc-600">LP Locked</p>
            <p className="text-sm font-bold text-emerald-400">{MIND_OVERVIEW.lpLocked}</p>
          </div>
          <div>
            <p className="text-[10px] text-zinc-600">Unlock Date</p>
            <p className="text-sm font-bold text-white font-mono">{MIND_OVERVIEW.lpLockUnlock}</p>
          </div>
          <div>
            <p className="text-[10px] text-zinc-600">Initial LP</p>
            <p className="text-sm font-bold text-white font-mono">{MIND_OVERVIEW.initialLiquidity.sol} SOL + {MIND_OVERVIEW.initialLiquidity.mind.toLocaleString()} MIND</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <a href={`https://solscan.io/token/${MIND_OVERVIEW.mint}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-zinc-800/50 border border-zinc-700/50 text-zinc-400 text-xs font-mono hover:bg-zinc-800 transition">Solscan (MIND)</a>
          <a href={`https://dexscreener.com/solana/${MIND_OVERVIEW.lpPool}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-zinc-800/50 border border-zinc-700/50 text-zinc-400 text-xs font-mono hover:bg-zinc-800 transition">DEXScreener</a>
          <a href={`https://jup.ag/swap/SOL-${MIND_OVERVIEW.mint}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-zinc-800/50 border border-zinc-700/50 text-zinc-400 text-xs font-mono hover:bg-zinc-800 transition">Jupiter</a>
        </div>
      </div>

      {/* UBC Ecosystem */}
      <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/30">
        <p className="text-[10px] font-mono text-zinc-600 uppercase mb-3">UBC / $COMPUTE Ecosystem</p>
        <p className="text-xs text-zinc-500 mb-3">{MIND_OVERVIEW.origin}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
          <div>
            <p className="text-[10px] text-zinc-600">$UBC Mint</p>
            <p className="text-xs font-mono text-zinc-400">{truncAddr(UBC_ECOSYSTEM.ubcMint)}</p>
          </div>
          <div>
            <p className="text-[10px] text-zinc-600">$COMPUTE Mint</p>
            <p className="text-xs font-mono text-zinc-400">{truncAddr(UBC_ECOSYSTEM.computeMint)}</p>
          </div>
          <div>
            <p className="text-[10px] text-zinc-600">Staking Program</p>
            <p className="text-xs font-mono text-zinc-400">{truncAddr(UBC_ECOSYSTEM.stakingProgram)}</p>
          </div>
          <div>
            <p className="text-[10px] text-zinc-600">Staking Platform</p>
            <p className="text-xs font-bold text-white">{UBC_ECOSYSTEM.stakingPlatform}</p>
          </div>
          <div>
            <p className="text-[10px] text-zinc-600">Total Swarms</p>
            <p className="text-xs font-bold text-white">{UBC_ECOSYSTEM.totalSwarms}</p>
          </div>
          <div>
            <p className="text-[10px] text-zinc-600">Revenue Split</p>
            <p className="text-xs text-zinc-400">{UBC_ECOSYSTEM.revenueModel}</p>
          </div>
        </div>
        <p className="text-[10px] font-mono text-zinc-600 uppercase mb-2">Staking Rates</p>
        <div className="space-y-1">
          {UBC_ECOSYSTEM.ubcStakingRates.map((r) => (
            <div key={r.lock} className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-mono">{r.lock}</span>
              <span className="text-white font-mono">{r.rate}</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] font-mono text-zinc-600 uppercase mt-3 mb-2">Notable Swarms</p>
        <div className="flex flex-wrap gap-1.5">
          {UBC_ECOSYSTEM.notableSwarms.map((s) => (
            <span key={s} className="px-2.5 py-1 rounded-full bg-zinc-800/50 border border-zinc-700/30 text-zinc-400 text-[10px] font-mono">{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function AirdropsTab() {
  const d = AIRDROP_DATA;
  const holdPct = d.holdRate;
  const soldPct = 100 - holdPct;

  // Donut chart for hold vs sold
  const size = 180;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2 - 4;
  const innerR = outerR * 0.6;
  const holdAngle = (holdPct / 100) * 360;
  const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180;

  const holdStartRad = toRad(0);
  const holdEndRad = toRad(holdAngle);
  const soldStartRad = toRad(holdAngle);
  const soldEndRad = toRad(360);

  const holdPath = `M ${cx + outerR * Math.cos(holdStartRad)} ${cy + outerR * Math.sin(holdStartRad)} A ${outerR} ${outerR} 0 0 1 ${cx + outerR * Math.cos(holdEndRad)} ${cy + outerR * Math.sin(holdEndRad)} L ${cx + innerR * Math.cos(holdEndRad)} ${cy + innerR * Math.sin(holdEndRad)} A ${innerR} ${innerR} 0 0 0 ${cx + innerR * Math.cos(holdStartRad)} ${cy + innerR * Math.sin(holdStartRad)} Z`;
  const soldPath = `M ${cx + outerR * Math.cos(soldStartRad)} ${cy + outerR * Math.sin(soldStartRad)} A ${outerR} ${outerR} 0 1 1 ${cx + outerR * Math.cos(soldEndRad)} ${cy + outerR * Math.sin(soldEndRad)} L ${cx + innerR * Math.cos(soldEndRad)} ${cy + innerR * Math.sin(soldEndRad)} A ${innerR} ${innerR} 0 1 0 ${cx + innerR * Math.cos(soldStartRad)} ${cy + innerR * Math.sin(soldStartRad)} Z`;

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Recipients', value: d.totalRecipients.toLocaleString(), color: 'text-white' },
          { label: 'Gross Sent', value: `${d.grossSent.toLocaleString()} MIND`, color: 'text-white' },
          { label: 'Hold Rate', value: `${d.holdRate}%`, color: 'text-amber-500' },
          { label: 'Still Held', value: `${d.mindStillHeld.toLocaleString()} MIND`, color: 'text-emerald-400' },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/30 text-center">
            <p className="text-[10px] font-mono text-zinc-600 uppercase mb-1">{s.label}</p>
            <p className={`text-lg font-mono font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Donut */}
        <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/30 flex flex-col items-center">
          <p className="text-[10px] font-mono text-zinc-600 uppercase mb-4">Hold vs Sold</p>
          <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[200px]">
            <path d={holdPath} fill="#8b5cf6" stroke="#09090b" strokeWidth="1.5" />
            <path d={soldPath} fill="#3f3f46" stroke="#09090b" strokeWidth="1.5" />
            <text x={cx} y={cy - 4} textAnchor="middle" className="fill-white font-bold" style={{ fontSize: 22 }}>{d.sellRate}%</text>
            <text x={cx} y={cy + 12} textAnchor="middle" className="fill-zinc-500" style={{ fontSize: 10 }}>sold</text>
          </svg>
          <div className="flex gap-4 mt-3">
            <span className="flex items-center gap-1.5 text-[10px] text-zinc-500"><span className="w-2.5 h-2.5 rounded-sm bg-violet-500" /> Held ({holdPct}%)</span>
            <span className="flex items-center gap-1.5 text-[10px] text-zinc-500"><span className="w-2.5 h-2.5 rounded-sm bg-zinc-600" /> Sold ({soldPct}%)</span>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/30 space-y-3">
          <p className="text-[10px] font-mono text-zinc-600 uppercase mb-2">Airdrop Details</p>
          {[
            { label: 'Total recipients', value: d.totalRecipients.toLocaleString() },
            { label: 'Gross MIND sent', value: d.grossSent.toLocaleString() },
            { label: 'Duplicate/extra sends', value: d.duplicateExtra.toLocaleString(), note: 'Script ran multiple times' },
            { label: 'Failed wallets', value: d.failedWallets.toLocaleString(), note: 'Closed/invalid accounts' },
            { label: 'Remaining holders', value: String(d.holdersRemaining), note: '5 are team staking PDAs' },
            { label: 'MIND still held', value: d.mindStillHeld.toLocaleString() },
          ].map((row) => (
            <div key={row.label} className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-zinc-400">{row.label}</span>
                {row.note && <span className="text-[10px] text-zinc-600 ml-2">{row.note}</span>}
              </div>
              <span className="text-sm font-mono text-white font-bold">{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HoldersTab() {
  return (
    <div className="space-y-4">
      <p className="text-xs text-zinc-500">Top holders by $MIND balance. Team wallets are Smithii staking PDAs from the $UBC ecosystem.</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-zinc-500 text-xs uppercase border-b border-zinc-800">
              <th className="text-left py-2 font-mono">#</th>
              <th className="text-left py-2 font-mono">Wallet</th>
              <th className="text-right py-2 font-mono">$MIND</th>
              <th className="text-left py-2 pl-4 font-mono">Identity</th>
              <th className="text-center py-2 font-mono">Type</th>
            </tr>
          </thead>
          <tbody>
            {TOP_HOLDERS.map((h, i) => (
              <tr key={h.wallet} className="border-b border-zinc-800/50">
                <td className="py-3 text-zinc-600 font-mono">{i + 1}</td>
                <td className="py-3">
                  <a href={`https://solscan.io/account/${h.wallet}`} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-violet-400 hover:text-violet-300 transition">
                    {truncAddr(h.wallet, 8)}
                  </a>
                </td>
                <td className="py-3 text-right font-mono font-bold text-white">{h.mind.toLocaleString()}</td>
                <td className="py-3 pl-4 text-xs text-zinc-400">{h.identity}</td>
                <td className="py-3 text-center">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-mono font-medium ${h.isTeam ? 'bg-zinc-800 text-zinc-400 border border-zinc-700' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'}`}>
                    {h.isTeam ? 'Team' : 'External'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-zinc-700">
              <td className="py-3 text-white font-bold" colSpan={2}>Total (top holders)</td>
              <td className="py-3 text-right font-mono font-bold text-amber-500">{TOP_HOLDERS.reduce((s, h) => s + h.mind, 0).toLocaleString()}</td>
              <td colSpan={2} />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function VestingTab() {
  return (
    <div className="space-y-4">
      <p className="text-xs text-zinc-500">Vesting schedules for advisors and early contributors, managed through Smithii staking panels.</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-zinc-500 text-xs uppercase border-b border-zinc-800">
              <th className="text-left py-2 font-mono">Name</th>
              <th className="text-left py-2 font-mono">Panel</th>
              <th className="text-left py-2 font-mono">Amount</th>
              <th className="text-left py-2 font-mono">Duration</th>
              <th className="text-center py-2 font-mono">Unlocks</th>
            </tr>
          </thead>
          <tbody>
            {VESTING_SCHEDULES.map((v) => (
              <tr key={v.name} className="border-b border-zinc-800/50">
                <td className="py-3 text-white font-medium">{v.name}</td>
                <td className="py-3">
                  <a href={`https://stake.smithii.io/vesting/${v.panel}`} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-violet-400 hover:text-violet-300 transition">
                    {v.panel}
                  </a>
                </td>
                <td className="py-3 text-xs font-mono text-zinc-300">{v.amount}</td>
                <td className="py-3 text-xs text-zinc-400">{v.duration}</td>
                <td className="py-3 text-center font-mono text-white">{v.unlocks ?? <span className="text-zinc-600">&mdash;</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[10px] text-zinc-600">Vesting managed via <a href="https://stake.smithii.io" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300">Smithii</a> &mdash; staking program: <span className="font-mono">{truncAddr(UBC_ECOSYSTEM.stakingProgram)}</span></p>
    </div>
  );
}

function CapTableTab() {
  const roleBg: Record<string, string> = {
    'CTO / Founder': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    'Advisor': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    'Investor': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    'Developer': 'bg-violet-500/10 text-violet-400 border-violet-500/30',
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-zinc-500">Core team, advisors, and early investors in the UBC / $MIND ecosystem.</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-zinc-500 text-xs uppercase border-b border-zinc-800">
              <th className="text-left py-2 font-mono">Name</th>
              <th className="text-left py-2 font-mono">Role</th>
              <th className="text-left py-2 font-mono">Wallet</th>
              <th className="text-left py-2 font-mono">Notes</th>
            </tr>
          </thead>
          <tbody>
            {CAP_TABLE.map((p) => (
              <tr key={p.name} className="border-b border-zinc-800/50">
                <td className="py-3 text-white font-medium">{p.name}</td>
                <td className="py-3">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border ${roleBg[p.role] || 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
                    {p.role}
                  </span>
                </td>
                <td className="py-3 text-xs font-mono text-zinc-400">{p.wallet ?? <span className="text-zinc-600">&mdash;</span>}</td>
                <td className="py-3 text-xs text-zinc-500">{p.notes || <span className="text-zinc-700">&mdash;</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Expense Row ─────────────────────────────────────────────

function StatusBadge({ status }: { status: ExpenseStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
      {cfg.label}
    </span>
  );
}

function ExpenseRow({
  expense,
  onStatusChange,
  onRemove,
}: {
  expense: Expense;
  onStatusChange: (id: string, status: ExpenseStatus) => void;
  onRemove: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const isCancelled = expense.status === 'cancelled';

  return (
    <div className={`border rounded-xl transition-all ${isCancelled ? 'border-zinc-800/30 bg-zinc-900/20 opacity-50' : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'}`}>
      <div className="flex items-center gap-3 px-4 py-3 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: expense.color }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-sm font-medium ${isCancelled ? 'line-through text-zinc-600' : 'text-white'}`}>{expense.name}</span>
            <StatusBadge status={expense.status} />
            <span className="text-[10px] font-mono text-zinc-600 uppercase">{expense.category}</span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <span className={`text-sm font-mono font-bold ${isCancelled ? 'text-zinc-600' : 'text-white'}`}>
            {fmt(expense.amount, expense.currency)}
          </span>
          <span className="text-[10px] text-zinc-600 font-mono ml-1">
            /{expense.frequency === 'monthly' ? 'mo' : expense.frequency === 'annual' ? 'yr' : 'once'}
          </span>
        </div>
        <svg className={`w-4 h-4 text-zinc-600 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-zinc-800/50">
          {expense.note && <p className="text-xs text-zinc-500 mb-3">{expense.note}</p>}
          <div className="flex flex-wrap gap-2">
            {expense.status !== 'active' && expense.status !== 'cancelled' && (
              <button
                onClick={(e) => { e.stopPropagation(); onStatusChange(expense.id, 'active'); }}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition"
              >
                Confirm Active
              </button>
            )}
            {expense.status === 'to_acquire' && (
              <button
                onClick={(e) => { e.stopPropagation(); onStatusChange(expense.id, 'pending'); }}
                className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium hover:bg-amber-500/20 transition"
              >
                Confirm Need
              </button>
            )}
            {expense.status !== 'to_review' && expense.status !== 'cancelled' && (
              <button
                onClick={(e) => { e.stopPropagation(); onStatusChange(expense.id, 'to_review'); }}
                className="px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-medium hover:bg-orange-500/20 transition"
              >
                Flag for Review
              </button>
            )}
            {expense.status !== 'cancelled' && (
              <button
                onClick={(e) => { e.stopPropagation(); onStatusChange(expense.id, 'cancelled'); }}
                className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium hover:bg-red-500/20 transition"
              >
                Cancel
              </button>
            )}
            {expense.status === 'cancelled' && (
              <button
                onClick={(e) => { e.stopPropagation(); onStatusChange(expense.id, 'pending'); }}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 text-xs font-medium hover:bg-zinc-700 transition"
              >
                Restore
              </button>
            )}
            {expense.status === 'cancelled' && (
              <button
                onClick={(e) => { e.stopPropagation(); onRemove(expense.id); }}
                className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium hover:bg-red-500/20 transition"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────

export default function OrgPage({ params }: { params: { slug: string } }) {
  const [mounted, setMounted] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [filter, setFilter] = useState<'all' | ExpenseStatus>('all');
  const [tokenTab, setTokenTab] = useState<TokenomicsTab>('overview');
  const { publicKey } = useWallet();

  useEffect(() => setMounted(true), []);

  const walletAddress = publicKey?.toBase58() ?? null;
  const hasFinancialAccess = isAuthorized(walletAddress);

  const handleStatusChange = useCallback((id: string, status: ExpenseStatus) => {
    setExpenses((prev) => prev.map((e) => e.id === id ? { ...e, status } : e));
  }, []);

  const handleRemove = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const profile = ORG_PROFILES[params.slug];

  if (!profile) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-500 mb-4">Organization not found.</p>
          <Link href="/org" className="text-amber-500 hover:text-amber-400 text-sm transition">
            Browse all organisations
          </Link>
        </div>
      </main>
    );
  }

  // Computed values for financial section
  const active = expenses.filter((e) => e.status !== 'cancelled');
  const monthlyTotal = active.filter((e) => e.frequency === 'monthly').reduce((s, e) => s + e.amount, 0);
  const annualTotal = active.filter((e) => e.frequency === 'annual').reduce((s, e) => s + e.amount, 0);
  const oneShotTotal = active.filter((e) => e.frequency === 'one-shot').reduce((s, e) => s + e.amount, 0);
  const filtered = filter === 'all' ? expenses : expenses.filter((e) => e.status === filter);

  const statusCounts = {
    active: expenses.filter((e) => e.status === 'active').length,
    pending: expenses.filter((e) => e.status === 'pending').length,
    to_acquire: expenses.filter((e) => e.status === 'to_acquire').length,
    to_review: expenses.filter((e) => e.status === 'to_review').length,
    cancelled: expenses.filter((e) => e.status === 'cancelled').length,
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <article className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">

        {/* ════════════════════════════════════════════════════════
            PUBLIC PROFILE — visible to everyone
            ════════════════════════════════════════════════════════ */}

        <header className={`text-center mb-12 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Organisation
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">{profile.name}</h1>
          <p className="text-lg text-zinc-400 max-w-xl mx-auto mb-2">{profile.tagline}</p>
          <p className="text-sm text-zinc-500 max-w-2xl mx-auto">{profile.description}</p>
        </header>

        {/* Links */}
        <div className={`flex flex-wrap justify-center gap-2 mb-10 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {profile.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="px-4 py-2 rounded-lg bg-zinc-900/50 border border-zinc-800 text-zinc-400 text-sm font-mono hover:border-zinc-600 hover:text-white transition"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Token Info (public) */}
        {profile.token && (
          <div className={`mb-10 transition-all duration-700 delay-150 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-4">Token</h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {[
                { label: 'Symbol', value: profile.token.symbol, color: 'text-amber-500' },
                { label: 'Supply', value: '1M', color: 'text-white' },
                { label: 'Fee', value: '1%', color: 'text-amber-500' },
                { label: 'LP Locked', value: '100%', color: 'text-emerald-400' },
                { label: 'LP Unlock', value: '2027', color: 'text-white' },
                { label: 'Standard', value: profile.token.standard, color: 'text-white' },
              ].map((s) => (
                <div key={s.label} className="p-3 rounded-lg border border-zinc-800 bg-zinc-900/30 text-center">
                  <p className="text-[10px] font-mono text-zinc-600 uppercase">{s.label}</p>
                  <p className={`text-sm font-bold font-mono ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <a href={`https://solscan.io/token/${profile.token.mint}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-zinc-800/50 border border-zinc-700/50 text-zinc-400 text-xs font-mono hover:bg-zinc-800 transition">Solscan</a>
              <a href={`https://solscan.io/account/${MIND_WALLET}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-zinc-800/50 border border-zinc-700/50 text-zinc-400 text-xs font-mono hover:bg-zinc-800 transition">Protocol Wallet</a>
              <a href={`https://dexscreener.com/solana/${LP_POOL}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-zinc-800/50 border border-zinc-700/50 text-zinc-400 text-xs font-mono hover:bg-zinc-800 transition">DEXScreener</a>
            </div>
          </div>
        )}

        {/* Roadmap Progress (public) */}
        <section className={`mb-10 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-4">Roadmap Progress</h2>
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/30 space-y-2.5">
            {COMPLETION.map((item) => (
              <ProgressBar key={item.name} label={item.name} pct={item.pct} color={item.color} />
            ))}
          </div>
        </section>

        {/* Revenue Model (public) */}
        <section className={`mb-10 transition-all duration-700 delay-250 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-4">Revenue Model</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {REVENUE_TIERS.map((tier) => (
              <div key={tier.name} className={`p-4 rounded-xl border ${tier.price === 0 ? 'border-zinc-800 bg-zinc-900/30' : tier.price < 20 ? 'border-blue-500/30 bg-blue-500/5' : 'border-amber-500/30 bg-amber-500/5'}`}>
                <h3 className="text-base font-bold text-white mb-1">{tier.name}</h3>
                <p className="text-xl font-mono font-bold text-amber-500">
                  {tier.price === 0 ? 'Free' : `$${tier.price}`}{tier.price > 0 && <span className="text-xs text-zinc-500">/mo</span>}
                </p>
                <p className="text-xs text-zinc-400 mt-2">{tier.features}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            FINANCIAL DASHBOARD — wallet-gated
            ════════════════════════════════════════════════════════ */}

        <div className="mt-16 pt-10 border-t border-zinc-800">
          {!hasFinancialAccess ? (
            /* Locked state — friendly explanation */
            <div className={`text-center py-12 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="max-w-lg mx-auto p-8 rounded-2xl border border-zinc-800 bg-zinc-900/30">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-5">
                  <svg className="w-7 h-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Team Financial Dashboard</h3>
                <p className="text-sm text-zinc-400 mb-4 leading-relaxed">
                  This section contains detailed expense tracking, budget forecasts, and financial management tools for the Mind Protocol core team.
                </p>
                <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
                  Access is restricted to founding team wallets. If you&apos;re a team member, connect your Solana wallet below.
                </p>
                <div className="flex justify-center mb-4">
                  <WalletMultiButton className="!bg-amber-500/10 !border !border-amber-500/30 !text-amber-500 !rounded-xl !font-mono !text-sm hover:!bg-amber-500/20 !transition" />
                </div>
                {walletAddress && !hasFinancialAccess && (
                  <p className="text-xs text-zinc-500 mt-3 font-mono">
                    Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)} &middot; <span className="text-amber-500/70">Not in team list</span>
                  </p>
                )}
                <p className="text-[10px] text-zinc-600 mt-4">
                  Public information is shown above &mdash; token stats, roadmap, and revenue model are visible to everyone.
                </p>
              </div>
            </div>
          ) : (
            /* Authorized — full financial dashboard */
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-mono mb-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    Financial Dashboard
                  </div>
                  <p className="text-xs text-zinc-500 font-mono">
                    Connected: {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
                  </p>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
                <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 text-center">
                  <p className="text-[10px] font-mono text-zinc-500 uppercase mb-1">Monthly Burn</p>
                  <p className="text-2xl font-mono font-bold text-amber-500">${monthlyTotal}</p>
                </div>
                <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/30 text-center">
                  <p className="text-[10px] font-mono text-zinc-500 uppercase mb-1">Annual Costs</p>
                  <p className="text-2xl font-mono font-bold text-white">${annualTotal}</p>
                </div>
                <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/5 text-center">
                  <p className="text-[10px] font-mono text-zinc-500 uppercase mb-1">One-shot Pending</p>
                  <p className="text-2xl font-mono font-bold text-red-400">${oneShotTotal.toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-center">
                  <p className="text-[10px] font-mono text-zinc-500 uppercase mb-1">Breakeven</p>
                  <p className="text-2xl font-mono font-bold text-emerald-400">~60</p>
                  <p className="text-[10px] text-zinc-500">subscribers</p>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/30">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-4">Monthly Breakdown</h3>
                  <div className="flex justify-center">
                    <DonutChart expenses={expenses} />
                  </div>
                </div>
                <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/30">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-4">Feb–May 2026 Forecast</h3>
                  <MonthlyForecastBar expenses={expenses} />
                </div>
              </div>

              {/* Expense Management */}
              <section className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500">
                    All Expenses ({expenses.length})
                  </h2>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1 rounded-full text-xs font-mono transition ${filter === 'all' ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                  >
                    All ({expenses.length})
                  </button>
                  {(Object.keys(STATUS_CONFIG) as ExpenseStatus[]).map((s) => {
                    const cfg = STATUS_CONFIG[s];
                    const count = statusCounts[s];
                    if (count === 0) return null;
                    return (
                      <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`px-3 py-1 rounded-full text-xs font-mono transition ${filter === s ? `${cfg.bg} ${cfg.text} border ${cfg.border}` : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                      >
                        {cfg.label} ({count})
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-2">
                  {filtered.map((expense) => (
                    <ExpenseRow
                      key={expense.id}
                      expense={expense}
                      onStatusChange={handleStatusChange}
                      onRemove={handleRemove}
                    />
                  ))}
                </div>
              </section>

              {/* Exact Monthly Figures */}
              <section className="mb-10">
                <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-4">
                  Exact Monthly Figures
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-zinc-500 text-xs uppercase border-b border-zinc-800">
                        <th className="text-left py-2 font-mono">Month</th>
                        <th className="text-right py-2 font-mono">Infra</th>
                        <th className="text-right py-2 font-mono">One-shot</th>
                        <th className="text-right py-2 font-mono">Total</th>
                        <th className="text-left py-2 pl-4 font-mono">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-zinc-800/50">
                        <td className="py-3 text-white font-medium">Feb 2026</td>
                        <td className="py-3 text-right font-mono text-zinc-300">${monthlyTotal}</td>
                        <td className="py-3 text-right font-mono text-red-400">$217</td>
                        <td className="py-3 text-right font-mono font-bold text-white">${monthlyTotal + 217}</td>
                        <td className="py-3 pl-4 text-zinc-500 text-xs">IONOS debt (€118) + WAHA Pro ($99)</td>
                      </tr>
                      <tr className="border-b border-zinc-800/50">
                        <td className="py-3 text-white font-medium">Mar 2026</td>
                        <td className="py-3 text-right font-mono text-zinc-300">${monthlyTotal}</td>
                        <td className="py-3 text-right font-mono text-zinc-600">&mdash;</td>
                        <td className="py-3 text-right font-mono font-bold text-white">${monthlyTotal}</td>
                        <td className="py-3 pl-4 text-zinc-500 text-xs">Steady state</td>
                      </tr>
                      <tr className="border-b border-zinc-800/50">
                        <td className="py-3 text-white font-medium">Apr 2026</td>
                        <td className="py-3 text-right font-mono text-zinc-300">${monthlyTotal}</td>
                        <td className="py-3 text-right font-mono text-red-400">€1,500</td>
                        <td className="py-3 text-right font-mono font-bold text-white">~${monthlyTotal + 1600}</td>
                        <td className="py-3 pl-4 text-zinc-500 text-xs">SAS creation (€1,500 ~ $1,600)</td>
                      </tr>
                      <tr className="border-b border-zinc-800/50">
                        <td className="py-3 text-white font-medium">May 2026</td>
                        <td className="py-3 text-right font-mono text-zinc-300">${monthlyTotal}</td>
                        <td className="py-3 text-right font-mono text-red-400">$124</td>
                        <td className="py-3 text-right font-mono font-bold text-white">${monthlyTotal + 124}</td>
                        <td className="py-3 pl-4 text-zinc-500 text-xs">Apple Dev ($99) + Google Play ($25)</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-zinc-700">
                        <td className="py-3 text-white font-bold">Total 4 months</td>
                        <td className="py-3 text-right font-mono text-zinc-300">${monthlyTotal * 4}</td>
                        <td className="py-3 text-right font-mono text-red-400">~$1,941</td>
                        <td className="py-3 text-right font-mono font-bold text-amber-500">~${monthlyTotal * 4 + 1941}</td>
                        <td />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </section>

              {/* Free Services */}
              <section className="mb-10">
                <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-3">Free Tier Services</h2>
                <div className="flex flex-wrap gap-1.5">
                  {['Vercel', 'ngrok', 'Telegram', 'Discord', 'Spotify', 'Garmin', 'Google APIs', 'Helius', 'Neo4j', 'CoinGecko', 'FluxBeam', 'LinkedIn', 'Gemini', 'Stripe'].map((s) => (
                    <span key={s} className="px-2.5 py-1 rounded-full bg-zinc-800/50 border border-zinc-700/30 text-zinc-500 text-[10px] font-mono">{s}</span>
                  ))}
                </div>
              </section>

              {/* ════════════════════════════════════════════════════════
                  TOKENOMICS — wallet-gated
                  ════════════════════════════════════════════════════════ */}
              <section className="mt-16 pt-10 border-t border-zinc-800">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-mono mb-6">
                  <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                  Tokenomics (Private)
                </div>
                <TokenomicsTabs active={tokenTab} onChange={setTokenTab} />
                <div className="mt-6">
                  {tokenTab === 'overview' && <OverviewTab />}
                  {tokenTab === 'airdrops' && <AirdropsTab />}
                  {tokenTab === 'holders' && <HoldersTab />}
                  {tokenTab === 'vesting' && <VestingTab />}
                  {tokenTab === 'captable' && <CapTableTab />}
                </div>
              </section>
            </>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center pt-6 border-t border-zinc-800/50">
          <p className="text-[10px] font-mono text-zinc-600">Updated February 2026 &middot; All costs in USD unless noted</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link href="/org" className="text-xs text-zinc-500 hover:text-amber-500 transition">All Organisations</Link>
            <Link href="/tokenomics" className="text-xs text-zinc-500 hover:text-amber-500 transition">Tokenomics</Link>
            <Link href="/wallet" className="text-xs text-zinc-500 hover:text-amber-500 transition">Wallet</Link>
            <Link href="/" className="text-xs text-zinc-500 hover:text-amber-500 transition">Home</Link>
          </div>
        </footer>
      </article>
    </main>
  );
}
