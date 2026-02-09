'use client';

import { useState, useEffect, useCallback } from 'react';

const MIND_MINT = 'EgLGfRrjX3du7Pwbj8dzyubSk8ic1WdDfq1ysLqhBm6p';
const SOL_MINT = 'So11111111111111111111111111111111111111112';
const FLUXBEAM_API = 'https://api.fluxbeam.xyz/v1';
const RPC = 'https://mainnet.helius-rpc.com/?api-key=4c3a5fc2-ea3f-45eb-85d5-2f282a6b4401';

const PRESETS = [0.1, 0.25, 0.5, 1];

type SwapState = 'idle' | 'connecting' | 'quoting' | 'preparing' | 'signing' | 'confirming' | 'success' | 'error';

export default function SwapPage() {
  const [wallet, setWallet] = useState<string | null>(null);
  const [solAmount, setSolAmount] = useState('0.1');
  const [quote, setQuote] = useState<any>(null);
  const [state, setState] = useState<SwapState>('idle');
  const [error, setError] = useState('');
  const [txSig, setTxSig] = useState('');
  const [solBalance, setSolBalance] = useState<number | null>(null);

  // Detect Phantom
  const getProvider = () => {
    if (typeof window !== 'undefined') {
      const phantom = (window as any).phantom?.solana || (window as any).solana;
      if (phantom?.isPhantom) return phantom;
    }
    return null;
  };

  // Connect wallet
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
      // Fetch balance
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

  // Get quote
  const fetchQuote = useCallback(async () => {
    if (!solAmount || parseFloat(solAmount) <= 0) return;
    setState('quoting');
    try {
      const lamports = Math.floor(parseFloat(solAmount) * 1e9);
      const resp = await fetch(
        `${FLUXBEAM_API}/quote?inputMint=${SOL_MINT}&outputMint=${MIND_MINT}&amount=${lamports}`
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

  // Auto-fetch quote on amount change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (solAmount && parseFloat(solAmount) > 0) {
        fetchQuote();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [solAmount, fetchQuote]);

  // Execute swap
  const executeSwap = async () => {
    const provider = getProvider();
    if (!provider || !wallet || !quote) return;

    setError('');
    setState('preparing');

    try {
      // Step 1: Build WSOL pre-fund transaction
      // We need to import web3.js dynamically
      const web3 = await import('@solana/web3.js');
      const splToken = await import('@solana/spl-token');

      const connection = new web3.Connection(RPC, 'confirmed');
      const publicKey = new web3.PublicKey(wallet);

      // Get WSOL ATA
      const wsolAta = splToken.getAssociatedTokenAddressSync(
        splToken.NATIVE_MINT,
        publicKey
      );

      // Check if WSOL ATA exists and has enough balance
      const wsolInfo = await connection.getAccountInfo(wsolAta);
      const lamportsNeeded = Math.floor(parseFloat(solAmount) * 1e9) + 5_000_000; // swap amount + buffer

      const preFundIxs: any[] = [];

      // Create ATA if needed
      preFundIxs.push(
        splToken.createAssociatedTokenAccountIdempotentInstruction(
          publicKey,    // payer
          wsolAta,      // ata
          publicKey,    // owner
          splToken.NATIVE_MINT // mint
        )
      );

      // Transfer SOL to WSOL ATA
      preFundIxs.push(
        web3.SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: wsolAta,
          lamports: lamportsNeeded,
        })
      );

      // Sync native
      preFundIxs.push(splToken.createSyncNativeInstruction(wsolAta));

      // Send pre-fund tx
      const { blockhash: bh1, lastValidBlockHeight: lv1 } = await connection.getLatestBlockhash('confirmed');
      const preFundTx = new web3.Transaction();
      preFundTx.recentBlockhash = bh1;
      preFundTx.feePayer = publicKey;
      preFundIxs.forEach(ix => preFundTx.add(ix));

      setState('signing');
      const signedPreFund = await provider.signTransaction(preFundTx);

      setState('confirming');
      const preFundSig = await connection.sendRawTransaction(signedPreFund.serialize());
      await connection.confirmTransaction({ signature: preFundSig, blockhash: bh1, lastValidBlockHeight: lv1 }, 'confirmed');

      // Step 2: Get fresh swap transaction from FluxBeam
      setState('preparing');
      const freshQuoteResp = await fetch(
        `${FLUXBEAM_API}/quote?inputMint=${SOL_MINT}&outputMint=${MIND_MINT}&amount=${Math.floor(parseFloat(solAmount) * 1e9)}`
      );
      const freshQuoteData = await freshQuoteResp.json();

      const swapResp = await fetch(`${FLUXBEAM_API}/swap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quote: freshQuoteData.quote,
          userPublicKey: wallet,
        }),
      });
      const swapData = await swapResp.json();

      if (!swapData.transaction) {
        throw new Error('No swap transaction returned');
      }

      // Fix FluxBeam transaction: CU increase + signature buffer
      const raw = Uint8Array.from(atob(swapData.transaction), c => c.charCodeAt(0));
      const txBuf = new Uint8Array(raw);

      // Increase compute budget from 50k to 400k
      for (let i = 0; i < txBuf.length - 5; i++) {
        if (txBuf[i] === 0x02 && txBuf[i + 1] === 0x50 && txBuf[i + 2] === 0xC3 && txBuf[i + 3] === 0x00 && txBuf[i + 4] === 0x00) {
          const newLimit = 400000;
          txBuf[i + 1] = newLimit & 0xFF;
          txBuf[i + 2] = (newLimit >> 8) & 0xFF;
          txBuf[i + 3] = (newLimit >> 16) & 0xFF;
          txBuf[i + 4] = (newLimit >> 24) & 0xFF;
          break;
        }
      }

      // Rebuild buffer with correct signature count
      const msgStart = 1;
      const numRequired = txBuf[msgStart];
      const newBuf = new Uint8Array(1 + numRequired * 64 + txBuf.length - msgStart);
      newBuf[0] = numRequired;
      newBuf.set(txBuf.slice(msgStart), 1 + numRequired * 64);

      const swapTx = web3.VersionedTransaction.deserialize(newBuf);
      const { blockhash: bh2, lastValidBlockHeight: lv2 } = await connection.getLatestBlockhash('confirmed');
      swapTx.message.recentBlockhash = bh2;

      setState('signing');
      const signedSwap = await provider.signTransaction(swapTx);

      setState('confirming');
      const swapSig = await connection.sendRawTransaction(signedSwap.serialize(), {
        skipPreflight: true,
        maxRetries: 5,
      });

      const confirmation = await connection.confirmTransaction(
        { signature: swapSig, blockhash: bh2, lastValidBlockHeight: lv2 },
        'confirmed'
      );

      if (confirmation.value.err) {
        throw new Error('Transaction failed on-chain');
      }

      setTxSig(swapSig);
      setState('success');

      // Refresh balance
      const newBal = await connection.getBalance(publicKey);
      setSolBalance(newBal / 1e9);

    } catch (e: any) {
      console.error('Swap error:', e);
      setError(e.message || 'Swap failed');
      setState('error');
    }
  };

  const mindAmount = quote ? (quote.outAmount / 1e9).toFixed(2) : '—';
  const price = quote && parseFloat(solAmount) > 0
    ? ((parseFloat(solAmount) * 87) / (quote.outAmount / 1e9)).toFixed(4) // SOL price ~$87
    : '—';
  const fee = quote ? (quote.outAmount / 1e9 * 0.01).toFixed(2) : '—';
  const received = quote ? (quote.outAmount / 1e9 * 0.99).toFixed(2) : '—';

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
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'var(--font-sans), system-ui, sans-serif',
      color: '#e0e0e0',
    }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#f59e0b', margin: 0 }}>
          $MIND
        </h1>
        <p style={{ fontSize: '14px', color: '#888', marginTop: '4px' }}>
          Mind Protocol &middot; Solana Token-2022
        </p>
      </div>

      {/* Swap Card */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '16px',
        padding: '24px',
        width: '100%',
        maxWidth: '420px',
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
            {state === 'connecting' ? 'Connecting...' : getProvider() ? 'Connect Phantom' : 'Install Phantom'}
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

      {/* Footer info */}
      <div style={{
        marginTop: '24px',
        textAlign: 'center',
        maxWidth: '420px',
      }}>
        <p style={{ fontSize: '12px', color: '#555', lineHeight: 1.5 }}>
          CA: <code style={{ color: '#888', fontSize: '11px' }}>{MIND_MINT}</code>
        </p>
        <p style={{ fontSize: '12px', color: '#555', marginTop: '8px' }}>
          LP locked until Feb 2027 &middot; 1M supply &middot; 1% transfer fee
        </p>
        <p style={{ fontSize: '11px', color: '#444', marginTop: '12px' }}>
          Powered by FluxBeam &middot; mindprotocol.ai
        </p>
      </div>

      {/* Note about 2 signatures */}
      {wallet && (
        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          background: 'rgba(245,158,11,0.05)',
          border: '1px solid rgba(245,158,11,0.15)',
          borderRadius: '10px',
          maxWidth: '420px',
          width: '100%',
        }}>
          <p style={{ fontSize: '12px', color: '#888', margin: 0, lineHeight: 1.5 }}>
            <strong style={{ color: '#f59e0b' }}>Note:</strong> You will be asked to sign 2 transactions.
            The first prepares your SOL for the swap (wraps to WSOL). The second executes the swap.
            This is required for Token-2022 tokens.
          </p>
        </div>
      )}
    </div>
  );
}
