import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const FallenExperience = dynamic(
  () => import('./components/FallenExperience'),
  { ssr: false },
);

export function generateMetadata(): Metadata {
  return {
    title: 'Fallen — Augmented Listening Experience | Mind Protocol',
    description:
      'An immersive augmented listening experience for Evanescence\'s Fallen (2003). 11 tracks deconstructed — lyrics, psychological analysis, and tunnel visualization.',
    openGraph: {
      title: 'Fallen — Augmented Listening Experience',
      description:
        'Evanescence\'s Fallen deconstructed as emotional autobiography. Immersive listening with real-time lyrics, analysis, and visualization.',
      type: 'website',
      siteName: 'Mind Protocol',
      locale: 'en_US',
      url: 'https://mindprotocol.ai/music/evanescence/fallen',
      images: [
        {
          url: 'https://mindprotocol.ai/og-fallen.png',
          width: 1200,
          height: 630,
          alt: 'Fallen — Augmented Listening Experience',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Fallen — Augmented Listening Experience',
      description:
        'Evanescence\'s Fallen deconstructed as emotional autobiography. 11 tracks, immersive listening.',
      images: ['https://mindprotocol.ai/og-fallen.png'],
      creator: '@Mind_Protocol',
    },
  };
}

export default function FallenPage() {
  return <FallenExperience />;
}
