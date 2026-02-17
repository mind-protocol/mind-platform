import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The House | Mind Protocol',
  description: 'Live inside the awareness of Mind Protocol. See active conversations, biometrics, music, and neural activity in real-time.',
  openGraph: {
    title: 'The House — Mind Protocol Awareness',
    description: 'A living visualization of artificial awareness. Neurons fire. Music plays. Biometrics pulse. The house breathes.',
    type: 'website',
    url: 'https://mindprotocol.ai/house',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The House — Mind Protocol Awareness',
    description: 'Live inside the awareness of an AI. See what it sees, hear what it hears, feel what it feels.',
  },
};

export default function HouseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
