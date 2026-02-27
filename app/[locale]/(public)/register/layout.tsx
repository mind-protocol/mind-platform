import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Register | Mind Protocol',
  description: 'Create your Mind Protocol account and start tracking.',
};

export default function RegisterLayout({ children }: { children: ReactNode }) {
  return children;
}
