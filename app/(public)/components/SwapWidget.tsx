'use client';

import { useState, useEffect, useCallback } from 'react';
import { Buffer } from 'buffer';

if (typeof window !== 'undefined' && !(window as any).Buffer) {
  (window as any).Buffer = Buffer;
}

const MIND_MINT = 'EgLGfRrjX3du7Pwbj8dzyubSk8ic1WdDfq1ysLqhBm6p';
const SOL_MINT = 'So11111111111111111111111111111111111111112';
const FLUXBEAM_API = 'https://api.fluxbeam.xyz/v1';
const RPC = 'https://mainnet.helius-rpc.com/?api-key=4c3a5fc2-ea3f-45eb-85d5-2f282a6b4401';

const PRESETS = [0.1, 0.5, 1, 5];

type SwapState = 'idle' | 'connecting' | 'quoting' | 'preparing' | 'signing' | 'confirming' | 'success' | 'error';

export function SwapWidget() {
  const [mounted, setMounted] = useState(false);
  const [wallet, setWallet] = useState<string | null>(null);
  const [solAmount, setSolAmount] = useState('0.1');
  const [quote, setQuote] = useState<any>(null);
  const [state, setState] = useState<SwapState>('idle');
  const [error, setError] = useState('');
  const [txSig, setTxSig] = useState('');
  const [solBalance, setSolBalance] = useState<number | null>(null);

  useEffect(() => { setMounted(true); }, []);

  const getProvider = () => {
    if (typeof window !== 'undefined') {
      const phantom = (window as any).phantom?.solana || (window as any).solana;
      if (phantom?.isPhantom) return phantom;
    }
    return null;
  };

  const connectWallet = async () => {
    const provider = getProvider();
    if (!provider) {
      window.open('https://phantom.app/', '_blank');
      return;
    }
    setState('connecting');
    try {
      const resp = await provider.connect();
      const pubkey = resp.publicKey.toString();
      setWallet(pubkey);
      const balResp = await fetch(RPC, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0', id: 1,
          method: 'getBalance',
          params: [pubkey],
        }),
      });
      const balData = await balResp.json();
      setSolBalance((balData.result?.value || 0) / 1e9);
      setState('idle');
    } catch (e: any) {
      setError(e.message || 'Failed to connect');
      setState('error');
    }
  };

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
        setError('No route found');
        setQuote(null);
      }
      setState('idle');
    } catch (e: any) {
      setError('Failed to get quote');
      setState('idle');
    }
  }, [solAmount]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (solAmount && parseFloat(solAmount) > 0) {
        fetchQuote();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [solAmount, fetchQuote]);

  const executeSwap = async () => {
    const provider = getProvider();
    if (!provider || !wallet || !quote) return;

    setError('');
    setState('preparing');

    try {
      const web3 = await import('@solana/web3.js');

      const connection = new web3.Connection(RPC, 'confirmed');
      const publicKey = new web3.PublicKey(wallet);

      // Get fresh quote
      const lamports = Math.floor(parseFloat(solAmount) * 1e9);
      const freshQuoteResp = await fetch(
        `${FLUXBEAM_API}/quote?inputMint=${SOL_MINT}&outputMint=${MIND_MINT}&amount=${lamports}&slippageBps=500`
      );
      const freshQuoteData = await freshQuoteResp.json();
      const freshQuote = freshQuoteData.quote || freshQuoteData;

      if (!freshQuote || !freshQuote.outAmount) {
        throw new Error('Failed to get quote');
      }

      // Get swap transaction from FluxBeam
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
        throw new Error('No swap transaction returned');
      }

      // Deserialize the transaction from FluxBeam (base64)
      const txBuf = new Uint8Array(Uint8Array.from(atob(swapData.transaction), c => c.charCodeAt(0)));

      const CB_PROGRAM = 'ComputeBudget111111111111111111111111111112';
      const CU_LIMIT = 400_000;
      let signedTx: any;
      setState('signing');

      try {
        // Try VersionedTransaction first
        const vTx = web3.VersionedTransaction.deserialize(txBuf);
        // Patch CU limit via proper instruction inspection
        const keys = vTx.message.staticAccountKeys;
        const cbIdx = keys.findIndex((k: any) => k.toBase58() === CB_PROGRAM);
        if (cbIdx >= 0) {
          for (const ix of (vTx.message as any).compiledInstructions) {
            if (ix.programIdIndex === cbIdx && ix.data[0] === 0x02 && ix.data.length === 5) {
              ix.data[1] = CU_LIMIT & 0xff;
              ix.data[2] = (CU_LIMIT >> 8) & 0xff;
              ix.data[3] = (CU_LIMIT >> 16) & 0xff;
              ix.data[4] = (CU_LIMIT >> 24) & 0xff;
              console.log('CU limit patched to 400k (versioned)');
              break;
            }
          }
        }
        signedTx = await provider.signTransaction(vTx);
      } catch (vErr: any) {
        if (vErr?.message?.includes('reject') || vErr?.code === 4001) throw vErr;
        // Fallback to legacy Transaction
        console.log('Versioned tx failed, trying legacy:', vErr.message);
        const legacyTx = web3.Transaction.from(txBuf);
        legacyTx.feePayer = publicKey;
        // Replace CU limit instruction with proper 400k version
        const cbProgramId = new web3.PublicKey(CB_PROGRAM);
        const cuLimitIx = web3.ComputeBudgetProgram.setComputeUnitLimit({ units: CU_LIMIT });
        let cuPatched = false;
        console.log('Legacy tx has', legacyTx.instructions.length, 'instructions');
        for (let i = 0; i < legacyTx.instructions.length; i++) {
          const ix = legacyTx.instructions[i];
          if (ix.programId.equals(cbProgramId)) {
            const d = ix.data;
            console.log(`  CB instruction[${i}]: data.length=${d.length}, data[0]=${d[0]}`);
            if (d.length >= 5 && d[0] === 2) {
              const oldLimit = d[1] | (d[2] << 8) | (d[3] << 16) | (d[4] << 24);
              console.log('  Found SetComputeUnitLimit, current:', oldLimit);
              legacyTx.instructions[i] = cuLimitIx;
              cuPatched = true;
              console.log('  Replaced with', CU_LIMIT);
              break;
            }
          }
        }
        if (!cuPatched) {
          console.log('No CU limit instruction found, prepending one');
          legacyTx.instructions.unshift(cuLimitIx);
        }
        signedTx = await provider.signTransaction(legacyTx);
      }

      setState('confirming');
      const sig = await connection.sendRawTransaction(signedTx.serialize(), {
        skipPreflight: true,
        maxRetries: 5,
      });

      // Use the blockhash from the transaction for confirmation
      const { blockhash: bh, lastValidBlockHeight: lv } = await connection.getLatestBlockhash('confirmed');
      const confirmation = await connection.confirmTransaction(
        { signature: sig, blockhash: bh, lastValidBlockHeight: lv },
        'confirmed'
      );

      if (confirmation.value.err) {
        const errJson = JSON.stringify(confirmation.value.err);
        console.error('On-chain error:', errJson, 'tx:', sig);
        throw new Error(`Transaction failed: ${errJson}. View: https://solscan.io/tx/${sig}`);
      }

      setTxSig(sig);
      setState('success');

      const newBal = await connection.getBalance(publicKey);
      setSolBalance(newBal / 1e9);

    } catch (e: any) {
      console.error('Swap error:', e);
      setError(e.message || 'Swap failed');
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
    connecting: 'Connecting wallet...',
    quoting: 'Getting price...',
    preparing: 'Preparing transaction...',
    signing: 'Please sign in your wallet...',
    confirming: 'Confirming on-chain...',
    success: 'Swap complete!',
    error: '',
  };

  return (
    <div style={{ width: '100%', maxWidth: '420px' }}>
      {/* Swap Card */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '16px',
        padding: '24px',
        backdropFilter: 'blur(10px)',
      }}>
        {/* Wallet */}
        {!wallet ? (
          <button
            onClick={connectWallet}
            disabled={state === 'connecting'}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              border: 'none',
              borderRadius: '12px',
              color: '#000',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: '20px',
            }}
          >
            {state === 'connecting' ? 'Connecting...' : !mounted ? 'Connect Wallet' : getProvider() ? 'Connect Phantom' : 'Install Phantom'}
          </button>
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
              {wallet.slice(0, 4)}...{wallet.slice(-4)}
            </span>
            <span style={{ fontSize: '13px', color: '#888' }}>
              {solBalance !== null ? `${solBalance.toFixed(4)} SOL` : '...'}
            </span>
          </div>
        )}

        {/* Input */}
        <div style={{
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '12px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: '#888' }}>You pay</span>
            <span style={{ fontSize: '13px', color: '#888' }}>SOL</span>
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
              color: '#fff',
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
                  color: '#fff',
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
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '16px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: '#888' }}>You receive</span>
            <span style={{ fontSize: '13px', color: '#f59e0b' }}>$MIND</span>
          </div>
          <div style={{
            fontSize: '24px',
            fontWeight: 600,
            color: '#fff',
            fontFamily: 'var(--font-mono), monospace',
          }}>
            {state === 'quoting' ? '...' : received}
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '6px' }}>
            {quote ? `${mindAmount} MIND - ${fee} fee (1%) = ${received} MIND` : ''}
          </div>
        </div>

        {/* Info */}
        {quote && (
          <div style={{
            padding: '12px',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '10px',
            marginBottom: '16px',
            fontSize: '13px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: '#888' }}>Price</span>
              <span style={{ color: '#ccc' }}>~${price}/MIND</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: '#888' }}>Transfer fee</span>
              <span style={{ color: '#ccc' }}>1% (Token-2022)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: '#888' }}>Slippage</span>
              <span style={{ color: '#ccc' }}>5%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#888' }}>Route</span>
              <span style={{ color: '#ccc' }}>FluxBeam</span>
            </div>
          </div>
        )}

        {/* Swap Button */}
        <button
          onClick={executeSwap}
          disabled={!wallet || !quote || state !== 'idle' && state !== 'error'}
          style={{
            width: '100%',
            padding: '16px',
            background: !wallet || !quote
              ? 'rgba(255,255,255,0.1)'
              : 'linear-gradient(135deg, #f59e0b, #d97706)',
            border: 'none',
            borderRadius: '12px',
            color: !wallet || !quote ? '#555' : '#000',
            fontSize: '16px',
            fontWeight: 700,
            cursor: !wallet || !quote ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {!wallet
            ? 'Connect wallet first'
            : !quote
            ? 'Enter amount'
            : state === 'idle' || state === 'error'
            ? `Buy $MIND`
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
              Swap successful!
            </div>
            <a
              href={`https://solscan.io/tx/${txSig}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#f59e0b', fontSize: '13px' }}
            >
              View on Solscan &#8599;
            </a>
          </div>
        )}
      </div>

      {/* Note about 2 signatures */}
      {wallet && (
        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          background: 'rgba(245,158,11,0.05)',
          border: '1px solid rgba(245,158,11,0.15)',
          borderRadius: '10px',
        }}>
          <p style={{ fontSize: '12px', color: '#888', margin: 0, lineHeight: 1.5 }}>
            <strong style={{ color: '#f59e0b' }}>Note:</strong> Token-2022 with 1% transfer fee.
            5% slippage tolerance for low-liquidity protection.
          </p>
        </div>
      )}
    </div>
  );
}
