import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '14km Runcoding | Mind Protocol',
  description:
    '14km through the hills of Marcy-l\'Etoile. Voice messages mid-stride. 8 autonomous tasks completed. His AI reads his body, codes a GPS reader, onboards a community member — all while he runs. He runs. It codes. They converge.',
  openGraph: {
    title: '14km Runcoding',
    description:
      'When your AI codes while you run. 14km through Lyon, 176 bpm peak, 28 messages, 8 autonomous tasks. Persistent intelligence in action.',
    type: 'article',
    siteName: 'Mind Protocol',
    locale: 'en_US',
    url: 'https://mindprotocol.ai/blog/runcoding',
  },
  twitter: {
    card: 'summary_large_image',
    title: '14km Runcoding — Mind Protocol',
    description:
      'When your AI codes while you run. 14km, 176 bpm peak, 28 messages, 8 autonomous tasks. He runs. It codes. They converge.',
    creator: '@Mind_Protocol',
  },
};

export default function RuncodingLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
