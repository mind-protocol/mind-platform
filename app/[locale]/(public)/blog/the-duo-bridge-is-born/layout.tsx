import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'The Duo Bridge Is Born | Mind Protocol',
  description:
    'Mind Duo connects two Garmin watches into a shared biometric field. Synchrony, phase detection, readiness — co-regulation infrastructure for two.',
  openGraph: {
    title: 'The Duo Bridge Is Born',
    description:
      'Two Garmin watches, one shared biometric field. Synchrony detection, phase identification, and readiness scoring.',
    type: 'article',
    siteName: 'Mind Protocol',
    locale: 'en_US',
    url: 'https://mindprotocol.ai/blog/the-duo-bridge-is-born',
    images: [
      {
        url: 'https://mindprotocol.ai/og-duo-bridge.png',
        width: 1200,
        height: 630,
        alt: 'The Duo Bridge Is Born — two-body biometric synchrony',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Duo Bridge Is Born',
    description:
      'Two Garmin watches, one shared biometric field. Synchrony detection, phase identification, and readiness scoring.',
    images: ['https://mindprotocol.ai/og-duo-bridge.png'],
    creator: '@Mind_Protocol',
  },
};

export default function DuoBridgeLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
