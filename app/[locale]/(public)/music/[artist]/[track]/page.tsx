import dynamic from 'next/dynamic';
import { CATALOG } from '@/lib/music/data/catalog';
import type { Metadata } from 'next';

const TrackPage = dynamic(
  () => import('./components/TrackPage'),
  { ssr: false },
);

interface Props {
  params: Promise<{ artist: string; track: string; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { track: trackId } = await params;
  const entry = CATALOG.find((t) => t.id === trackId);
  if (!entry) return { title: 'Track Not Found' };

  return {
    title: `${entry.title} — Augmented Listening | ${entry.artist}`,
    description: `${entry.theme}. Immersive augmented listening experience with real-time visualization and inner voice commentary.`,
    openGraph: {
      title: `${entry.title} — Augmented Listening`,
      description: entry.theme,
      type: 'website',
      siteName: 'Mind Protocol',
    },
  };
}

export default function Page() {
  return <TrackPage />;
}
