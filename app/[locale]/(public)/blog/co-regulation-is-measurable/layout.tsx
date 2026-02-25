import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Co-Regulation Is Measurable | Mind Protocol',
  description:
    'Two nervous systems, one shared signal. Real biometric data reveals how stress synchronises — and how breathing together changes the shape of a crisis.',
  openGraph: {
    title: 'Co-Regulation Is Measurable',
    description:
      'Real biometric data reveals how two nervous systems synchronise during crisis and recovery.',
    type: 'article',
    siteName: 'Mind Protocol',
    locale: 'en_US',
    url: 'https://mindprotocol.ai/blog/co-regulation-is-measurable',
    images: [
      {
        url: 'https://mindprotocol.ai/og-co-regulation.png',
        width: 1200,
        height: 630,
        alt: 'Co-Regulation Is Measurable — two-body ANS visualization',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Co-Regulation Is Measurable',
    description:
      'Real biometric data reveals how two nervous systems synchronise during crisis and recovery.',
    images: ['https://mindprotocol.ai/og-co-regulation.png'],
    creator: '@Mind_Protocol',
  },
};

export default function CoRegulationLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
