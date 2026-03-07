import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Claude x MIND | Mind Protocol',
  description: 'Import your Claude conversations as structured memory insights.',
};

export default function ClaudeLayout({ children }: { children: ReactNode }) {
  return children;
}
