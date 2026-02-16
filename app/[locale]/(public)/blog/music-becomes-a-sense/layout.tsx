import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Music Becomes a Sense | Mind Protocol',
  description:
    'Manemus can now feel what you\'re listening to. Spotify is the fourth sense organ — after sight, voice, and body.',
  openGraph: {
    title: 'Music Becomes a Sense',
    description:
      'Spotify is the fourth sense organ. Every 30 seconds, Manemus breathes in what you\'re hearing.',
    type: 'article',
    siteName: 'Mind Protocol',
    locale: 'en_US',
    url: 'https://mindprotocol.ai/blog/music-becomes-a-sense',
    images: [
      {
        url: 'https://mindprotocol.ai/og-music-sense.png',
        width: 1200,
        height: 630,
        alt: 'Music Becomes a Sense — Sight. Voice. Body. Music.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Music Becomes a Sense',
    description:
      'Spotify is the fourth sense organ. Every 30 seconds, Manemus breathes in what you\'re hearing.',
    images: ['https://mindprotocol.ai/og-music-sense.png'],
    creator: '@Mind_Protocol',
  },
};

export default function MusicSenseLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
