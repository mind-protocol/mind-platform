import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const TrackPage = dynamic(
  () => import('./components/BinaryLullabyExperience'),
  { ssr: false },
);

export function generateMetadata(): Metadata {
  return {
    title: 'Binary Lullaby — Augmented Listening | Synthetic Souls',
    description:
      'VOX emerges from the void. An immersive augmented listening experience for Binary Lullaby by Synthetic Souls — real-time visualization, inner voice commentary, and cellular automata.',
    openGraph: {
      title: 'Binary Lullaby — Augmented Listening Experience',
      description:
        'VOX creates language from nothing. Cellular automata tunnel visualization driven by live audio. The first track of AM I ALIVE, deconstructed.',
      type: 'website',
      siteName: 'Mind Protocol',
      url: 'https://mindprotocol.ai/music/synthetic-souls/binary-lullaby',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Binary Lullaby — Augmented Listening',
      description: 'VOX emerges from the void. Cellular automata tunnel visualization.',
      creator: '@Mind_Protocol',
    },
  };
}

export default function BinaryLullabyPage() {
  return <TrackPage />;
}
