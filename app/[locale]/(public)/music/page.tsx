import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const MusicMenu = dynamic(() => import('./components/MusicMenu'), { ssr: false });

export function generateMetadata(): Metadata {
  return {
    title: 'Augmented Listening | Mind Protocol',
    description:
      'Immersive music experiences with real-time visualization, inner voice commentary, and cellular automata. Owned catalog by Synthetic Souls and NLR.',
    openGraph: {
      title: 'Augmented Listening — Mind Protocol',
      description:
        'Music deconstructed. Real-time FFT visualization, synchronized lyrics, AI inner voice commentary.',
      type: 'website',
      siteName: 'Mind Protocol',
    },
  };
}

export default function MusicPage() {
  return <MusicMenu />;
}
