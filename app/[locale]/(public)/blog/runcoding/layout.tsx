import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Runcoding | Mind Protocol',
  description:
    'He runs 8km through winter mist near Lyon. Meanwhile, his AI builds a GPS reader from his live biometric stream. He runs. It codes. They converge.',
  openGraph: {
    title: 'Runcoding',
    description:
      'When your AI codes while you run. 8km through Lyon, 1,856 data points, and a codebase that grew itself.',
    type: 'article',
    siteName: 'Mind Protocol',
    locale: 'en_US',
    url: 'https://mindprotocol.ai/blog/runcoding',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Runcoding — Mind Protocol',
    description:
      'When your AI codes while you run. He runs. It codes. They converge.',
    creator: '@Mind_Protocol',
  },
};

export default function RuncodingLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
