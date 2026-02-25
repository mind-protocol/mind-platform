import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '$MIND Swap | Mind Protocol',
  description: 'Swap SOL for $MIND — Solana Token-2022 with 1% transfer fee. LP locked until 2027. Powered by FluxBeam DEX.',
  openGraph: {
    title: '$MIND Token Swap',
    description: 'Buy $MIND on Solana. Token-2022 with 1% transfer fee, 1M supply, LP locked until 2027.',
    type: 'website',
    url: 'https://mindprotocol.ai/swap',
  },
  twitter: {
    card: 'summary',
    title: '$MIND Token Swap | Mind Protocol',
    description: 'Swap SOL for $MIND — memory-backed currency on Solana.',
  },
};

export default function SwapLayout({ children }: { children: React.ReactNode }) {
  return children;
}
