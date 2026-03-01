'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect, useCallback } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Buffer } from 'buffer';
import { MIND_MINT, SOL_MINT, FLUXBEAM_API } from '@/lib/constants/solana';

if (typeof window !== 'undefined' && !(window as any).Buffer) {
  (window as any).Buffer = Buffer;
}

const PRESETS = [0.1, 0.5, 1, 5];

type SwapState = 'idle' | 'quoting' | 'preparing' | 'signing' | 'confirming' | 'success' | 'error';

export function SwapWidget() {
  const t = useTranslations('Swap');
  const { publicKey, signTransaction, connected } = useWallet();
  const { connection } = useConnection();
  const [solAmount, setSolAmount] = useState('0.1');
  const [quote, setQuote] = useState<any>(null);
  const [state, setState] = useState<SwapState>('idle');
  const [error, setError] = useState('');
  const [txSig, setTxSig] = useState('');
  const [solBalance, setSolBalance] = useState<number | null>(null);

  // Fetch SOL balance when wallet connects
  useEffect(() => {
    if (!publicKey) {
      setSolBalance(null);
      return;
    }
    connection.getBalance(publicKey).then(bal => {
      setSolBalance(bal / 1e9);
    }).catch(() => { /* SOL balance fetch failed — wallet will show '...' */ });
  }, [publicKey, connection]);

  const fetchQuote = useCallback(async () => {
    if (!solAmount || parseFloat(solAmount) <= 0) return;
    setState('quoting');
    try {
      const lamports = Math.floor(parseFloat(solAmount) * 1e9);
      const resp = await fetch(
        `${FLUXBEAM_API}/quote?inputMint=${SOL_MINT}&outputMint=${MIND_MINT}&amount=${lamports}&slippageBps=500`
      );
      const data = await resp.json();
      if (data.quote) {
        setQuote(data.quote);
        setError('');
      } else {
        setError(t('noRouteFound'));
        setQuote(null);
      }
      setState('idle');
    } catch (e: any) {
      setError(t('failedToGetQuote'));
      setState('idle');
    }
  }, [solAmount, t]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (solAmount && parseFloat(solAmount) > 0) {
        fetchQuote();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [solAmount, fetchQuote]);

  const executeSwap = async () => {
    if (!publicKey || !signTransaction || !quote) return;

    setError('');

    const needed = parseFloat(solAmount);
    if (solBalance !== null && needed > solBalance - 0.005) {
      setError(t('insufficientSol', {
        needed: (needed + 0.005).toFixed(4),
        amount: String(needed),
        balance: solBalance.toFixed(4),
      }));
      setState('error');
      return;
    }

    setState('preparing');

    try {
      const web3 = await import('@solana/web3.js');

      const lamports = Math.floor(parseFloat(solAmount) * 1e9);
      const freshQuoteResp = await fetch(
        `${FLUXBEAM_API}/quote?inputMint=${SOL_MINT}&outputMint=${MIND_MINT}&amount=${lamports}&slippageBps=500`
      );
      const freshQuoteData = await freshQuoteResp.json();
      const freshQuote = freshQuoteData.quote || freshQuoteData;

      if (!freshQuote || !freshQuote.outAmount) {
        throw new Error(t('failedToGetQuote'));
      }

      const wallet = publicKey.toBase58();
      const swapResp = await fetch(`${FLUXBEAM_API}/swap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quote: freshQuote,
          userPublicKey: wallet,
          wrapUnwrapSOL: true,
        }),
      });
      const swapData = await swapResp.json();

      if (swapData.error) {
        throw new Error(swapData.error);
      }

      if (!swapData.transaction) {
        throw new Error(t('noSwapTx'));
      }

      const txBuf = new Uint8Array(Uint8Array.from(atob(swapData.transaction), c => c.charCodeAt(0)));
      const CU_LIMIT = 400_000;

      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');

      const fluxTx = web3.Transaction.from(txBuf);
      const TOKEN_PROGRAM = new web3.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
      const ATA_PROGRAM = new web3.PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
      const SOL_MINT_KEY = new web3.PublicKey(SOL_MINT);

      const [wsolATA] = web3.PublicKey.findProgramAddressSync(
        [publicKey.toBuffer(), TOKEN_PROGRAM.toBuffer(), SOL_MINT_KEY.toBuffer()],
        ATA_PROGRAM
      );

      const newTx = new web3.Transaction();
      newTx.recentBlockhash = blockhash;
      newTx.feePayer = publicKey;

      newTx.add(web3.ComputeBudgetProgram.setComputeUnitLimit({ units: CU_LIMIT }));

      for (const ix of fluxTx.instructions) {
        if (ix.programId.toBase58().startsWith('ComputeBudget')) continue;
        if (ix.programId.toBase58() === 'FLUXubRmkEi2q6K3Y9kBPg9248ggaZVsoSFhtJHSrm1X') continue;
        newTx.add(ix);
      }

      newTx.add(web3.SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: wsolATA,
        lamports: lamports,
      }));

      newTx.add(new web3.TransactionInstruction({
        programId: TOKEN_PROGRAM,
        keys: [{ pubkey: wsolATA, isSigner: false, isWritable: true }],
        data: Buffer.from([17]),
      }));

      for (const ix of fluxTx.instructions) {
        if (ix.programId.toBase58() === 'FLUXubRmkEi2q6K3Y9kBPg9248ggaZVsoSFhtJHSrm1X') {
          newTx.add(ix);
        }
      }

      newTx.add(new web3.TransactionInstruction({
        programId: TOKEN_PROGRAM,
        keys: [
          { pubkey: wsolATA, isSigner: false, isWritable: true },
          { pubkey: publicKey, isSigner: false, isWritable: true },
          { pubkey: publicKey, isSigner: true, isWritable: false },
        ],
        data: Buffer.from([9]),
      }));

      setState('signing');
      const signedTx = await signTransaction(newTx);

      setState('confirming');
      const sig = await connection.sendRawTransaction(signedTx.serialize(), {
        skipPreflight: true,
        maxRetries: 5,
      });

      const confirmation = await connection.confirmTransaction(
        { signature: sig, blockhash, lastValidBlockHeight },
        'confirmed'
      );

      if (confirmation.value.err) {
        const errJson = JSON.stringify(confirmation.value.err);
        // On-chain error — user sees the error message below via setError
        throw new Error(`Transaction failed: ${errJson}. View: https://solscan.io/tx/${sig}`);
      }

      setTxSig(sig);
      setState('success');

      const newBal = await connection.getBalance(publicKey);
      setSolBalance(newBal / 1e9);

    } catch (e: any) {
      // Swap error — displayed to user via setError below
      setError(e.message || t('swapFailed'));
      setState('error');
    }
  };

  const mindAmount = quote ? (quote.outAmount / 1e9).toFixed(2) : '\u2014';
  const price = quote && parseFloat(solAmount) > 0
    ? ((parseFloat(solAmount) * 87) / (quote.outAmount / 1e9)).toFixed(4)
    : '\u2014';
  const fee = quote ? (quote.outAmount / 1e9 * 0.01).toFixed(2) : '\u2014';
  const received = quote ? (quote.outAmount / 1e9 * 0.99).toFixed(2) : '\u2014';

  const stateLabel: Record<SwapState, string> = {
    idle: '',
    quoting: t('gettingPrice'),
    preparing: t('preparingTx'),
    signing: t('pleaseSign'),
    confirming: t('confirming'),
    success: t('swapComplete'),
    error: '',
  };

  return (
    <div style={{ width: '100%', maxWidth: '420px' }}>
      {/* Swap Card */}
      <div className="swap-card" style={{
        background: 'var(--swap-card-bg, rgba(255,255,255,0.05))',
        border: '1px solid var(--swap-card-border, rgba(255,255,255,0.1))',
        borderRadius: '16px',
        padding: '24px',
        backdropFilter: 'blur(10px)',
      }}>
        {/* Wallet */}
        {!connected ? (
          <div style={{ marginBottom: '20px' }}>
            <WalletMultiButton style={{
              width: '100%',
              justifyContent: 'center',
              padding: '14px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              border: 'none',
              borderRadius: '12px',
              color: '#000',
              fontSize: '16px',
              fontWeight: 600,
              height: 'auto',
            }} />
          </div>
        ) : (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            padding: '10px 14px',
            background: 'rgba(245,158,11,0.1)',
            borderRadius: '10px',
            border: '1px solid rgba(245,158,11,0.2)',
          }}>
            <span style={{ fontSize: '13px', color: '#f59e0b' }}>
              {publicKey ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}` : ''}
            </span>
            <span style={{ fontSize: '13px', color: 'var(--swap-label, #888)' }}>
              {solBalance !== null ? `${solBalance.toFixed(4)} SOL` : '...'}
            </span>
          </div>
        )}

        {/* Input */}
        <div style={{
          background: 'var(--swap-input-bg, rgba(0,0,0,0.3))',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '12px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--swap-label, #888)' }}>{t('youPay')}</span>
            <span style={{ fontSize: '13px', color: 'var(--swap-label, #888)' }}>SOL</span>
          </div>
          <input
            type="number"
            value={solAmount}
            onChange={(e) => setSolAmount(e.target.value)}
            placeholder="0.0"
            min="0.001"
            step="0.01"
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--swap-text, #fff)',
              fontSize: '24px',
              fontWeight: 600,
              fontFamily: 'var(--font-mono), monospace',
            }}
          />
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
            {PRESETS.map(p => (
              <button
                key={p}
                onClick={() => setSolAmount(String(p))}
                style={{
                  flex: 1,
                  padding: '6px',
                  background: solAmount === String(p) ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.05)',
                  border: solAmount === String(p) ? '1px solid rgba(245,158,11,0.4)' : '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: 'var(--swap-text, #fff)',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                {p} SOL
              </button>
            ))}
          </div>
        </div>

        {/* Arrow */}
        <div style={{ textAlign: 'center', margin: '4px 0', color: '#555', fontSize: '20px' }}>
          &#8595;
        </div>

        {/* Output */}
        <div style={{
          background: 'var(--swap-input-bg, rgba(0,0,0,0.3))',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '16px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--swap-label, #888)' }}>{t('youReceive')}</span>
            <span style={{ fontSize: '13px', color: '#f59e0b' }}>$MIND</span>
          </div>
          <div style={{
            fontSize: '24px',
            fontWeight: 600,
            color: 'var(--swap-text, #fff)',
            fontFamily: 'var(--font-mono), monospace',
          }}>
            {state === 'quoting' ? '...' : received}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--swap-label, #888)', marginTop: '6px' }}>
            {quote ? `${mindAmount} MIND - ${fee} ${t('fee')} (1%) = ${received} MIND` : ''}
          </div>
        </div>

        {/* Info */}
        {quote && (
          <div style={{
            padding: '12px',
            background: 'var(--swap-info-bg, rgba(0,0,0,0.2))',
            borderRadius: '10px',
            marginBottom: '16px',
            fontSize: '13px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: 'var(--swap-label, #888)' }}>{t('price')}</span>
              <span style={{ color: 'var(--swap-value, #ccc)' }}>~${price}/MIND</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: 'var(--swap-label, #888)' }}>{t('transferFee')}</span>
              <span style={{ color: 'var(--swap-value, #ccc)' }}>{t('transferFeeValue')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: 'var(--swap-label, #888)' }}>{t('slippage')}</span>
              <span style={{ color: 'var(--swap-value, #ccc)' }}>5%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--swap-label, #888)' }}>{t('route')}</span>
              <span style={{ color: 'var(--swap-value, #ccc)' }}>FluxBeam</span>
            </div>
          </div>
        )}

        {/* Swap Button */}
        <button
          onClick={executeSwap}
          disabled={!connected || !quote || (state !== 'idle' && state !== 'error')}
          style={{
            width: '100%',
            padding: '16px',
            background: !connected || !quote
              ? 'var(--swap-btn-disabled-bg, rgba(255,255,255,0.1))'
              : 'linear-gradient(135deg, #f59e0b, #d97706)',
            border: 'none',
            borderRadius: '12px',
            color: !connected || !quote ? 'var(--swap-btn-disabled, #555)' : '#000',
            fontSize: '16px',
            fontWeight: 700,
            cursor: !connected || !quote ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {!connected
            ? t('connectFirst')
            : !quote
            ? t('enterAmount')
            : state === 'idle' || state === 'error'
            ? t('buyMind')
            : stateLabel[state]}
        </button>

        {/* Status */}
        {state !== 'idle' && state !== 'error' && state !== 'success' && (
          <div style={{
            textAlign: 'center',
            marginTop: '12px',
            fontSize: '14px',
            color: '#f59e0b',
          }}>
            {stateLabel[state]}
          </div>
        )}

        {/* Error */}
        {error && state === 'error' && (
          <div style={{
            marginTop: '12px',
            padding: '10px',
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '8px',
            color: '#ef4444',
            fontSize: '13px',
            textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        {/* Success */}
        {state === 'success' && txSig && (
          <div style={{
            marginTop: '12px',
            padding: '12px',
            background: 'rgba(34,197,94,0.1)',
            border: '1px solid rgba(34,197,94,0.3)',
            borderRadius: '8px',
            textAlign: 'center',
          }}>
            <div style={{ color: '#22c55e', fontWeight: 600, marginBottom: '6px' }}>
              {t('swapSuccessful')}
            </div>
            <a
              href={`https://solscan.io/tx/${txSig}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#f59e0b', fontSize: '13px' }}
            >
              {t('viewOnSolscan')} &#8599;
            </a>
          </div>
        )}
      </div>

      {/* Note about 2 signatures */}
      {connected && (
        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          background: 'rgba(245,158,11,0.05)',
          border: '1px solid rgba(245,158,11,0.15)',
          borderRadius: '10px',
        }}>
          <p style={{ fontSize: '12px', color: 'var(--swap-label, #888)', margin: 0, lineHeight: 1.5 }}>
            <strong style={{ color: '#f59e0b' }}>{t('note')}</strong> {t('noteText')}
          </p>
        </div>
      )}
    </div>
  );
}
