import { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import PriceCard from './components/PriceCard';
import SupplyBreakdown from './components/SupplyBreakdown';
import HoldersTable from './components/HoldersTable';
import ContractInfo from './components/ContractInfo';

export const metadata: Metadata = {
  title: '$MIND Token Dashboard | Mind Protocol',
  description:
    'Live $MIND token price, supply breakdown, top holders, and contract details on Solana.',
  openGraph: {
    title: '$MIND Token Dashboard',
    description:
      'Live price, allocation chart, holders, and contract info for $MIND on Solana.',
  },
};

export default function TokenDashboardPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* Header */}
        <header className="text-center mb-12">
          <p className="text-amber-500/80 text-sm tracking-widest uppercase mb-3">
            Token Dashboard
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-mono mb-3">
            $MIND
          </h1>
          <p className="text-zinc-500 text-base sm:text-lg max-w-xl mx-auto">
            Live market data, allocation, top holders, and contract details for
            the Mind Protocol token on Solana.
          </p>
        </header>

        {/* Main grid */}
        <div className="space-y-6">
          {/* Row 1: Price + Contract side by side on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PriceCard />
            <ContractInfo />
          </div>

          {/* Row 2: Supply breakdown (full width) */}
          <SupplyBreakdown />

          {/* Row 3: Holders table (full width) */}
          <HoldersTable />
        </div>

        {/* Footer links */}
        <div className="mt-12 text-center">
          <p className="text-zinc-600 text-xs mb-4">
            Data sourced from Solana blockchain via FluxBeam DEX. Prices update
            every 30 seconds.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <Link
              href="/tokenomics"
              className="text-zinc-400 hover:text-amber-500 transition underline underline-offset-4"
            >
              Full Tokenomics
            </Link>
            <span className="text-zinc-700">|</span>
            <Link
              href="/wallet"
              className="text-zinc-400 hover:text-amber-500 transition underline underline-offset-4"
            >
              Wallet Tools
            </Link>
            <span className="text-zinc-700">|</span>
            <Link
              href="/whitepaper"
              className="text-zinc-400 hover:text-amber-500 transition underline underline-offset-4"
            >
              Whitepaper
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
