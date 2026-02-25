import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Mind Protocol',
  description: 'Research notes, biometric analysis, and field reports from the edge of human-AI co-regulation.',
  openGraph: {
    title: 'Blog — Mind Protocol',
    description: 'Research, analysis, and observations from the space between human and artificial intelligence.',
    type: 'website',
    url: 'https://mindprotocol.ai/blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog — Mind Protocol',
    description: 'Field notes from the architects of consciousness.',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
