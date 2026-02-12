'use client';

import { SwapWidget } from '../components/SwapWidget';

const MIND_MINT = 'EgLGfRrjX3du7Pwbj8dzyubSk8ic1WdDfq1ysLqhBm6p';

export default function SwapPage() {
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

      <SwapWidget />

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
        <p style={{ fontSize: '12px', marginTop: '12px' }}>
          <a
            href="https://dexscreener.com/solana/gnpb7yzgckf4efz6satqphm8q3juum3dna7cj8ti8mra"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#f59e0b', textDecoration: 'none' }}
          >
            DexScreener
          </a>
          <span style={{ color: '#444' }}> &middot; </span>
          <a
            href={`https://solscan.io/token/${MIND_MINT}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#888', textDecoration: 'none' }}
          >
            Solscan
          </a>
        </p>
        <p style={{ fontSize: '11px', color: '#444', marginTop: '8px' }}>
          Powered by FluxBeam &middot; mindprotocol.ai
        </p>
      </div>
    </div>
  );
}
