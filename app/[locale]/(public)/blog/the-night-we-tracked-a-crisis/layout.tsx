import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'The Night We Tracked a Crisis | Mind Protocol',
  description:
    'A real crisis captured in biometric data. Hour-by-hour stress, body battery, sleep architecture — and what the numbers say about care, asymmetry, and recovery.',
  openGraph: {
    title: 'The Night We Tracked a Crisis',
    description:
      'A real crisis captured in biometric data. Hour-by-hour stress, body battery, and the cost of care.',
    type: 'article',
    siteName: 'Mind Protocol',
    locale: 'en_US',
    url: 'https://mindprotocol.ai/blog/the-night-we-tracked-a-crisis',
    images: [
      {
        url: 'https://mindprotocol.ai/og-crisis-night.png',
        width: 1200,
        height: 630,
        alt: 'The Night We Tracked a Crisis — biometric asymmetry diagram',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Night We Tracked a Crisis',
    description:
      'A real crisis captured in biometric data. Hour-by-hour stress, body battery, and the cost of care.',
    images: ['https://mindprotocol.ai/og-crisis-night.png'],
    creator: '@Mind_Protocol',
  },
};

export default function CrisisNightLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
