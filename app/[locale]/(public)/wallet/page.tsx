'use client';

import { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { MIND_MINT as MIND_CA, SOL_MINT } from '@/lib/constants/solana';

const FLUXBEAM_LP_URL = `https://fluxbeam.xyz/app/liquidity?inMint=${SOL_MINT}&outMint=${MIND_CA}`;

interface BalanceData {
  address: string;
  sol: number;
  mind: number;
  has_mind_ata: boolean;
  ata_address: string | null;
}

interface PriceData {
  mind_per_sol: number;
  sol_per_mind: number;
  mind_price_usd: number;
  sol_price_usd: number;
}

interface PrepareData {
  sender: string;
  recipient: string;
  amount: number;
  amount_raw: number;
  transfer_fee: number;
  transfer_fee_bps: number;
  receive_amount: number;
  needs_ata: boolean;
  ata_rent_sol: number;
  recipient_ata: string | null;
  sender_ata: string;
  sender_balance: number;
}

function formatNumber(n: number, decimals = 4): string {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: decimals });
}

function shortenAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function BalanceSection() {
  const { publicKey } = useWallet();
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState<BalanceData | null>(null);
  const [price, setPrice] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-fill address when wallet connects
  useEffect(() => {
    if (publicKey) {
      setAddress(publicKey.toBase58());
    }
  }, [publicKey]);

  // Auto-lookup when wallet connects
  useEffect(() => {
    if (publicKey && address === publicKey.toBase58()) {
      lookupBalance();
    }
  }, [address]); // eslint-disable-line react-hooks/exhaustive-deps

  async function lookupBalance() {
    if (!address.trim()) return;
    setLoading(true);
    setError('');
    setBalance(null);
    setPrice(null);

    try {
      const [balRes, priceRes] = await Promise.all([
        fetch(`/api/wallet/balance?address=${encodeURIComponent(address.trim())}`),
        fetch('/api/wallet/price'),
      ]);

      if (!balRes.ok) {
        const err = await balRes.json();
        throw new Error(err.error || 'Failed to fetch balance');
      }

      const balData: BalanceData = await balRes.json();
      setBalance(balData);

      if (priceRes.ok) {
        const priceData: PriceData = await priceRes.json();
        setPrice(priceData);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch balance');
    } finally {
      setLoading(false);
    }
  }

  const mindUsd = balance && price ? balance.mind * price.mind_price_usd : null;
  const solUsd = balance && price ? balance.sol * price.sol_price_usd : null;

  return (
    <section className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
      <h2 className="text-xl font-bold mb-4">Wallet Balance</h2>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && lookupBalance()}
          placeholder="Solana wallet address"
          className="flex-1 px-4 py-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 font-mono text-sm focus:outline-none focus:border-amber-500/50"
        />
        <button
          onClick={lookupBalance}
          disabled={loading || !address.trim()}
          className="px-5 py-2.5 rounded-lg bg-amber-500 text-black font-medium text-sm hover:bg-amber-400 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : 'Lookup'}
        </button>
      </div>

      {error && (
        <p className="text-red-400 text-sm mb-4">{error}</p>
      )}

      {balance && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-zinc-500 text-sm">Address:</span>
            <a
              href={`https://solscan.io/account/${balance.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm text-amber-500 hover:text-amber-400 transition"
            >
              {shortenAddress(balance.address)}
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* MIND Balance */}
            <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/30">
              <p className="text-zinc-500 text-xs mb-1">$MIND Balance</p>
              <p className="text-2xl font-bold text-white">{formatNumber(balance.mind, 2)}</p>
              {mindUsd !== null && (
                <p className="text-zinc-500 text-sm mt-1">
                  ≈ ${formatNumber(mindUsd, 2)} USD
                </p>
              )}
              {!balance.has_mind_ata && (
                <p className="text-amber-500/70 text-xs mt-2">No $MIND token account</p>
              )}
            </div>

            {/* SOL Balance */}
            <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/30">
              <p className="text-zinc-500 text-xs mb-1">SOL Balance</p>
              <p className="text-2xl font-bold text-white">{formatNumber(balance.sol, 4)}</p>
              {solUsd !== null && (
                <p className="text-zinc-500 text-sm mt-1">
                  ≈ ${formatNumber(solUsd, 2)} USD
                </p>
              )}
            </div>
          </div>

          {/* Price info */}
          {price && (
            <div className="flex flex-wrap gap-4 pt-3 border-t border-zinc-800">
              <div>
                <p className="text-zinc-600 text-xs">$MIND Price</p>
                <p className="text-white text-sm font-medium">${price.mind_price_usd.toFixed(6)}</p>
              </div>
              <div>
                <p className="text-zinc-600 text-xs">MIND/SOL</p>
                <p className="text-white text-sm font-medium">{formatNumber(price.mind_per_sol, 2)}</p>
              </div>
              <div>
                <p className="text-zinc-600 text-xs">SOL Price</p>
                <p className="text-white text-sm font-medium">${formatNumber(price.sol_price_usd, 2)}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function TransferSection() {
  const { publicKey } = useWallet();
  const [sender, setSender] = useState('');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState<PrepareData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-fill sender when wallet connects
  useEffect(() => {
    if (publicKey) {
      setSender(publicKey.toBase58());
    }
  }, [publicKey]);

  async function prepareTransfer() {
    if (!sender.trim() || !recipient.trim() || !amount.trim()) return;
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Amount must be a positive number');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/wallet/transfer/prepare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: sender.trim(), recipient: recipient.trim(), amount: amountNum }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to prepare transfer');
      }

      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to prepare transfer');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
      <h2 className="text-xl font-bold mb-4">Prepare Transfer</h2>
      <p className="text-zinc-500 text-sm mb-6">
        Preview a $MIND transfer before signing. Shows fees, ATA status, and net amount.
      </p>

      <div className="space-y-4 mb-6">
        <div>
          <label className="text-zinc-400 text-xs mb-1 block">Sender Wallet</label>
          <input
            type="text"
            value={sender}
            onChange={(e) => setSender(e.target.value)}
            placeholder="Sender Solana address"
            className="w-full px-4 py-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 font-mono text-sm focus:outline-none focus:border-amber-500/50"
          />
        </div>
        <div>
          <label className="text-zinc-400 text-xs mb-1 block">Recipient Wallet</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Recipient Solana address"
            className="w-full px-4 py-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 font-mono text-sm focus:outline-none focus:border-amber-500/50"
          />
        </div>
        <div>
          <label className="text-zinc-400 text-xs mb-1 block">Amount ($MIND)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && prepareTransfer()}
            placeholder="0.00"
            min="0"
            step="any"
            className="w-full px-4 py-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 font-mono text-sm focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <button
          onClick={prepareTransfer}
          disabled={loading || !sender.trim() || !recipient.trim() || !amount.trim()}
          className="w-full px-5 py-2.5 rounded-lg bg-amber-500 text-black font-medium text-sm hover:bg-amber-400 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? 'Preparing...' : 'Preview Transfer'}
        </button>
      </div>

      {error && (
        <p className="text-red-400 text-sm mb-4">{error}</p>
      )}

      {result && (
        <div className="p-4 rounded-lg border border-amber-500/30 bg-amber-500/5 space-y-3">
          <h3 className="text-amber-500 font-medium text-sm">Transfer Preview</h3>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-zinc-500 text-xs">Send Amount</p>
              <p className="text-white font-medium">{formatNumber(result.amount, 4)} $MIND</p>
            </div>
            <div>
              <p className="text-zinc-500 text-xs">Transfer Fee (1%)</p>
              <p className="text-red-400 font-medium">-{formatNumber(result.transfer_fee, 4)} $MIND</p>
            </div>
            <div>
              <p className="text-zinc-500 text-xs">Recipient Receives</p>
              <p className="text-green-400 font-medium">{formatNumber(result.receive_amount, 4)} $MIND</p>
            </div>
            <div>
              <p className="text-zinc-500 text-xs">Sender Balance</p>
              <p className="text-white font-medium">{formatNumber(result.sender_balance, 4)} $MIND</p>
            </div>
          </div>

          {result.needs_ata && (
            <div className="pt-3 border-t border-zinc-800">
              <p className="text-amber-500/80 text-sm">
                Recipient needs a new token account. Rent cost: ~{result.ata_rent_sol.toFixed(4)} SOL
              </p>
            </div>
          )}

          <div className="pt-3 border-t border-zinc-800 flex gap-4 text-xs">
            <div>
              <span className="text-zinc-600">From: </span>
              <a
                href={`https://solscan.io/account/${result.sender}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-amber-500 font-mono transition"
              >
                {shortenAddress(result.sender)}
              </a>
            </div>
            <div>
              <span className="text-zinc-600">To: </span>
              <a
                href={`https://solscan.io/account/${result.recipient}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-amber-500 font-mono transition"
              >
                {shortenAddress(result.recipient)}
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default function WalletPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-24">
        <header className="text-center mb-16">
          <p className="text-amber-500/80 text-sm tracking-widest uppercase mb-4">
            Dashboard
          </p>
          <h1 className="text-4xl md:text-5xl font-bold font-mono mb-4">$MIND Wallet</h1>
          <p className="text-zinc-500 text-lg mb-6">
            Check balances and prepare transfers on Solana.
          </p>

          {/* Wallet Connect Button */}
          <div className="flex justify-center mb-4">
            <WalletMultiButton style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#000',
              fontWeight: 600,
              borderRadius: '12px',
              fontSize: '14px',
              height: '44px',
            }} />
          </div>
        </header>

        {/* Token quick info */}
        <div className="flex flex-wrap justify-center gap-4 mb-6 text-xs text-zinc-500">
          <span>Token-2022</span>
          <span>|</span>
          <span>1% Transfer Fee</span>
          <span>|</span>
          <a
            href={`https://solscan.io/token/${MIND_CA}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono hover:text-amber-500 transition"
          >
            {shortenAddress(MIND_CA)}
          </a>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <a
            href={`https://jup.ag/swap/SOL-${MIND_CA}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-500 text-sm font-medium hover:bg-amber-500/20 transition"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            Swap on Jupiter
          </a>
          <a
            href={FLUXBEAM_LP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-medium hover:bg-blue-500/20 transition"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Provide Liquidity
          </a>
          <a
            href={`https://dexscreener.com/solana/${MIND_CA}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-800/80 border border-zinc-700/50 text-zinc-400 text-sm font-medium hover:bg-zinc-800 hover:text-zinc-300 transition"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
            Chart
          </a>
        </div>

        <div className="space-y-8">
          <BalanceSection />
          <TransferSection />
        </div>
      </div>
    </main>
  );
}
